/**
 * Frontend Configuration
 * ======================
 * Runtime parameters for the Neural Galaxy visualization.
 * These can be modified in real-time via the Control Panel.
 */

// ============================================================
// CAMERA & NAVIGATION
// ============================================================
export const CAMERA_CONFIG = {
  initialPosition: [0, 0, 200],
  initialFOV: 60,
  
  // OrbitControls settings
  orbitDampingFactor: 0.05,
  orbitRotateSpeed: 0.5,
  orbitZoomSpeed: 0.8,
  orbitMinDistance: 50,
  orbitMaxDistance: 500,
};

// ============================================================
// GESTURE CONTROL
// ============================================================
export const GESTURE_CONFIG = {
  // Default fly speed (units per second)
  defaultFlySpeed: 90,
  minFlySpeed: 10,
  maxFlySpeed: 200,
  
  // Boundary detection (3D free zone)
  defaultBoundaryDistance: 300, // Default: 2x larger than original 150
  minBoundaryDistance: 100,     // Min: close boundary
  maxBoundaryDistance: 1000,    // Max: very large boundary
  boundaryPushBackStrength: 0.5,
  
  // Edge detection for rotation (prevent mis-rotation near screen edges)
  defaultEdgeThreshold: 0.15, // Default: ignore rotation if hand is within 15% of screen edge
  minEdgeThreshold: 0.05,     // Min: 5% (very sensitive)
  maxEdgeThreshold: 0.4,      // Max: 40% (large dead zone)
  
  // Hand tracking
  videoWidth: 320,
  videoHeight: 240,
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  
  // Gesture thresholds
  pinchThreshold: 0.05, // Distance between thumb and index
  
  // Velocity multipliers (relative to flySpeed)
  grabVelocity: 3.0,       // Forward (GRAB gesture)
  victoryVelocity: -3.0,   // Backward (VICTORY gesture)
  palmOpenVelocity: 0.0,   // Freeze (PALM_OPEN gesture)
  idleVelocity: 0.0,       // Freeze (no gesture detected)
  
  // Head tracking (natural direction control)
  enableHeadTracking: true, // Use hand position to control camera direction
  headTrackingSensitivity: 0.4, // How much hand movement affects camera rotation (0.1-2.0)
  headTrackingDeadZone: 0.3,    // Center dead zone (30% = freeze rotation, larger for stability)
};

// ============================================================
// PARTICLE RENDERING
// ============================================================
export const PARTICLE_CONFIG = {
  // Particle appearance
  defaultSize: 10.5, // 3x original (was 3.5)
  minSize: 1,
  maxSize: 20,
  sizeAttenuation: true,
  
  // Material properties
  transparent: true,
  opacity: 0.9,
  blending: 'AdditiveBlending',
};

// ============================================================
// GALAXY ROTATION
// ============================================================
export const ROTATION_CONFIG = {
  defaultSpeed: 0.005,
  minSpeed: 0,
  maxSpeed: 0.02,
};

// ============================================================
// FOCUS SYSTEM
// ============================================================
export const FOCUS_CONFIG = {
  // Raycaster settings
  raycasterThreshold: 10,
  
  // Focus cone (screen space)
  focusConeRadius: 0.1, // Only focus on particles within this distance from center
  
  // Focus highlight
  ringSize: 8,
  ringOpacity: 0.6,
  pulseSpeed: 2,
};

// ============================================================
// UI SETTINGS
// ============================================================
export const UI_CONFIG = {
  // Debug overlay
  debugOverlaySize: { width: 320, height: 240 },
  
  // Control panel
  controlPanelWidth: 320,
  
  // HUD
  hudMaxTextLength: 200,
};

// ============================================================
// PERFORMANCE
// ============================================================
export const PERFORMANCE_CONFIG = {
  // Frame rate targets
  targetFPS: 60,
  
  // Gesture detection interval (ms)
  gestureDetectionInterval: 50, // 20 FPS for hand tracking
};

export default {
  CAMERA_CONFIG,
  GESTURE_CONFIG,
  PARTICLE_CONFIG,
  ROTATION_CONFIG,
  FOCUS_CONFIG,
  UI_CONFIG,
  PERFORMANCE_CONFIG,
};

