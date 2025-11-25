import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';

// Helper for smoothing
const lerp = (start, end, factor) => start + (end - start) * factor;

export const GestureController = ({ onDebugData }) => {
  const { camera } = useThree();
  const videoRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Store target values (where we want to go)
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetVelocity = useRef(0); // 0 = stop, 1 = forward
  
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
      maxNumHands: 1, // Optimization: Only 1 hand needed for flying
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const landmarks = results.multiHandLandmarks && results.multiHandLandmarks.length > 0 
        ? results.multiHandLandmarks[0] 
        : null;

      if (landmarks) {
        const gesture = detectGesture(landmarks);
        onDebugData({ status: "Tracking", landmarks, gesture: { categoryName: gesture } });

        // --- MAPPING LOGIC ---
        // Use Wrist (0) for position
        const wrist = landmarks[0];
        
        // Inverted Y for natural feel
        targetRotation.current.x = (wrist.y - 0.5) * 1.5; 
        targetRotation.current.y = (wrist.x - 0.5) * 1.5; 

        // Map Gesture to Velocity
        if (gesture === "PALM_OPEN") targetVelocity.current = 1; // Fly
        else if (gesture === "VICTORY") targetVelocity.current = -0.5; // Reverse
        else if (gesture === "GRAB") targetVelocity.current = 0; // Stop
        else targetVelocity.current = 0; // Default stop
        
      } else {
         onDebugData({ status: "Searching for hands..." });
         targetVelocity.current = 0; // Stop if hand lost
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
    
    // B. Apply Forward Movement
    const speed = 50; // Units per second
    const currentSpeed = lerp(0, speed * targetVelocity.current, 0.1); // Smooth acceleration
    
    if (Math.abs(currentSpeed) > 0.1) {
        camera.translateZ(-currentSpeed * delta);
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
