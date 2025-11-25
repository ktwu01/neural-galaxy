import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';

// Helper for smoothing
const lerp = (start, end, factor) => start + (end - start) * factor;

export const GestureController = ({ onDebugData, onGalaxyRotationChange, onHandsUpdate }) => {
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
      maxNumHands: 2, // Enable two hands for pinch-to-scale
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
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

      // Update hand UI cursors
      if (onHandsUpdate) {
        onHandsUpdate({
          left: {
            visible: !!leftHand,
            position: leftHand ? { x: leftHand[9].x, y: leftHand[9].y } : null,
            gesture: leftGesture
          },
          right: {
            visible: !!rightHand,
            position: rightHand ? { x: rightHand[9].x, y: rightHand[9].y } : null,
            gesture: rightGesture
          }
        });
      }

      // 1. TWO-HAND SCALING (Pinch to Zoom)
      if (leftHand && rightHand) {
        const leftIndex = leftHand[8]; // Index finger tip
        const rightIndex = rightHand[8];
        const dist = Math.hypot(
          leftIndex.x - rightIndex.x,
          leftIndex.y - rightIndex.y
        );

        if (prevPinchDist.current !== null) {
          const delta = dist - prevPinchDist.current;
          if (Math.abs(delta) > 0.01) {
            // Map distance change to FOV (zoom)
            // Spread hands apart (increase dist) -> decrease FOV (zoom in)
            // Bring hands together (decrease dist) -> increase FOV (zoom out)
            targetFOV.current = Math.max(30, Math.min(90, targetFOV.current - delta * 100));
          }
        }
        prevPinchDist.current = dist;
        
        onDebugData({ 
          status: "Two Hands - Pinch to Zoom",
          leftHand: leftHand,
          rightHand: rightHand,
          gesture: { categoryName: "PINCH_SCALE" } 
        });
      } else {
        prevPinchDist.current = null;
        
        // 2. SINGLE-HAND CONTROL
        const activeHand = rightHand || leftHand;
        
        if (activeHand) {
          const gesture = detectGesture(activeHand);
          onDebugData({ status: "Tracking", landmarks: activeHand, gesture: { categoryName: gesture } });

          // Use palm center (landmark 9) for tracking
          const palmCenter = { x: activeHand[9].x, y: activeHand[9].y };

          if (gesture === "GRAB") {
            // GRAB: Rotate the galaxy (drag)
            if (prevHandPos.current) {
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
            prevHandPos.current = palmCenter;
            targetVelocity.current = 0; // Stop moving when grabbing
          } else {
            // Other gestures: camera control
            prevHandPos.current = null;
            
            // Use Wrist (0) for camera rotation
            const wrist = activeHand[0];
            targetRotation.current.x = (wrist.y - 0.5) * 1.5; 
            targetRotation.current.y = (wrist.x - 0.5) * 1.5; 

            // Map Gesture to Velocity
            if (gesture === "PALM_OPEN") targetVelocity.current = 1; // Fly
            else if (gesture === "VICTORY") targetVelocity.current = -0.5; // Reverse
            else targetVelocity.current = 0; // Default stop
          }
        } else {
          onDebugData({ status: "Searching for hands..." });
          targetVelocity.current = 0;
          prevHandPos.current = null;
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
      width: 320, // Low res for performance
      height: 240,
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
    // A. Apply Smoothing (Lerp)
    camera.rotation.x = lerp(camera.rotation.x, targetRotation.current.x, 5 * delta);
    camera.rotation.y = lerp(camera.rotation.y, targetRotation.current.y, 5 * delta);
    
    // A2. Apply FOV smoothing (zoom)
    camera.fov = lerp(camera.fov, targetFOV.current, 3 * delta);
    camera.updateProjectionMatrix(); // Required after FOV change
    
    // B. Apply Forward Movement
    const speed = 30; // Units per second (reduced from 50 for better control)
    const currentSpeed = lerp(0, speed * targetVelocity.current, 0.1); // Smooth acceleration
    
    if (Math.abs(currentSpeed) > 0.1) {
        camera.translateZ(-currentSpeed * delta);
    }

    // C. Boundary Detection & Bounce
    // Galaxy data spans roughly -25 to +25 in each axis (50 units total)
    // Set boundary at radius 150 (comfortable viewing distance)
    const maxDistance = 150;
    const distanceFromOrigin = Math.sqrt(
      camera.position.x ** 2 + 
      camera.position.y ** 2 + 
      camera.position.z ** 2
    );

    if (distanceFromOrigin > maxDistance) {
      // Bounce back: reverse velocity and push camera back toward origin
      targetVelocity.current = -Math.abs(targetVelocity.current);
      
      // Gently push camera back toward origin
      const pushBackStrength = 0.5;
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
    if (pinchDist < 0.05) return "PINCH";

    if (indexExt && middleExt && ringExt && pinkyExt) return "PALM_OPEN";
    if (!indexExt && !middleExt && !ringExt && !pinkyExt) return "GRAB"; // Fist
    if (indexExt && middleExt && !ringExt && !pinkyExt) return "VICTORY"; // Peace
    if (indexExt && !middleExt && !ringExt && !pinkyExt) return "POINT";

    return "IDLE";
}
