# Project Scratchpad

## Background and Motivation

**Project:** Personal Neural Galaxy - 3D visualization of 2025 intellectual journey from chat history

**Original Vision:** Immersive 3D universe with 5,000-20,000+ particles, FPS controls, gesture navigation, semantic clustering, bloom effects, and proximity-based text reveal.

**MVP Goal (Revised):** Create a WORKING 3D visualization that proves the core concept with minimal complexity. Focus on getting something visible and navigable FIRST, then iterate.

**Key Principle:** Start with the simplest possible implementation that demonstrates value. Avoid premature optimization and complex features until the basics work reliably.

## Key Challenges and Analysis

### ⚠️ Skeptical Analysis of Original Blueprint

**What Could Go Wrong:**

1. **Performance Risk:** 20,000+ particles with bloom effects + additive blending + real-time text queries = potential performance nightmare
   - **Reality Check:** Need to start with 1,000-5,000 particles and measure actual FPS before scaling
   - **Web Research Finding:** Three.js can handle hundreds of thousands of particles with proper GPU techniques (instancing, GPGPU), but this requires advanced optimization

2. **Data Pipeline Complexity:** The full pipeline (sentence-transformers → UMAP → clustering → coloring) has many failure points
   - **Skeptical View:** What if the clustering doesn't look good? What if UMAP parameters need extensive tweaking?
   - **MVP Approach:** Use a simpler 2D projection first (PCA or t-SNE) to validate the data, then move to 3D

3. **FPS Controls + Momentum Physics:** Building smooth, non-nauseating camera controls is harder than it sounds
   - **Risk:** Users get motion sick or disoriented
   - **Mitigation:** Use proven libraries (drei's FlyControls) with conservative default settings FIRST

4. **Gesture Control (Phase 2):** MediaPipe integration is a completely separate complex project
   - **Reality:** This should NOT be in MVP scope AT ALL
   - **Decision:** Defer to post-MVP entirely

5. **Development Time:** Original blueprint has no time estimates or milestones
   - **Problem:** Easy to get stuck in endless tweaking without shipping anything

### ✅ What We Can Trust from Blueprint

1. **Tech Stack Choices Are Solid:**
   - React + Vite + R3F: Industry standard, good performance
   - sentence-transformers (all-MiniLM-L6-v2): Fast, CPU-friendly, proven
   - UMAP: Better than t-SNE for 3D projections, well-documented
   - THREE.Points with BufferGeometry: Correct approach for particle systems

2. **Visual Design Goals Are Clear:**
   - Deep space aesthetic
   - Semantic clustering with color coding
   - Proximity-based information reveal

3. **Data Structure Is Well-Defined:**
   - Input: `chat_history.json` with user prompts + timestamps
   - Output: Array of `{x, y, z, color, text}` objects

## High-level Task Breakdown

### Phase 0: Project Setup & Validation ✅ COMPLETE
- [x] **Task 0.1:** Initialize React + Vite + R3F project
- [x] **Task 0.2:** Examine and validate input data structure (488 messages)
- [x] **Task 0.3:** Set up Python environment for data pipeline

### Phase 1A: Data Pipeline ✅ COMPLETE
- [x] **Task 1A.1:** Extract text from chat history JSON (488 messages)
- [x] **Task 1A.2:** Generate embeddings (all-MiniLM-L6-v2, 384-dim)
- [x] **Task 1A.3:** Reduce to 3D coordinates with UMAP (n_neighbors=10, min_dist=0.3)
- [x] **Task 1A.4:** Clustering and coloring (KMeans, k=5 clusters)
- [x] **Task 1A.5:** Export galaxy data (211.8 KB JSON)

### Phase 1B: 3D Visualization ✅ COMPLETE
- [x] **Task 1B.1:** Create particle system component (THREE.Points + BufferGeometry)
- [x] **Task 1B.2:** Make particles visible with glow effect (PointsMaterial + texture)
- [x] **Task 1B.3:** Add OrbitControls for navigation
- [x] **Task 1B.4:** Deployed with 488 particles (60 FPS)

### Phase 1C: Click Interaction ✅ COMPLETE
- [x] **Task 1C.1:** Implement raycasting for particle selection
- [x] **Task 1C.2:** Create HUD overlay (ParticleHUD component with glassmorphic design)

### Phase 1D: Enhanced UX & Controls ✅ COMPLETE
- [x] **Task 1D.1:** Slow down auto-rotation speed (0.05 → 0.005)
- [x] **Task 1D.2:** Implement auto-focus system (raycasting from screen center)
- [x] **Task 1D.3:** Add focus highlight (FocusHighlight component with transparent ring)
- [x] **Task 1D.4:** Create focus info panel (FocusPanel component at top-middle)
- [x] **Task 1D.5:** Focus only changes on camera movement (not rotation)
- [x] **Task 1D.6:** Tighten clustering (n_neighbors: 15→10)
- [x] **Task 1D.7:** Increase particle separation (min_dist: 0.1→0.3)
- [x] **Task 1D.8:** Create ControlPanel component (collapsible right-side UI)
- [x] **Task 1D.9:** Add rotation speed slider (0-0.02 range, real-time control)

### Phase 2A: Hand Gesture Control - The "Clean Consolidation"
**Objective:** Merge the proven logic from Jarvis-CV back into our main React+Vite codebase.
**Single Source of Truth:** `frontend/` directory.

- [ ] **Task 2A.1:** Cleanup & Reset
  - Remove `frontend/reference/` directory (stop using the clone)
  - Ensure `frontend/package.json` has `camera_utils` and `hands` (Classic API)
  - **Success:** Clean project structure, no duplicate apps.

- [ ] **Task 2A.2:** Implement Proven Pattern in `GestureController.jsx`
  - Port the `new Camera()` and `new Hands()` logic from Jarvis
  - Use the exact CDN links for WASM
  - Ensure `useFrame` handles smoothing
  - **Success:** Green debug skeleton appears on YOUR face/hands in the original Galaxy app.

- [ ] **Task 2A.3:** Verify & Tune Control Mapping
  - Map "Pinch" to Zoom (Scale)
  - Map "Hand Position" to Rotation
  - Tune sensitivity so it feels like Jarvis
  - **Success:** Galaxy moves naturally with hands.

### Phase 2B: Shape Morphing System (Est: 5-7 hours) - DEFERRED
**Success Criteria:** Particles can morph into preset shapes (Heart, Flower, Saturn, Buddha, Fireworks)

- [ ] **Task 2B.1:** Create shape generation algorithms (3-4 hours)
  - Heart shape: Mathematical heart curve in 3D
  - Flower shape: Petals arranged radially
  - Saturn shape: Ring + sphere structure
  - Buddha shape: Seated figure silhouette
  - Fireworks shape: Explosive radial burst pattern
  - Generate 488 positions for each shape
  - **Success:** Can generate all 5 shape coordinate sets

- [ ] **Task 2B.2:** Implement morphing algorithm (1-2 hours)
  - Interpolate between current positions and target shape
  - Use smooth easing function (e.g., ease-in-out)
  - Animate over 1-2 seconds
  - **Success:** Smooth transition between galaxy and shapes

- [ ] **Task 2B.3:** Shape selector UI panel (1-2 hours)
  - Create panel with 5 shape buttons/thumbnails
  - Add "Galaxy" button to return to original
  - Show preview on hover
  - **Success:** Click shape → particles morph smoothly

### Phase 2C: Visual Customization (Est: 2-3 hours) - DEFERRED
**Success Criteria:** User can customize colors and go fullscreen

- [ ] **Task 2C.1:** Color picker integration (1-2 hours)
  - Add color picker component to ControlPanel
  - Apply color to all particles OR selected cluster
  - Support single color / gradient / multi-color modes
  - Update particle colors in real-time
  - **Success:** Can customize particle colors dynamically

- [ ] **Task 2C.2:** Fullscreen control (1 hour)
  - Add fullscreen toggle button to UI
  - Handle fullscreen API events (enter/exit)
  - Adjust UI layout for fullscreen mode
  - **Success:** Seamless fullscreen experience

### Phase 2D: Gesture Polish (Est: 2-3 hours) - DEFERRED
**Success Criteria:** Gesture control feels smooth and professional

- [ ] **Task 2D.1:** Visual feedback (1 hour)
  - Render virtual hand cursor overlay on screen
  - Show gesture state indicators (open/closed)
  - Display tracking status (hands detected/lost)
  - **Success:** User knows system is tracking hands

- [ ] **Task 2D.2:** Smooth interpolation and animations (1 hour)
  - Add smooth transitions for scale changes
  - Implement easing functions
  - Add particle response animations
  - **Success:** Gesture control feels fluid, not jittery

- [ ] **Task 2D.3:** Edge case handling (1 hour)
  - Handle hand lost (graceful degradation)
  - Handle multiple hands (use closest pair or dominant hand)
  - Handle webcam permission denied (show fallback UI)
  - **Success:** Robust gesture control in all scenarios

### Phase 3: Polish & Scale Testing (Est: 3-4 hours)
**Success Criteria:** Looks presentable, performs well

- [ ] **Task 3.1:** Visual polish
  - Add starfield background
  - Adjust camera starting position for good initial view
  - Fine-tune colors for better contrast
  - Add loading state while data fetches
  - Success: Looks presentable for demo

- [ ] **Task 3.2:** Performance optimization (if needed)
  - Test FPS with gesture tracking active
  - Optimize particle rendering if needed
  - Success: Maintain 60 FPS with all features active

- [ ] **Task 3.3:** Add cluster labels (optional enhancement)
  - Compute cluster centroids
  - Use `<Text3D>` or `<Text>` from drei to label major clusters
  - Success: Can identify topic areas visually

## Project Status Board

**Current Phase:** Phase 2A (Consolidation) | Re-implementing Jarvis pattern in Original Repo

### To Do (Pending)
- [ ] 2A.1: Cleanup `frontend/reference` (Delete clone)
- [ ] 2A.2: Port Jarvis logic to `GestureController.jsx`
- [ ] 2A.3: Tune sensitivity

### Deferred Tasks (Future Enhancement)
- [ ] 1D.10: Add cluster tightness slider to control panel (triggers rebuild)
- [ ] 1D.11: Add particle separation slider to control panel (triggers rebuild)
  Note: These require backend integration for live rebuilding.

### In Progress
- [→] 2A.1: Cleanup

### Completed - Phase 1D (UMAP Adjustments)
- [x] 1D.6: Tighten clustering (n_neighbors: 15→10 for tighter, more local clusters)
- [x] 1D.7: Increase particle separation (min_dist: 0.1→0.3 for better spread)

### Completed - Phase 1D (Control Panel UI)
- [x] 1D.8: Create right-side control panel UI (ControlPanel component)
- [x] 1D.9: Add rotation speed slider to control panel (0-0.02 range, real-time control)
- [x] 1D.9.1: Improve toggle button visibility (blue glow + stronger border)
- [x] 1D.9.2: Change toggle icon to settings gear (SVG icon, best practice)

### Completed - Phase 1D (Auto-Focus & Highlight)
- [x] 1D.1: Slow down auto-rotation speed (reduced to 0.005 from 0.05)
- [x] 1D.2: Implement auto-focus system (raycasting from screen center)
- [x] 1D.3: Add focus highlight (pulsing ring with transparent background)
- [x] 1D.4: Create focus info panel at top-middle (FocusPanel component)
- [x] 1D.5: Ensure focus only changes on camera movement (position tracking)
- [x] 1D.3.1: Fix ring position synchronization with particle rotation
- [x] 1D.3.2: Change shortcut from 'O' to 'K' for opening HUD
- [x] 1D.3.3: Fix ring transparency (alpha channel + alphaTest)

### Completed - Phase 0
- [x] 0.1: Initialize React + Vite + R3F project
- [x] 0.2: Examine and validate input data structure (488 messages)
- [x] 0.3: Set up Python environment

### Completed - Phase 1A (Data Pipeline)
- [x] 1A.1: Extract text from chat history JSON
- [x] 1A.2: Generate embeddings (all-MiniLM-L6-v2, 384-dim)
- [x] 1A.3: Reduce to 3D coordinates with UMAP
- [x] 1A.4: Simple clustering and coloring (5 clusters, KMeans)
- [x] 1A.5: Export final galaxy data (212KB JSON)

### Completed - Phase 1B (3D Visualization)
- [x] 1B.1: Create basic particle system component
- [x] 1B.2: Make particles visible with colors
- [x] 1B.3: Add OrbitControls for navigation
- [x] 1B.4: Galaxy component with 488 particles deployed

### Completed - Phase 1C (Click Interaction)
- [x] 1C.1: Implement raycasting for particle selection
- [x] 1C.2: Create HUD overlay component with glassmorphic design
- [x] 1C.3: Add click handler and state management
- [x] 1C.4: ESC key support to close HUD

### Blocked/Questions
- None

## Current Status / Progress Tracking

**Last Updated:** 2025-11-25 (Phase 2A Reboot 2 - Clean Consolidation)

**Current Task:** Cleaning up the multi-repo mess and implementing the proven Jarvis pattern into the original app.

**Completed Milestones:**
✅ **Phase 1 Complete:** Core Visualization & UX
- 488 particles in 5 clusters
- Interactive HUD and Focus system
- Glassmorphic UI with Control Panel

**Next Steps:**
- Execute the cleanup (rm -rf reference/jarvis)
- Fix `GestureController.jsx` once and for all using the Reference logic.

## Executor's Feedback or Assistance Requests

**Open Questions for User:**
1. **Performance Check:** Does the app still crash or freeze on your machine? (Should be fixed now)
2. **Gesture Feel:** How does the "Fly" mode feel compared to "Orbit"?

**Technical Clarifications Needed:**
- None

## Lessons Learned

### Web Worker Architecture for Computer Vision (2025-11-25)

**Problem:** Running MediaPipe (`@mediapipe/tasks-vision`) on the main thread alongside Three.js caused severe UI freezing and dropped frames.

**Solution:** Implemented the "Off-Main-Thread" pattern:
1.  **Worker:** `vision.worker.js` handles the heavy ML inference loop.
2.  **Main Thread:** `GestureController.jsx` sends video frames (via `createImageBitmap`) to the worker and receives lightweight coordinates.
3.  **Synchronization:** Used `createImageBitmap` (transferable) to prevent copying large video frames.
4.  **Smoothing:** Used `lerp` (Linear Interpolation) in the `useFrame` loop to animate the camera smoothly (60 FPS) even if the worker only sends updates at 20 FPS.

**Key Takeaway:** For any heavy ML or CV task in the browser, ALWAYS use a Web Worker. Never block the UI thread.

### Git Security: Personal Data in galaxy_data.json (2025-11-25)

**Issue:** galaxy_data.json contains personal chat history and was previously committed to git (commit 407faaf).

**Actions Taken:**
1. ✅ Added `*.json` to .gitignore (user updated to broader pattern)
2. ✅ Removed from git tracking: `git rm --cached frontend/public/galaxy_data.json`
3. ✅ Committed removal in b794094
4. ⚠️ **Still exists in git history** (commit 407faaf) - User decided to keep as-is (safest approach)

**Key Lesson:** Always add files with personal data to .gitignore BEFORE first commit.

### MediaPipe Performance Issue (2025-11-25)

**Problem:** OLD MediaPipe `@mediapipe/hands` package crashes with WebGL errors.

**Solution:** Switched to NEW `@mediapipe/tasks-vision` API (2024 recommended).

**Lesson:** Always use the latest recommended API from official docs. Old packages can have critical compatibility issues.

### Canvas Texture Transparency Issue (2025-11-25)

**Problem:** Focus ring was blocking particles behind it.

**Solution:** Call `ctx.clearRect(0, 0, width, height)` BEFORE drawing any shapes on the canvas.

**Key Lesson:** When creating custom textures with HTML Canvas for Three.js materials, always clear canvas to transparent first.
