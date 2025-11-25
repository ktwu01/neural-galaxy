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

### Phase 4: Import & Dynamic Data (MEDIUM PRIORITY)
**Goal:** Allow users to import their own chat history and generate personalized galaxies

**Current Status:** Basic file upload UI implemented, needs:
- Setup guide for first-time users
- Export instructions
- Data preprocessing pipeline
- Icon fix (upward → downward arrow)

**Tasks:**
- [x] Design UI for file upload/import button
- [x] Implement file reader for chat history formats (JSON only - updated scope)
- [x] Add data validation and error handling for imported files
- [x] Fix import icon (use downward arrow FaDownload, not upward FaUpload)
- [x] Create Setup Guide for first-time user onboarding
- [x] Add export instructions (how to get chat history from Claude.ai, ChatGPT, etc.)
- [x] Implement preprocessing pipeline (tokenization, embedding generation)
      add Debug code so that it will show Via Google Chrome Console
      Let the user verify this process is correct
- [ ] Add progress indicator for import/preprocessing workflow
- [ ] Update galaxy data structure to accept dynamically imported data
- [ ] Test end-to-end import workflow with sample data

### Phase 4A: Setup Guide & User Onboarding (HIGH PRIORITY)
**Goal:** Guide first-time users to import their own chat history with clear instructions

**Problem:**
- Users don't know they can import their own data
- No guidance on how to export chat history from various platforms
- Import feature is hidden (must discover button)

**Solution: First-Time User Experience**

**Components to Build:**
1. **SetupGuide.jsx** - Main wizard container with stepper
2. **WelcomeStep.jsx** - Introduction and choice (import vs demo)
3. **ExportInstructions.jsx** - Platform-specific export guides
4. **FileUploadStep.jsx** - Reuse existing FileUpload component
5. **ProcessingStep.jsx** - Show preprocessing progress
6. **SuccessStep.jsx** - Completion + quick tutorial

**Flow:**
```
User visits app → Check localStorage
  ├─ Setup complete? → Show main app
  └─ First time? → Show Setup Guide
       ↓
    Welcome Screen ("Welcome to Neural Galaxy")
       ↓
    ┌──────────────┴──────────────┐
    ↓                             ↓
Import My Data              Try Demo Data
    ↓                             ↓
Export Instructions         Skip to Main App
    ↓
File Import (with validation)
    ↓
Processing (UMAP, clustering)
    ↓
Success + Tutorial
    ↓
Main App (with custom galaxy)
```

**Export Instructions Content:**

<!-- Do not do this for current. **For Claude.ai:**
- Settings → Data Export
- Wait for email with download link
- Unzipped downloaded file
- Import `conversations.json` inside the extracted folder to here -->

**For ChatGPT:**
- Settings → Data controls → Export data
- Wait for email with download link
- Unzipped downloaded file
- Import `conversations.json` inside the extracted folder to here

**Generic Format:**
- JSON array of conversation objects
- Required fields: `title`, `text`/`content`
- Example structure (collapsible)

**localStorage Keys:**
- `neuralGalaxy_setupComplete`: boolean
- `neuralGalaxy_hasCustomData`: boolean
- `neuralGalaxy_skipSetup`: boolean (if user dismissed guide)

**Design Decisions:**
- Setup guide is **skippable** (not mandatory)
- Demo data always available via settings
- Can re-run setup guide from settings menu
- Keyboard shortcut ESC to close guide

**Success Criteria:**
- User understands they can import their own data
- Clear step-by-step export instructions
- Smooth onboarding experience
- Can skip and use demo data
- Setup only shows once (unless manually triggered)

### Phase 5: Word-Based Galaxy Architecture (MEDIUM PRIORITY)
**Goal:** Scale system to handle 100+ conversations by shifting from conversation-based to word-based particles

**Rationale:** Current conversation-based approach doesn't scale well for users with extensive chat histories

**Tasks:**
- [ ] Design word-based particle architecture
- [ ] Implement word tokenization and clustering
- [ ] Update UMAP embedding strategy for word-level data
- [ ] Test performance with large word datasets
- [ ] Migration strategy from conversation-based to word-based

### Phase 6: Control Panel Enhancements (LOW PRIORITY)
**Goal:** Add spatial controls for particle distribution

**Tasks:**
- [ ] Add particle spatial separation slider
- [ ] Add cluster color separation slider
- [ ] Update Galaxy.jsx to support dynamic spatial parameters
- [ ] Test visual impact of parameter changes

### Phase 7: Hand Tracking Bug Fixes (LOW PRIORITY)
**Issue:** Left/right hand flip - text displays correctly but hand skeleton image needs to be mirrored

**Tasks:**
- [ ] Debug HandCursor.jsx mirroring logic
- [ ] Ensure text labels remain correct after image flip
- [ ] Test with both hands simultaneously

### Phase 8: Future Enhancements (DEFERRED)
- [ ] Starfield background
- [ ] Loading states
- [ ] Better particle effects
- [ ] Fullscreen mode
- [x] Minimap interactivity (click to teleport, zoom)
- [ ] More gesture commands (swipe, etc.)

## Project Status Board

**Current Phase:** Phase 4-7 Planning

**Priority Order (from TODO.md):**
1. 🔴 **CRITICAL:** Follow best practice in @jarvis (needs clarification)
2. 🟡 **MEDIUM:**
   - Import & Dynamic Data (Phase 4)
   - Word-Based Galaxy Architecture (Phase 5)
3. 🔵 **LOW:**
   - Control Panel Enhancements (Phase 6)
   - Hand Tracking Bug Fixes (Phase 7)

### In Progress
- ✅ Icon sizing and layout adjustments (completed 2025-11-25)

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

**Latest Completed Work - UI Best Practices Implementation:**

**Accessibility Improvements:**
1. ✅ Added keyboard shortcuts panel (H key or ? to toggle)
2. ✅ Implemented proper ARIA labels on all interactive elements
3. ✅ Added aria-live regions for dynamic content (FocusPanel)
4. ✅ Added keyboard focus indicators (2px cyan outline) on all buttons
5. ✅ Semantic HTML improvements (nav, h1, button tags)
6. ✅ Added role="application" to main container
7. ✅ Added role="dialog" with aria-modal for help panel

**Keyboard Shortcuts Enhancements:**
- ✅ K: Open focused particle details
- ✅ ESC: Close panels/HUD (hierarchical)
- ✅ M: Toggle Mouse/Hands mode
- ✅ H: Toggle keyboard help panel
- ✅ Input field detection (shortcuts disabled while typing)

**UI/UX Enhancements:**
1. ✅ Floating keyboard help button (bottom-right)
2. ✅ Hover effects on all interactive elements (opacity, scale)
3. ✅ Focus states with proper outline styling
4. ✅ Improved button accessibility (aria-pressed, aria-expanded)
5. ✅ Better link accessibility with descriptive aria-labels
6. ✅ Visual feedback on all interactions

**Icon & Layout Fixes:**
- ✅ Fixed ControlPanel.jsx JSX syntax error
- ✅ Standardized all icon sizes to 24px
- ✅ Made settings icon inline with social icons
- ✅ Settings panel dropdown animation

**Dev Server:** Running at http://localhost:5175/

**Next Action:** Awaiting user testing and feedback on UI improvements

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

### UI/UX Best Practices for React Three Fiber (2025-11-25)

**Key Patterns:**
1. **Overlay UI:** Use HTML/CSS absolutely positioned over Canvas, not WebGL rendering
2. **Accessibility First:**
   - Always add ARIA labels (aria-label, aria-pressed, aria-expanded)
   - Implement keyboard focus indicators (2px outline with high contrast)
   - Use semantic HTML (nav, h1, button, not just div)
   - Add role attributes (dialog, status, application)
   - Implement aria-live regions for dynamic content
3. **Keyboard Shortcuts:**
   - Document all shortcuts in help panel
   - Disable shortcuts when user is typing in inputs
   - Use hierarchical ESC behavior (close innermost panel first)
4. **Focus Management:**
   - Visible focus states on all interactive elements
   - Proper tab order (logical reading sequence)
   - Focus programmatically when opening modals
5. **Visual Feedback:**
   - Hover effects (opacity, scale transitions)
   - Active states for buttons
   - Smooth transitions (0.2-0.3s ease)

**Tools Used:**
- ARIA attributes for screen readers
- CSS :focus-visible for keyboard navigation
- Semantic HTML5 elements
- React state for keyboard help panel
