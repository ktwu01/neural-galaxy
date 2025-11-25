import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Galaxy } from './Galaxy'
import { ParticleHUD } from './ParticleHUD'
import { FocusPanel } from './FocusPanel'
import { ControlPanel } from './ControlPanel'
import { GestureController } from './GestureController'
import { HandCursor } from './HandCursor'
import { GestureInfoPanel } from './GestureInfoPanel'
import Minimap, { MinimapUpdater } from './Minimap'
import { GESTURE_CONFIG, CAMERA_CONFIG } from './config'
import { FaStar, FaCodeBranch, FaLinkedin, FaTwitter, FaGithub, FaKeyboard, FaDownload } from 'react-icons/fa' // Changed FaUpload to FaDownload
import SetupGuide from './components/SetupGuide/SetupGuide' // Import SetupGuide
import './App.css'

// Keyboard Help Panel Component
function KeyboardHelpPanel({ onClose }) {
  return (
    <div
      role="dialog"
      aria-labelledby="keyboard-help-title"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #00ffff',
        borderRadius: '12px',
        padding: '24px',
        color: 'white',
        fontFamily: 'monospace',
        zIndex: 2000,
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h2 id="keyboard-help-title" style={{
        fontSize: '20px',
        marginBottom: '16px',
        color: '#00ffff',
        textAlign: 'center',
      }}>
        <FaKeyboard style={{ marginRight: '8px' }} />
        Keyboard Shortcuts
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>K</kbd>
          <span style={{ flex: 1, marginLeft: '16px' }}>Open focused particle details</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>ESC</kbd>
          <span style={{ flex: 1, marginLeft: '16px' }}>Close panel or HUD</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>M</kbd>
          <span style={{ flex: 1, marginLeft: '16px' }}>Toggle Mouse/Hands mode</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>H</kbd>
          <span style={{ flex: 1, marginLeft: '16px' }}>Toggle this help panel</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>I</kbd>
          <span style={{ flex: 1, marginLeft: '16px' }}>Open import/setup guide</span>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Close keyboard shortcuts help"
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '10px',
          background: '#00ffff',
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontFamily: 'monospace',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#00cccc'
          e.target.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#00ffff'
          e.target.style.transform = 'scale(1)'
        }}
      >
        Got it! (ESC)
      </button>
    </div>
  )
}

function App() {
  const [selectedParticle, setSelectedParticle] = useState(null)
  const [focusedParticle, setFocusedParticle] = useState(null)
  const [rotationSpeed, setRotationSpeed] = useState(0.005)
  const [isGestureMode, setIsGestureMode] = useState(true)
  const [flySpeed, setFlySpeed] = useState(GESTURE_CONFIG.defaultFlySpeed)
  const [enableTwoHandRotation, setEnableTwoHandRotation] = useState(false) // Disabled by default
  const [enableHeadTracking, setEnableHeadTracking] = useState(GESTURE_CONFIG.enableHeadTracking) // Re-added
  const [edgeThreshold, setEdgeThreshold] = useState(GESTURE_CONFIG.defaultEdgeThreshold)
  const [boundaryDistance, setBoundaryDistance] = useState(GESTURE_CONFIG.defaultBoundaryDistance)
  
  // Debug State for Gesture Mode
  const [debugData, setDebugData] = useState({ landmarks: null, gesture: null, status: null })
  
  // Galaxy rotation controlled by gestures
  const [galaxyRotation, setGalaxyRotation] = useState({ x: 0, y: 0 })
  
  // Hand UI state
  const [handsUI, setHandsUI] = useState({
    left: { visible: false, position: null, gesture: 'IDLE' },
    right: { visible: false, position: null, gesture: 'IDLE' }
  })

  const galaxyRef = useRef();
  const minimapCanvasRef = useRef();

  // Keyboard shortcuts help panel state
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  // Setup Guide State
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [customGalaxyData, setCustomGalaxyData] = useState(null); // State to hold imported data

  // Check local storage on initial load for setup status
  useEffect(() => {
    const setupComplete = localStorage.getItem('neuralGalaxy_setupComplete') === 'true';
    const skipSetup = localStorage.getItem('neuralGalaxy_skipSetup') === 'true';

    if (!setupComplete && !skipSetup) {
      setShowSetupGuide(true);
    }
  }, []);

  const processImportedData = (data) => {
    console.log('[App.jsx] Step 1: Starting data processing for imported file...');

    if (!Array.isArray(data) || data.length === 0) {
      console.error('[App.jsx] Imported data is not a valid array or is empty.');
      return null;
    }

    console.log(`[App.jsx] Step 2: Found ${data.length} records in the imported file.`);

    // A very simple placeholder pre-processing pipeline
    const processedData = data.map((item, index) => {
      let displayContent = '';
      const rawContent = item.text || item.content || (item.conversation && item.conversation.text) || JSON.stringify(item);

      try {
        const parsedContent = JSON.parse(rawContent);
        // Attempt to find a suitable text field within the parsed JSON
        if (parsedContent.message && typeof parsedContent.message === 'string') {
          displayContent = parsedContent.message;
        } else if (parsedContent.response && typeof parsedContent.response === 'string') {
          displayContent = parsedContent.response;
        } else if (Array.isArray(parsedContent) && parsedContent.length > 0) {
          // Look for content in an array, e.g., ChatGPT's message structure
          const firstMessage = parsedContent.find(msg => msg.content && typeof msg.content === 'string');
          if (firstMessage) {
              displayContent = firstMessage.content;
          } else {
              // Fallback for arrays, stringify and truncate
              displayContent = JSON.stringify(parsedContent, null, 2);
          }
        } else if (typeof parsedContent === 'object' && Object.keys(parsedContent).length > 0) {
          // If it's an object, try to find a general 'text' or 'content' field
          displayContent = parsedContent.text || parsedContent.content || JSON.stringify(parsedContent, null, 2);
        } else {
          displayContent = rawContent; // Fallback if parsing didn't yield useful text
        }
      } catch (e) {
        // Not a JSON string, or parsing failed, use as plain text
        displayContent = rawContent;
      }

      // Truncate to a reasonable length for display
      const maxLength = 200; // Define a max length for summary
      if (displayContent.length > maxLength) {
        displayContent = displayContent.substring(0, maxLength) + '...';
      }

      // Assign a random cluster/color for visual differentiation
      const clusterId = Math.floor(Math.random() * 5); // 5 random clusters
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

      // Generate random positions for a simple spherical distribution
      const radius = 100 + Math.random() * 50; // Place them in a shell
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;

      return {
        id: item.id || `imported-${index}`,
        title: item.title || `Imported Item ${index + 1}`,
        text: displayContent, // Use the processed content
        cluster: clusterId,
        color: colors[clusterId],
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      };
    });

    console.log('[App.jsx] Step 3: Finished processing data. Sample of first item:', processedData[0]);
    console.log(`[App.jsx] Step 4: Total processed points: ${processedData.length}`);

    return processedData;
  };

  // Handle setup complete from SetupGuide
  const handleSetupComplete = (data) => {
    if (data) {
      console.log('[App.jsx] Setup complete with data. Processing...');
      const processed = processImportedData(data);
      setCustomGalaxyData(processed);
      localStorage.setItem('neuralGalaxy_hasCustomData', 'true');
    } else {
      console.log('[App.jsx] Setup skipped, using default data.');
      localStorage.setItem('neuralGalaxy_hasCustomData', 'false');
    }
    localStorage.setItem('neuralGalaxy_setupComplete', 'true');
    setShowSetupGuide(false);
  };


  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      // Ignore shortcuts when typing in input fields or when setup guide is open
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || showSetupGuide) return

      // ESC: close HUD or help panel
      if (e.key === 'Escape') {
        if (selectedParticle) {
          setSelectedParticle(null)
        } else if (showKeyboardHelp) {
          setShowKeyboardHelp(false)
        }
      }
      // K: open focused particle in HUD
      if (e.key === 'k' || e.key === 'K') {
        if (focusedParticle) {
          setSelectedParticle(focusedParticle)
        }
      }
      // ?: Toggle keyboard shortcuts help
      if (e.key === '?' && !e.shiftKey) {
        setShowKeyboardHelp(!showKeyboardHelp)
      }
      // H: Toggle keyboard shortcuts help
      if (e.key === 'h' || e.key === 'H') {
        setShowKeyboardHelp(!showKeyboardHelp)
      }
      // M: Toggle control mode (Mouse/Hands)
      if (e.key === 'm' || e.key === 'M') {
        setIsGestureMode(!isGestureMode)
      }
      // I: Toggle import/setup dialog
      if (e.key === 'i' || e.key === 'I') {
        setShowSetupGuide(!showSetupGuide) // Now opens setup guide
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedParticle, focusedParticle, showKeyboardHelp, isGestureMode, showSetupGuide]) // Added showSetupGuide to dependency array

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }} role="application" aria-label="Neural Galaxy 3D Visualization">
      {showSetupGuide ? (
        <SetupGuide onSetupComplete={handleSetupComplete} />
      ) : (
        <>
          <Canvas camera={{ position: [0, 0, 200], fov: 60 }}>
            {/* Deep space background */}
            <color attach="background" args={['#000000']} />

            {/* Minimal lighting for depth perception */}
            <ambientLight intensity={0.3} />

            {/* The galaxy particle system */}
            <Galaxy
              ref={galaxyRef}
              onParticleClick={setSelectedParticle}
              onFocusChange={setFocusedParticle}
              focusedParticle={focusedParticle}
              rotationSpeed={rotationSpeed}
              isGestureMode={isGestureMode}
              galaxyRotation={galaxyRotation}
              customGalaxyData={customGalaxyData} // Pass custom data to Galaxy
            />

            {/* Camera controls - Switch between Orbit and Gesture */}
            {isGestureMode ? (
              <GestureController 
                onDebugData={setDebugData}
                onGalaxyRotationChange={setGalaxyRotation}
                onHandsUpdate={setHandsUI}
                flySpeed={flySpeed}
                enableTwoHandRotation={enableTwoHandRotation}
                enableHeadTracking={enableHeadTracking}
                edgeThreshold={edgeThreshold}
                boundaryDistance={boundaryDistance}
              />
            ) : (
              <OrbitControls
                enableDamping
                dampingFactor={CAMERA_CONFIG.orbitDampingFactor}
                rotateSpeed={CAMERA_CONFIG.orbitRotateSpeed}
                zoomSpeed={CAMERA_CONFIG.orbitZoomSpeed}
                minDistance={CAMERA_CONFIG.orbitMinDistance}
                maxDistance={CAMERA_CONFIG.orbitMaxDistance}
              />
            )}
            <MinimapUpdater galaxyRef={galaxyRef} minimapCanvasRef={minimapCanvasRef} />
          </Canvas>
          

          {/* UI Overlay - Top Left */}
          {!selectedParticle && (
            <div style={{
              position: 'absolute',
              top: 20,
              left: 20,
              color: 'white',
              fontFamily: 'monospace',
              pointerEvents: 'none', // Allow clicks to pass through
              textShadow: '0 0 4px rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', textShadow: '0 0 10px #00ffff', margin: 0 }}>Neural Galaxy</h1>
              {/* GitHub Repo Links */}
              <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px', fontSize: '24px' }} role="navigation" aria-label="GitHub repository actions">
                <a
                  href="https://github.com/ktwu01/neural-galaxy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00ffff', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  aria-label="Star this project on GitHub"
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <FaStar />
                </a>
                <a
                  href="https://github.com/ktwu01/neural-galaxy/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00ffff', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  aria-label="Fork this project on GitHub"
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <FaCodeBranch />
                </a>
              </div>
            </div>
          )}

          {/* Focus Info Panel at top-middle */}
          {!selectedParticle && <FocusPanel particle={focusedParticle} />}

          {/* Particle HUD Overlay */}
          <ParticleHUD
            particle={selectedParticle}
            onClose={() => setSelectedParticle(null)}
          />

          {/* Top Right UI Container for Socials and Control Panel */}
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            {/* Social Icons */}
            <nav style={{ display: 'flex', gap: '8px', fontSize: '24px' }} aria-label="Social media links">
              <a
                href="https://www.linkedin.com/in/ktwu01/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ffff', textDecoration: 'none', pointerEvents: 'auto', transition: 'opacity 0.2s' }}
                aria-label="Connect on LinkedIn"
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                <FaLinkedin />
              </a>
              <a
                href="https://x.com/ktwu01"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ffff', textDecoration: 'none', pointerEvents: 'auto', transition: 'opacity 0.2s' }}
                aria-label="Follow on X (Twitter)"
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                <FaTwitter />
              </a>
              <a
                href="https://github.com/ktwu01/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ffff', textDecoration: 'none', pointerEvents: 'auto', transition: 'opacity 0.2s' }}
                aria-label="View GitHub profile"
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                <FaGithub />
              </a>
            </nav>
            {/* Control Panel (right side) */}
            <ControlPanel
              rotationSpeed={rotationSpeed}
              onRotationSpeedChange={setRotationSpeed}
              flySpeed={flySpeed}
              onFlySpeedChange={setFlySpeed}
              isGestureMode={isGestureMode}
              onToggleGestureMode={() => setIsGestureMode(!isGestureMode)}
              // onToggleHeadTracking={() => setEnableHeadTracking(!enableHeadTracking)} // Removed as it's always enabled
              enableTwoHandRotation={enableTwoHandRotation}
              onToggleTwoHandRotation={() => setEnableTwoHandRotation(!enableTwoHandRotation)}
              edgeThreshold={edgeThreshold}
              onEdgeThresholdChange={setEdgeThreshold}
              boundaryDistance={boundaryDistance}
              onBoundaryDistanceChange={setBoundaryDistance}
            />
          </div>


          {/* Hand Skeleton Overlays (Visual Feedback) */}
          {isGestureMode && (
            <>
              <HandCursor 
                hand="left"
                position={handsUI.left.position}
                gesture={handsUI.left.gesture}
                visible={handsUI.left.visible}
                landmarks={handsUI.left.landmarks}
              />
              <HandCursor 
                hand="right"
                position={handsUI.right.position}
                gesture={handsUI.right.gesture}
                visible={handsUI.right.visible}
                landmarks={handsUI.right.landmarks}
              />
            </>
          )}

          {/* Gesture Info Panel */}
          <GestureInfoPanel isGestureMode={isGestureMode} />

          {/* Minimap */}
          <Minimap ref={minimapCanvasRef} />

          {/* Keyboard Help Panel */}
          {showKeyboardHelp && <KeyboardHelpPanel onClose={() => setShowKeyboardHelp(false)} />}

          {/* Floating Action Buttons - Bottom Right */}
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 1000,
          }}>
            {/* Import Button */}
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)} // Now opens setup guide
              aria-label="Import chat history"
              style={{
                background: 'rgba(255, 200, 0, 0.2)',
                border: '2px solid #ffcc00',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#ffcc00',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 200, 0, 0.4)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 200, 0, 0.2)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <FaDownload style={{ fontSize: '16px' }} /> {/* Changed FaUpload to FaDownload */}
              Import (I)
            </button>

            {/* Help Button */}
            <button
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              aria-label="Show keyboard shortcuts"
              style={{
                background: 'rgba(0, 255, 255, 0.2)',
                border: '2px solid #00ffff',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#00ffff',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 255, 255, 0.4)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 255, 255, 0.2)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <FaKeyboard style={{ fontSize: '16px' }} />
              Help (H)
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
