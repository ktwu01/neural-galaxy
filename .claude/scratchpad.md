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

### Phase 0: Project Setup & Validation (Est: 2-3 hours)
**Success Criteria:** Development environment running, sample data loaded

- [ ] **Task 0.1:** Initialize React + Vite + R3F project
  - Install dependencies: `@react-three/fiber`, `@react-three/drei`, `three`
  - Verify dev server runs and shows basic 3D scene
  - Success: Can see a spinning cube or basic geometry

- [ ] **Task 0.2:** Examine and validate input data structure
  - Read `chat_history.json` file (if it exists)
  - Document actual JSON schema (keys, nesting, data types)
  - Create sample dataset with 100 entries if real data unavailable
  - Success: Know exact format of input data

- [ ] **Task 0.3:** Set up Python environment for data pipeline
  - Install: `sentence-transformers`, `umap-learn`, `sklearn`, `numpy`, `pandas`
  - Verify imports work and models can download
  - Success: Can run basic embedding test on sample text

### Phase 1A: Minimal Data Pipeline (Est: 3-4 hours)
**Success Criteria:** Can convert 100 chat entries → 3D coordinates + colors

- [ ] **Task 1A.1:** Extract text from chat history JSON
  - Python script to parse JSON and extract prompts
  - Handle missing/malformed data gracefully
  - Export to intermediate format (CSV or simple JSON)
  - Success: Get list of text strings with IDs

- [ ] **Task 1A.2:** Generate embeddings
  - Load `all-MiniLM-L6-v2` model
  - Convert text → 384-dim vectors
  - Save embeddings to numpy file for caching
  - Success: Generate embeddings for 100 samples in <30 seconds

- [ ] **Task 1A.3:** Reduce to 3D coordinates with UMAP
  - Apply UMAP with n_neighbors=15, min_dist=0.1, n_components=3
  - Normalize coordinates to reasonable scale (e.g., -100 to +100)
  - Success: Get 3D coordinates that spread out reasonably

- [ ] **Task 1A.4:** Simple clustering and coloring
  - Use KMeans (NOT HDBSCAN for MVP - simpler)
  - Start with k=5 clusters for simplicity
  - Map cluster IDs to 5 distinct colors (hardcoded palette)
  - Success: Each point has an assigned color

- [ ] **Task 1A.5:** Export final galaxy data
  - Format: `[{id, x, y, z, color, text}, ...]`
  - Save as `public/galaxy_data.json` in frontend project
  - Validate JSON is well-formed
  - Success: File loads in browser without errors

### Phase 1B: Minimal 3D Visualization (Est: 4-5 hours)
**Success Criteria:** Can see 100 colored particles in 3D space, can move camera

- [ ] **Task 1B.1:** Create basic particle system component
  - Load `galaxy_data.json` via fetch
  - Use `THREE.Points` with `BufferGeometry`
  - Set positions from x,y,z coordinates
  - Set colors from data (convert hex to RGB floats)
  - Success: See particles render as dots

- [ ] **Task 1B.2:** Make particles actually visible and pretty
  - Use `PointsMaterial` with `size=2`
  - Set `sizeAttenuation=true` for depth perception
  - Add circle texture (sprite) for soft glow effect
  - Success: Particles look like glowing orbs, not pixels

- [ ] **Task 1B.3:** Add basic camera controls
  - Use `<OrbitControls />` from drei (SIMPLER than FlyControls for MVP)
  - Allow mouse drag to rotate, scroll to zoom
  - Set reasonable limits (maxDistance, minDistance)
  - Success: Can navigate around the particle cloud smoothly

- [ ] **Task 1B.4:** Test with larger dataset
  - Scale up to 1,000 particles
  - Measure FPS (use Stats.js or browser DevTools)
  - Success: Maintain 60 FPS on development machine

### Phase 1C: Basic Interaction (Est: 2-3 hours)
**Success Criteria:** Clicking a particle shows its text

- [ ] **Task 1C.1:** Implement raycasting for particle selection
  - Add click handler to canvas
  - Use THREE.Raycaster to detect particle intersections
  - Success: Console logs particle data on click

- [ ] **Task 1C.2:** Create simple HUD overlay
  - CSS overlay positioned over canvas
  - Shows selected particle's text in readable format
  - Add close button to dismiss
  - Success: Can read chat prompt when clicking particle

### Phase 2: Polish & Scale Testing (Est: 3-4 hours)
**Success Criteria:** Works with 5,000+ particles, looks presentable

- [ ] **Task 2.1:** Process full dataset
  - Run pipeline on actual chat history (all entries)
  - Measure processing time and identify bottlenecks
  - Success: Generate full galaxy data file

- [ ] **Task 2.2:** Performance optimization (if needed)
  - Test FPS with full dataset
  - If FPS < 60, implement optimizations:
    - Level-of-detail (LOD): render fewer particles when zoomed out
    - Frustum culling: don't render off-screen particles
    - Reduce particle size/complexity
  - Success: Acceptable performance with full dataset

- [ ] **Task 2.3:** Visual polish
  - Add starfield background
  - Adjust camera starting position for good initial view
  - Fine-tune colors for better contrast
  - Add loading state while data fetches
  - Success: Looks presentable for demo

- [ ] **Task 2.4:** Add cluster labels (optional enhancement)
  - Compute cluster centroids
  - Use `<Text3D>` or `<Text>` from drei to label major clusters
  - Success: Can identify topic areas visually

## Project Status Board

**Current Phase:** Phase 1D Partially Complete - Enhanced UX & Controls

### To Do (Pending) - Phase 1D: Enhanced UX & Controls (Remaining)
- [ ] 1D.6: Tighten clustering (reduce inter-cluster separation in UMAP)
- [ ] 1D.7: Increase particle separation (increase min_dist in UMAP)
- [ ] 1D.8: Create right-side control panel UI
- [ ] 1D.9: Add rotation speed slider to control panel
- [ ] 1D.10: Add cluster tightness slider to control panel (triggers rebuild)
- [ ] 1D.11: Add particle separation slider to control panel (triggers rebuild)

### In Progress
- None

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
- None yet

## Current Status / Progress Tracking

**Last Updated:** 2025-11-25 (Phase 1D Auto-Focus & Highlight Complete - Ready to Commit)

**Current Task:** Ready to commit Phase 1D progress and continue with remaining tasks

**Completed Milestones:**

✅ **Phase 0 Complete:** Development environment fully functional
- React + Vite + R3F project created
- Dev server running at localhost:5173
- 488 user messages extracted from ChatGPT export
- Python ML environment ready

✅ **Phase 1A Complete:** Data pipeline successfully generated galaxy coordinates
- Generated 384-dim embeddings for 488 messages (all-MiniLM-L6-v2)
- Reduced to 3D coordinates using UMAP (n_neighbors=15, min_dist=0.1)
- Clustered into 5 semantic groups with KMeans
- Exported 212KB galaxy_data.json with colors

✅ **Phase 1B Complete:** 3D visualization deployed
- Created Galaxy particle system component (THREE.Points with BufferGeometry)
- 488 colored particles rendering in 3D space
- OrbitControls for rotation/zoom navigation
- Stats overlay for FPS monitoring
- Auto-rotation animation active

✅ **Phase 1C Complete:** Click interaction and HUD overlay
- Raycasting for particle selection
- ParticleHUD component with glassmorphic design
- Click handler and state management
- ESC key support to close HUD

✅ **Phase 1D (Partial) Complete:** Auto-focus system and highlight ring
- Slowed auto-rotation to 0.005 (10x slower)
- Auto-focus detection using raycaster from screen center
- FocusHighlight component with pulsing ring
- FocusPanel component showing focused particle info at top-middle
- Focus only updates on camera movement (not rotation)
- Ring position synchronized with particle rotation
- Changed shortcut from 'O' to 'K' for better UX
- Fixed ring transparency issue (alpha channel + alphaTest)

**Next Steps:**
- Commit current progress
- Continue with Phase 1D remaining tasks (control panel UI + UMAP parameter adjustments)

## Executor's Feedback or Assistance Requests

**Open Questions for User:**

1. ✅ **Data Location:** RESOLVED - Data is at `data/conversations example to be clean PII.json` (26MB, ChatGPT export format)

2. **Development Environment:** What machine will this run on? (Need to know specs for performance targets)

3. **Scope Confirmation:** User approved proceeding as Executor ("lets do it as exe")

**Technical Clarifications Needed:**
- None yet (will populate as implementation progresses)

## Lessons Learned

### Canvas Texture Transparency Issue (2025-11-25)

**Problem:** Focus ring was blocking particles behind it, appearing as an opaque rectangle even though `transparent: true` was set on the SpriteMaterial.

**Root Cause:** Canvas elements have a default opaque background. When creating a CanvasTexture in Three.js, the canvas background (typically white or black) gets rendered as part of the texture, creating a rectangular "layer" that occludes objects behind it.

**Solution:** Call `ctx.clearRect(0, 0, width, height)` BEFORE drawing any shapes on the canvas. This clears the canvas to fully transparent (alpha = 0), so only the drawn shapes (the ring) are visible.

**Code Fix:**
```javascript
// Enable alpha channel when creating context
const ctx = canvas.getContext('2d', { alpha: true })
ctx.clearRect(0, 0, 128, 128)  // Clear to transparent first
// ... then draw ring shapes

// In SpriteMaterial:
transparent={true}
alphaTest={0.01}  // Discard pixels with alpha < 0.01
depthWrite={false}  // Don't write to depth buffer
blending={THREE.AdditiveBlending}
```

**Key Lesson:** When creating custom textures with HTML Canvas for Three.js materials:
1. Create context with `{ alpha: true }` option to enable alpha channel
2. Always clear canvas to transparent first: `ctx.clearRect()`
3. Use `alphaTest` to discard fully transparent pixels (prevents black rectangles)
4. Set `depthWrite={false}` to prevent z-buffer issues with transparency
5. The `transparent: true` material property only respects alpha channel in the texture

### Data Format Documentation

**Input File:** `data/conversations example to be clean PII.json`
- **Size:** 26MB
- **Format:** ChatGPT conversation export (array of conversation objects)
- **Structure:**
  - Each conversation has: `title`, `create_time`, `update_time`, `mapping` (nested message tree)
  - Messages in `mapping` object have: `id`, `message.content.parts[]` (text), `message.author.role` (user/assistant/system)
  - Need to extract user prompts from messages where `author.role === "user"`
  - Text content is in `message.content.parts[]` array

### From Planning Phase

**Lesson 1: Start Small, Measure, Then Scale**
- Original blueprint assumed 20K particles would work fine
- Reality: Need to test with 100 → 1000 → 5000 → 10000+ incrementally
- Measure FPS at each stage before adding visual effects

**Lesson 2: Use Proven Libraries Over Custom Implementations**
- Blueprint suggested FlyControls with custom momentum physics
- Better approach: Start with OrbitControls (simpler, proven), upgrade later if needed
- Don't reinvent the wheel for MVP

**Lesson 3: Defer Complex Features**
- Gesture control (MediaPipe) is a separate project entirely
- Bloom effects and additive blending can wait until basic visualization works
- Focus on core value: seeing your thoughts in 3D space

**Lesson 4: Data Pipeline Is Half the Project**
- Embeddings, UMAP, clustering, coloring = many moving parts
- Each step needs validation before moving to next
- Cache intermediate results (embeddings) to speed up iteration

---

## PLANNER SUMMARY FOR USER REVIEW

### Key Changes from Original Blueprint:

**⭐ Simplified Scope:**
- MVP uses OrbitControls (rotate/zoom) instead of FPS flying initially
- Click to select particles instead of proximity-based reveal
- Deferred: Gesture control, bloom effects, momentum physics, 3D text labels

**⭐ Incremental Approach:**
- Start with 100 particles → 1,000 → 5,000+ (test performance at each stage)
- Use KMeans (k=5) instead of HDBSCAN for simpler clustering
- Validate 2D projections before committing to 3D UMAP

**⭐ Risk Mitigation:**
- Clear success criteria for each task
- Time estimates for planning
- Built-in performance checkpoints
- Fallback options documented

**⭐ What Stays from Original Vision:**
- Same tech stack (React + R3F + sentence-transformers + UMAP)
- Same visual aesthetic (space + colored clusters + particles)
- Same data structure ({x, y, z, color, text})
- Same end goal: navigable 3D universe of your thoughts

**Estimated Total Time:** 14-19 hours of focused development work

**Ready to Proceed?** Awaiting user approval to switch to Executor mode and begin Phase 0.
