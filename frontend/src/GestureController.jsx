import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { GESTURE_CONFIG } from './config';

// Helper for smoothing
const lerp = (start, end, factor) => start + (end - start) * factor;

export const GestureController = ({ onDebugData, onGalaxyRotationChange, onHandsUpdate, flySpeed = 90, enableTwoHandRotation = false, enableHeadTracking = true, edgeThreshold = 0.15, boundaryDistance = 300 }) => {
  const { camera } = useThree();
  const videoRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Store target values (where we want to go)
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetVelocity = useRef(0); // 0 = stop, 1 = forward
  const targetFOV = useRef(60); // Field of view for zoom
  const prevPinchDist = useRef(null); // Track distance between hands
  const prevHandPos = useRef(null); // Track hand position for drag
  const galaxyRotation = useRef({ x: 0, y: 0 }); // Galaxy rotation (for grab)
  
  // Use refs for props that need to be accessed in callbacks (closure fix)
  const enableHeadTrackingRef = useRef(enableHeadTracking);
  const enableTwoHandRotationRef = useRef(enableTwoHandRotation);
  const edgeThresholdRef = useRef(edgeThreshold);
  const flySpeedRef = useRef(flySpeed);
  const boundaryDistanceRef = useRef(boundaryDistance);
  
  // Update refs when props change
  useEffect(() => {
    enableHeadTrackingRef.current = enableHeadTracking;
    enableTwoHandRotationRef.current = enableTwoHandRotation;
    edgeThresholdRef.current = edgeThreshold;
    flySpeedRef.current = flySpeed;
    boundaryDistanceRef.current = boundaryDistance;
  }, [enableHeadTracking, enableTwoHandRotation, edgeThreshold, flySpeed, boundaryDistance]);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoRef.current = videoElement;

    onDebugData({ status: "Initializing MediaPipe..." });

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: GESTURE_CONFIG.maxNumHands,
      modelComplexity: 1,
      minDetectionConfidence: GESTURE_CONFIG.minDetectionConfidence,
      minTrackingConfidence: GESTURE_CONFIG.minTrackingConfidence,
    });

    hands.onResults((results) => {
      // Extract hands
      let leftHand = null;
      let rightHand = null;
      let leftGesture = "IDLE";
      let rightGesture = "IDLE";
      
      if (results.multiHandLandmarks && results.multiHandedness) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
          const landmarks = results.multiHandLandmarks[i];
          const label = results.multiHandedness[i]?.label;
          
          // MediaPipe labels are mirrored (from camera perspective)
          // Swap them to match user's perspective
          if (label === "Left") {
            rightHand = landmarks; // User's right hand
            rightGesture = detectGesture(landmarks);
          }
          if (label === "Right") {
            leftHand = landmarks; // User's left hand
            leftGesture = detectGesture(landmarks);
          }
        }
      }

      // Update hand UI cursors with full landmark data for skeleton drawing
      if (onHandsUpdate) {
        onHandsUpdate({
          left: {
            visible: !!leftHand,
            position: leftHand ? { x: leftHand[9].x, y: leftHand[9].y } : null,
            gesture: leftGesture,
            landmarks: leftHand // Full landmark array for skeleton drawing
          },
          right: {
            visible: !!rightHand,
            position: rightHand ? { x: rightHand[9].x, y: rightHand[9].y } : null,
            gesture: rightGesture,
            landmarks: rightHand // Full landmark array for skeleton drawing
          }
        });
      }

      // DEFAULT: FREEZE (no movement unless explicitly commanded)
      targetVelocity.current = 0;

      // 1. TWO-HAND MODE: ONLY ZOOM (no travel, no rotate)
      // Debug: Log when two hands detected
      if (leftHand && rightHand) {
        console.log('TWO HANDS DETECTED - Zoom mode, travel frozen');
        const leftIndex = leftHand[8]; // Index finger tip
        const rightIndex = rightHand[8];
        const dist = Math.hypot(
          leftIndex.x - rightIndex.x,
          leftIndex.y - rightIndex.y
        );

        if (prevPinchDist.current !== null) {
          const delta = dist - prevPinchDist.current;
          
          // Velocity threshold: Ignore if hands move too fast (repositioning)
          const MIN_DELTA = 0.01;  // Ignore tiny jitters
          const MAX_DELTA = 0.15;  // Ignore super fast movements (repositioning)
          
          if (Math.abs(delta) > MIN_DELTA && Math.abs(delta) < MAX_DELTA) {
            // Spread hands apart (increase dist) -> decrease FOV (zoom in)
            // Bring hands together (decrease dist) -> increase FOV (zoom out)
            targetFOV.current = Math.max(30, Math.min(90, targetFOV.current - delta * 100));
          }
        }
        prevPinchDist.current = dist;
        
        // FREEZE travel when two hands detected
        targetVelocity.current = 0;
        
        onDebugData({ 
          status: "Two Hands - Pinch to Zoom (Travel Frozen)",
          leftHand: leftHand,
          rightHand: rightHand,
          gesture: { categoryName: "PINCH_SCALE" } 
        });
      } else {
        prevPinchDist.current = null;
        
        // 2. SINGLE-HAND MODE: Travel + Rotate
        const activeHand = rightHand || leftHand;
        
        if (activeHand) {
          const gesture = detectGesture(activeHand);
          // Always show the active hand in debug overlay
          onDebugData({ 
            status: `Tracking (${rightHand ? 'Right' : 'Left'} Hand)`, 
            leftHand: leftHand,
            rightHand: rightHand,
            gesture: { categoryName: gesture } 
          });

          // Use palm center (landmark 9) for tracking
          const palmCenter = { x: activeHand[9].x, y: activeHand[9].y };

          // HEAD TRACKING: Natural direction control via hand position
          if (enableHeadTrackingRef.current) {
            // Map hand position (0-1) to rotation angles
            // Center dead zone (20%) = look straight ahead
            // Outside center = rotate toward hand position
            const centerX = 0.5;
            const centerY = 0.5;
            const deadZone = GESTURE_CONFIG.headTrackingDeadZone;
            const sensitivity = GESTURE_CONFIG.headTrackingSensitivity;
            
            // Calculate distance from center
            const offsetX = palmCenter.x - centerX;
            const offsetY = palmCenter.y - centerY;
            const distanceFromCenter = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
            
            // Check if hand is in center dead zone (20% radius)
            if (distanceFromCenter < deadZone) {
              // FREEZE: Hand in center - look straight ahead
              targetRotation.current.x = 0;
              targetRotation.current.y = 0;
            } else {
              // ROTATE: Hand outside center - rotate toward hand position
              // Apply sensitivity only to the portion outside dead zone
              const effectiveDistance = (distanceFromCenter - deadZone) / (0.5 - deadZone);
              const multiplier = Math.min(effectiveDistance, 1.0) * sensitivity;
              
              targetRotation.current.y = offsetX * multiplier * Math.PI; // Yaw (left/right)
              targetRotation.current.x = -offsetY * multiplier * Math.PI; // Pitch (up/down), inverted
            }
          } else {
            // Head tracking disabled: look straight ahead
            targetRotation.current.x = 0;
            targetRotation.current.y = 0;
          }

          // TRAVEL CONTROL: GRAB/PINCH = forward, VICTORY = backward
          console.log('Detected gesture:', gesture, 'Hands:', leftHand ? 'L' : '', rightHand ? 'R' : '');
          
          if (gesture === "GRAB" || gesture === "PINCH") {
            targetVelocity.current = GESTURE_CONFIG.grabVelocity; // GRAB/PINCH = Fly forward
          } else if (gesture === "VICTORY") {
            targetVelocity.current = GESTURE_CONFIG.victoryVelocity; // VICTORY = Fly backward
          } else {
            targetVelocity.current = GESTURE_CONFIG.idleVelocity; // FREEZE (no gesture = no movement)
          }

          // ROTATION CONTROL: GRAB + enableTwoHandRotation = rotate galaxy
          if (gesture === "GRAB" && enableTwoHandRotationRef.current) {
            // Edge detection: Ignore if hand is near screen edges (entering/leaving frame)
            // palmCenter x,y are normalized (0-1), use configurable threshold
            const isNearEdge = palmCenter.x < edgeThresholdRef.current || palmCenter.x > (1 - edgeThresholdRef.current) || 
                               palmCenter.y < edgeThresholdRef.current || palmCenter.y > (1 - edgeThresholdRef.current);
            
            if (!isNearEdge && prevHandPos.current) {
              const deltaX = palmCenter.x - prevHandPos.current.x;
              const deltaY = palmCenter.y - prevHandPos.current.y;

              galaxyRotation.current.x += deltaY * 8; // Vertical drag
              galaxyRotation.current.y += deltaX * 8; // Horizontal drag
              
              if (onGalaxyRotationChange) {
                onGalaxyRotationChange({
                  x: galaxyRotation.current.x,
                  y: galaxyRotation.current.y
                });
              }
            }
            
            // Update position only if not near edge (to avoid jumps when re-entering)
            if (!isNearEdge) {
              prevHandPos.current = palmCenter;
            } else {
              prevHandPos.current = null; // Reset to avoid jump when hand returns to center
            }
          } else {
            prevHandPos.current = null;
          }
        } else {
          // No hands detected: FREEZE everything and look straight ahead
          onDebugData({ status: "Searching for hands... (Frozen)" });
          targetVelocity.current = 0;
          prevHandPos.current = null;
          
          // Reset camera rotation to look straight ahead when no hands
          if (!enableHeadTrackingRef.current) {
            targetRotation.current.x = 0;
            targetRotation.current.y = 0;
          }
        }
      }
    });

    // Initialize Camera
    const cameraUtils = new Camera(videoElement, {
      onFrame: async () => {
        if (isMountedRef.current && hands) {
          await hands.send({ image: videoElement });
        }
      },
      width: GESTURE_CONFIG.videoWidth,
      height: GESTURE_CONFIG.videoHeight,
    });

    cameraUtils.start()
      .then(() => onDebugData({ status: "Camera Started" }))
      .catch(err => onDebugData({ status: `Error: ${err}` }));

    return () => {
      isMountedRef.current = false;
      if (cameraUtils) cameraUtils.stop();
      if (hands) hands.close();
    };
  }, []);

  // 4. The Render Loop (Runs at 60/120 FPS)
  useFrame((state, delta) => {
    // A. Apply Smoothing (Lerp) for camera rotation
    const rotationSpeed = enableHeadTrackingRef.current ? 3 : 5; // Slower for smoother direction control
    camera.rotation.x = lerp(camera.rotation.x, targetRotation.current.x, rotationSpeed * delta);
    camera.rotation.y = lerp(camera.rotation.y, targetRotation.current.y, rotationSpeed * delta);
    
    // A2. Apply FOV smoothing (zoom)
    camera.fov = lerp(camera.fov, targetFOV.current, 3 * delta);
    camera.updateProjectionMatrix(); // Required after FOV change
    
    // B. Apply Forward Movement
    const speed = flySpeedRef.current; // Units per second (controllable via prop)
    const currentSpeed = lerp(0, speed * targetVelocity.current, 0.1); // Smooth acceleration
    
    if (Math.abs(currentSpeed) > 0.1) {
        camera.translateZ(-currentSpeed * delta);
    }

    // C. Boundary Detection & Bounce
    // Galaxy data spans roughly -25 to +25 in each axis (50 units total)
    // Use configurable boundary distance (3D free zone)
    const maxDistance = boundaryDistanceRef.current;
    const distanceFromOrigin = Math.sqrt(
      camera.position.x ** 2 + 
      camera.position.y ** 2 + 
      camera.position.z ** 2
    );

    if (distanceFromOrigin > maxDistance) {
      // Bounce back: reverse velocity and push camera back toward origin
      targetVelocity.current = -Math.abs(targetVelocity.current);
      
      // Gently push camera back toward origin
      const pushBackStrength = GESTURE_CONFIG.boundaryPushBackStrength;
      camera.position.x *= (1 - pushBackStrength * delta);
      camera.position.y *= (1 - pushBackStrength * delta);
      camera.position.z *= (1 - pushBackStrength * delta);
    }
  });

  return null; 
};

// Manual Gesture Detection (Ported from Reference)
function detectGesture(landmarks) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const wrist = landmarks[0];

    // Helper to check if finger is extended
    const isExtended = (tip, pipIndex) => {
        const pip = landmarks[pipIndex];
        return Math.hypot(tip.x - wrist.x, tip.y - wrist.y) > 
               Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
    };

    const indexExt = isExtended(indexTip, 6);
    const middleExt = isExtended(middleTip, 10);
    const ringExt = isExtended(ringTip, 14);
    const pinkyExt = isExtended(pinkyTip, 18);

    // Pinch check (Thumb + Index close)
    const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    if (pinchDist < GESTURE_CONFIG.pinchThreshold) return "PINCH";

    if (indexExt && middleExt && ringExt && pinkyExt) return "PALM_OPEN";
    if (!indexExt && !middleExt && !ringExt && !pinkyExt) return "GRAB"; // Fist
    if (indexExt && middleExt && !ringExt && !pinkyExt) return "VICTORY"; // Peace
    if (indexExt && !middleExt && !ringExt && !pinkyExt) return "POINT";

    return "IDLE";
}
