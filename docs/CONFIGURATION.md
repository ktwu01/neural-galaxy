# Configuration Guide

## Overview

The Neural Galaxy project uses **centralized configuration** to manage parameters. This makes it easy to tune the visualization without hunting through code.

## Configuration Files

### 1. `scripts/config.py` - Backend Build Parameters

**When to modify:** When you want to rebuild the galaxy data with different clustering or embedding settings.

**Key parameters:**
- `UMAP_N_NEIGHBORS` (10): Controls cluster tightness
  - Lower (5-8) = tighter, more local clusters
  - Higher (15-30) = broader, more global structure
  
- `UMAP_MIN_DIST` (0.1): Controls particle separation
  - Lower (0.0-0.1) = particles closer together
  - Higher (0.3-0.5) = particles more spread out

- `NUM_CLUSTERS` (5): Number of semantic groups
  - Fewer (2-3) = broad categories
  - More (7-10) = fine-grained topics

**After changing:** Run `python3 scripts/build_galaxy.py` to rebuild

### 2. `frontend/src/config.js` - Frontend Runtime Parameters

**When to modify:** When you want to change visual appearance or interaction behavior without rebuilding data.

**Key parameters:**

**Camera & Navigation:**
- `CAMERA_CONFIG.initialPosition` ([0, 0, 200]): Starting camera position
- `CAMERA_CONFIG.initialFOV` (60): Field of view

**Gesture Control:**
- `GESTURE_CONFIG.defaultFlySpeed` (90): Base movement speed
- `GESTURE_CONFIG.defaultBoundaryDistance` (300): 3D free zone before bounce-back
- `GESTURE_CONFIG.headTrackingSensitivity` (0.4): Direction control sensitivity
- `GESTURE_CONFIG.headTrackingDeadZone` (0.3): Center freeze zone (30%)
- `GESTURE_CONFIG.grabVelocity` (3.0): Forward movement multiplier (GRAB/PINCH)
- `GESTURE_CONFIG.victoryVelocity` (-3.0): Backward movement multiplier
- `GESTURE_CONFIG.pinchThreshold` (0.05): Distance for pinch detection
- `GESTURE_CONFIG.videoWidth/Height` (320x240): Hand tracking resolution

**Particles:**
- `PARTICLE_CONFIG.defaultSize` (10.5): Particle size (3x original)
- `PARTICLE_CONFIG.opacity` (0.9): Particle transparency

**Rotation:**
- `ROTATION_CONFIG.defaultSpeed` (0.005): Auto-rotation speed

**Focus System:**
- `FOCUS_CONFIG.focusConeRadius` (0.1): Screen-space focus area

**After changing:** Just refresh the browser (no rebuild needed)

## Parameter Categories

### Build-time (Requires Rebuild)
- Embedding model
- UMAP settings
- Clustering settings
- Coordinate normalization

### Runtime (Real-time)
- Fly speed ✅ (also in Control Panel)
- Rotation speed ✅ (also in Control Panel)
- Particle size
- Camera settings
- Gesture thresholds (velocity multipliers, pinch threshold, etc.)
- Hand tracking settings (confidence, video resolution)

## Control Panel

Some parameters are **user-adjustable** via the UI Control Panel (right side):

**Gesture Mode Controls:**
- Fly Speed (10-200 units/sec): Adjusts movement speed in real-time
- Boundary Distance (100-1000 units): How far you can fly before bounce-back
- Direction Control (toggle): Enable/disable hand position steering
- Two-Hand Rotation (toggle): Enable/disable GRAB gesture rotation (disabled by default)

**Standard Controls:**
- Rotation Speed (0-0.02): Auto-rotation speed
- Gesture Mode Toggle: Switch between hand control and mouse orbit controls

These override the defaults in `config.js`.

## Best Practices

1. **Experimenting with clustering?** → Edit `scripts/config.py` → Rebuild
2. **Tweaking visuals?** → Edit `frontend/src/config.js` → Refresh
3. **Want user control?** → Add slider to `ControlPanel.jsx`
4. **Document changes** → Update this README

## Quick Reference

| Parameter | File | Default | Range | Rebuild? |
|-----------|------|---------|-------|----------|
| **Build-Time** | | | | |
| Cluster tightness | `scripts/config.py` | 10 | 5-50 | ✅ |
| Particle distance | `scripts/config.py` | 0.1 | 0.0-1.0 | ✅ |
| Number of clusters | `scripts/config.py` | 5 | 2-10 | ✅ |
| **Runtime** | | | | |
| Fly speed | `frontend/src/config.js` | 90 | 10-200 | ❌ |
| Particle size | `frontend/src/config.js` | 10.5 | 1-20 | ❌ |
| Boundary distance | `frontend/src/config.js` | 300 | 100-1000 | ❌ |
| Direction sensitivity | `frontend/src/config.js` | 0.4 | 0.1-2.0 | ❌ |
| Dead zone | `frontend/src/config.js` | 0.3 | 0.1-0.5 | ❌ |

## Example: Making Clusters Tighter

```python
# scripts/config.py
UMAP_N_NEIGHBORS = 8  # Was 10
UMAP_MIN_DIST = 0.05  # Was 0.1
```

Then rebuild:
```bash
python3 scripts/build_galaxy.py
```

## Example: Making Particles Bigger

```javascript
// frontend/src/config.js
export const PARTICLE_CONFIG = {
  defaultSize: 15, // Was 10.5
  // ...
};
```

Then refresh browser (no rebuild needed).

## Gesture Control Overview

The app now uses **hand gesture control** as the primary navigation method:

**Single Hand Gestures:**
- ✊ **GRAB (Fist)** or 🤏 **PINCH**: Fly forward
- ✌️ **VICTORY (Peace)**: Fly backward
- 👉 **Hand Position**: Steers camera direction
  - Center 30% of screen: Fly straight
  - Edges: Turn toward hand position

**Two Hand Gestures:**
- 🤲 **Pinch/Spread**: Zoom in/out (travel frozen)

**Visual Feedback:**
- Hand skeletons appear at actual hand positions (50% scale)
- Gesture info panel in bottom-left corner
- Control panel (right) for real-time adjustments

**Default Settings:**
- Direction control: Enabled
- Two-hand rotation: Disabled (toggle available)
- Fly speed: 90 units/sec (adjustable 10-200)
- Boundary: 300 units (adjustable 100-1000)

