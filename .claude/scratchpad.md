# Project Scratchpad

## Background and Motivation

**Project:** Personal Neural Galaxy - 3D visualization of 2025 intellectual journey from chat history

**Current Status:** Working 3D galaxy with basic hand gesture control and a new minimap. Focus is on continued polishing of the user experience.

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

### Phase 2A-Polish: Gesture Control Refinement ✅ COMPLETE
**Goal:** Make gesture control feel smooth, responsive, and intuitive

**Completed:**
- ✅ Fixed React closure bug (props not updating in callbacks)
- ✅ Intuitive direction control (hand position steers camera)
- ✅ Reduced sensitivity for stability (30% center dead zone)
- ✅ Both GRAB and PINCH move forward
- ✅ Hand skeleton overlays (replaced circles)
- ✅ Removed top-left debug panel
- ✅ Added bottom-left gesture info panel with emoji guide
- ✅ Centralized all config parameters
- ✅ 2x larger boundary distance (300 units)
- ✅ Direction control enabled by default

### Phase 3: Minimap Implementation ✅ COMPLETE
**Goal:** GTA-style minimap showing camera position and galaxy overview

**Success Criteria:**
- ✅ Minimap visible.
- ✅ Shows all particles as small colored dots.
- ✅ Camera position clearly visible.
- ✅ Camera direction indicated.
- ✅ Minimal performance impact.

### Phase 3A: UI/UX Polish ✅ COMPLETE
**Goal:** Improve the overall look and feel of the UI panels and ensure a full-screen experience.

**Completed:**
- ✅ Made `GestureInfoPanel` draggable.
- ✅ Updated `GestureInfoPanel` appearance (size, color, transparency).
- ✅ Renamed `ControlPanel` to "Settings Panel".
- ✅ Updated `ControlPanel` appearance (softer borders, shadows, hidden elements).
- ✅ Set `GestureInfoPanel` default position to top-left.
- ✅ Ensured the 3D universe is full screen by removing root padding/margins.
- ✅ Made the minimap circular.

### Phase 4: Future Enhancements (DEFERRED)
- [ ] Starfield background
- [ ] Loading states
- [ ] Better particle effects
- [ ] Fullscreen mode
- [x] Minimap interactivity (click to teleport, zoom)
- [ ] More gesture commands (swipe, etc.)

## Project Status Board

**Current Phase:** Phase 4: Future Enhancements

**Priority Order:**
1. 🟡 **HIGH:** Two-Hand Support (P3)
2. 🟢 **MEDIUM:** Gesture Commands (P4-P7)
3. 🔵 **LOW:** Polish & UX (P8-P10)

### In Progress
- None (awaiting user direction)

### Completed Milestones
✅ **Phase 3A: UI/UX Polish**
- Comprehensive UI adjustments for a cleaner, full-screen experience.

✅ **Phase 3: Minimap Implementation**
- Functional minimap showing particles and camera.

✅ **Phase 2A-Polish: Gesture Control Refinement**
- Major improvements to gesture stability and feedback.

✅ **Phase 2A: Hand Gesture Control - Core Implementation**
- Basic hand tracking and camera control implemented.

✅ **Phase 1: Foundation**
- 488 particles visualized
- Interactive HUD
- Focus system
- Control panel

## Current Status / Progress Tracking

**Last Updated:** 2025-11-25

**Latest Completed Work:**
- Implemented a real-time minimap, now circular, in the bottom-left corner.
- Achieved a full-screen 3D universe by removing unnecessary padding/margins.
- Polished the UI panels (`GestureInfoPanel` and "Settings Panel") with a softer, more modern aesthetic.
- Made the `GestureInfoPanel` draggable and set its default position to top-left.
- Hid several controls in the "Settings Panel" to simplify the UI.
- Fixed `ReferenceError: enableHeadTracking is not defined` in `App.jsx`.
- Fixed the `ControlPanel` visibility and interaction issue.

**Next Action:** Awaiting user direction on next priorities.

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
