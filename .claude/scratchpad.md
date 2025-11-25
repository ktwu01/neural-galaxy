# Project Scratchpad

## Background and Motivation

**Project:** Personal Neural Galaxy - 3D visualization of 2025 intellectual journey from chat history

**Current Status:** Working 3D galaxy with basic hand gesture control. Focus is on polishing the gesture experience to make it smooth, intuitive, and fun.

**Key Principle:** Gesture control is the most exciting feature. Make it feel magical.

## High-level Task Breakdown

### Phase 0-1: Foundation ✅ COMPLETE
- [x] Data Pipeline (UMAP, clustering, 488 particles)
- [x] 3D Visualization (Three.js, particles, colors)
- [x] Basic UI (HUD, Focus Panel, Control Panel)
- [x] Click Interaction

### Phase 2A: Hand Gesture Control - Core Implementation ✅ COMPLETE
- [x] MediaPipe Classic API integration
- [x] Hand tracking with debug overlay
- [x] Basic gesture detection (Palm, Fist, Victory)
- [x] Camera movement with lerp smoothing
- [x] Control mode toggle

### Phase 2A-Polish: Gesture Control Refinement (PRIORITY)
**Goal:** Make gesture control feel smooth, responsive, and intuitive

#### **CRITICAL FIXES (Do First)**

- [x] **Task 2A-P1: Fix Movement Speed**
  - Reduce forward speed to 1/10th current (5 units/sec instead of 50)
  - Tune acceleration/deceleration curves
  - **Success:** Galaxy exploration feels controlled, not rushed

- [x] **Task 2A-P2: Add Boundary Detection & Bounce**
  - Detect when camera reaches galaxy edge (distance from origin)
  - Reverse velocity direction (bounce back)
  - Add visual feedback when bouncing
  - **Success:** Never fly off into empty space, always stay near particles

- [ ] **Task 2A-P3: Enable Two-Hand Detection**
  - Change `maxNumHands: 1` to `maxNumHands: 2`
  - Track both hands separately (left/right)
  - **Success:** Debug overlay shows both hands

#### **GESTURE COMMANDS (Do Second)**

- [ ] **Task 2A-P4: Implement Pinch-to-Scale (Two Hands)**
  - Calculate distance between two index fingers
  - Map distance to camera FOV or particle scale
  - **Success:** Spread hands apart → zoom in, bring together → zoom out

- [ ] **Task 2A-P5: Implement Grab-to-Rotate**
  - Detect GRAB gesture (closed fist)
  - Track hand movement while grabbing
  - Apply rotation to galaxy group
  - **Success:** Make fist + move hand → galaxy rotates

- [ ] **Task 2A-P6: Implement Swipe Navigation**
  - Detect PALM_OPEN + horizontal motion
  - Trigger scene change or camera pan
  - **Success:** Swipe left/right → navigate

- [ ] **Task 2A-P7: Add Victory Gesture Action**
  - Detect VICTORY (peace sign)
  - Trigger theme cycle or special effect
  - **Success:** Peace sign → visual change

#### **POLISH & UX (Do Third)**

- [ ] **Task 2A-P8: Improve Debug Overlay**
  - Show both hands clearly
  - Display current gesture for each hand
  - Show velocity/speed indicator
  - **Success:** Easy to understand what's happening

- [ ] **Task 2A-P9: Add Visual Feedback**
  - Particle glow on gesture recognition
  - Camera shake on bounce
  - Trail effect on hand movement
  - **Success:** Gestures feel responsive

- [ ] **Task 2A-P10: Smooth Transitions**
  - Better lerp factors for different gestures
  - Ease-in/ease-out for velocity changes
  - **Success:** No jarring movements

### Phase 2B: Shape Morphing - ❌ CANCELLED
**Reason:** Gesture control is more fun and important. Focus resources there.

### Phase 3: Visual Polish (DEFERRED)
- [ ] Starfield background
- [ ] Loading states
- [ ] Better particle effects
- [ ] Fullscreen mode

## Project Status Board

**Current Phase:** Phase 2A-Polish (Gesture Refinement)

**Priority Order:**
1. 🔴 **CRITICAL:** Speed & Boundaries (P1, P2)
2. 🟡 **HIGH:** Two-Hand Support (P3)
3. 🟢 **MEDIUM:** Gesture Commands (P4-P7)
4. 🔵 **LOW:** Polish & UX (P8-P10)

### In Progress
- None (awaiting user direction)

### Completed Milestones
✅ **Phase 2A Complete (Commit 84c6222):**
- Hand tracking working
- Basic gestures detected
- Debug overlay functional
- Control mode toggle

✅ **Phase 1 Complete:**
- 488 particles visualized
- Interactive HUD
- Focus system
- Control panel

## Current Status / Progress Tracking

**Last Updated:** 2025-11-25 (Post-Commit, Planning Polish Phase)

**Identified Issues:**
1. ⚠️ Movement speed too fast (30 sec edge-to-edge)
2. ⚠️ No boundary detection (fly off into void)
3. ⚠️ Only one hand tracked (need two for pinch)
4. ⚠️ Limited gesture vocabulary

**Next Action:** Implement P1 (Speed Fix) and P2 (Boundaries)

## Lessons Learned

### MediaPipe Main Thread Pattern (2025-11-25)

**What Worked:**
- Classic API (`@mediapipe/hands`) is more stable than Tasks API
- `Camera` utility from `@mediapipe/camera_utils` handles frame loop efficiently
- Manual gesture detection (finger extension logic) is reliable
- Pinned CDN URLs prevent WASM version mismatches

**Key Code Pattern:**
```javascript
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
});
hands.setOptions({ maxNumHands: 2 }); // Enable two hands
const camera = new Camera(videoElement, {
  onFrame: async () => { await hands.send({ image: videoElement }); }
});
```

### Gesture Detection Logic (2025-11-25)

**Reliable Gestures:**
- **PALM_OPEN:** All fingers extended
- **GRAB (Fist):** All fingers curled
- **VICTORY:** Index + Middle extended, others curled
- **PINCH:** Thumb + Index close together

**Two-Hand Gestures:**
- **Scale:** Distance between two index fingers
- **Rotate:** Grab + drag motion

### Performance Notes (2025-11-25)

**Current Performance:**
- 60 FPS with 488 particles
- Hand tracking at ~20 FPS (acceptable with lerp smoothing)
- 320x240 video resolution is sufficient

**Bottlenecks:**
- None identified yet (stable)

### Git Security: Personal Data (2025-11-25)

**Issue:** galaxy_data.json contains personal chat history
**Solution:** Added to .gitignore, removed from tracking
**Note:** Still exists in git history (commit 407faaf) - acceptable risk

## Executor's Feedback or Assistance Requests

**Completed:**
- ✅ P1: Speed reduction (implemented with config)
- ✅ P2: Boundary detection (implemented with bounce-back)
- ✅ P3: Two-hand support (implemented with zoom)
- ✅ P5: Grab-to-Rotate (implemented with toggle)
- ✅ Configuration centralization (all gesture params now in config.js)

**Latest Changes:**
- Moved all hardcoded gesture values to `frontend/src/config.js`:
  - Velocity multipliers (grabVelocity: 3.0, victoryVelocity: -3.0)
  - Hand tracking settings (maxNumHands, confidence thresholds)
  - Video resolution (320x240)
  - Boundary settings (maxBoundaryDistance: 150)
  - Pinch threshold (0.05)
- Updated `GestureController.jsx` to import and use `GESTURE_CONFIG`
- Separated travel control from rotation control logic
