import { useState, useEffect, useRef, useCallback } from 'react'
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
import { FaStar, FaCodeBranch, FaLinkedin, FaTwitter, FaGithub, FaKeyboard, FaDownload, FaCamera } from 'react-icons/fa' // Changed FaUpload to FaDownload
import SetupGuide from './components/SetupGuide/SetupGuide' // Import SetupGuide
import loadHtml2Canvas from './utils/loadHtml2Canvas'
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
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>S</kbd>
          <span style={{ flex: 1, marginLeft: '16px' }}>Capture full-screen screenshot</span>
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
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false)
  const [screenshotMessage, setScreenshotMessage] = useState('')
  const [screenshotCountdown, setScreenshotCountdown] = useState(null)

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

    // On first visit, automatically mark setup as complete with demo data
    // Users can still access setup guide via Import button if they want to import their own data
    if (!setupComplete && !skipSetup) {
      localStorage.setItem('neuralGalaxy_setupComplete', 'true');
      localStorage.setItem('neuralGalaxy_hasCustomData', 'false');
      // Don't show setup guide - go straight to demo
    }
  }, []);
  useEffect(() => {
    if (!screenshotMessage) return
    const timeout = setTimeout(() => setScreenshotMessage(''), 4000)
    return () => clearTimeout(timeout)
  }, [screenshotMessage])

  const processImportedData = (data) => {
    console.log('[App.jsx] Step 1: Starting data processing for imported file...');

    // Helper function to robustly extract text from different possible data structures
    function getTextFromRecord(record, visited = new Set()) {
      if (!record || typeof record !== 'object' || visited.has(record)) {
        return null; // We can only process objects, and we must avoid circular references
      }
      visited.add(record);

      // 1. New "mapping" format (from user feedback)
      if (record.mapping && typeof record.mapping === 'object') {
        // Find the first message with actual text content in the mapping.
        for (const node of Object.values(record.mapping)) {
          if (node && node.message && node.message.content && node.message.content.parts) {
            const textPart = node.message.content.parts.find(p => typeof p === 'string' && p.trim() !== '');
            if (textPart) {
              return textPart;
            }
          }
        }
      }

      // 2. Direct `text` property (like in our default galaxy_data.json)
      if (typeof record.text === 'string' && record.text.trim()) {
        return record.text;
      }

      // 3. ChatGPT-like structure at the top level
      if (record.message && record.message.content && record.message.content.parts) {
        const textParts = record.message.content.parts.filter(p => typeof p === 'string' && p.trim() !== '');
        if (textParts.length > 0) {
          return textParts.join('\n\n');
        }
      }

      // 4. Handle nested single-key object format, e.g. { "uuid-xyz": {...} }
      const keys = Object.keys(record);
      if (keys.length === 1 && typeof record[keys[0]] === 'object' && record[keys[0]] !== null) {
        return getTextFromRecord(record[keys[0]], visited); // Recurse
      }
      
      // If no text could be extracted, return null
      return null;
    }

    let dataAsArray = [];
    if (Array.isArray(data)) {
      dataAsArray = data;
    } else if (typeof data === 'object' && data !== null) {
      dataAsArray = Object.values(data);
    }
    
    dataAsArray = dataAsArray.filter(item => item && typeof item === 'object');

    if (dataAsArray.length === 0) {
      console.error('[App.jsx] Imported data is not a valid array or is empty after filtering.');
      return null;
    }

    console.log(`[App.jsx] Step 2: Found ${dataAsArray.length} records in the imported file.`);

    const processedData = dataAsArray.map((item, index) => {
      const text = getTextFromRecord(item);
      
      // If we couldn't extract text, we'll skip this record.
      if (!text) {
          return null; 
      }

      const word_count = text ? text.split(/\s+/).length : 0;
      let size;
      if (word_count < 30) {
          size = 8.0;
      } else if (word_count < 150) {
          size = 12.0;
      } else {
          size = 16.0;
      }

      // Use the item's own title if available, otherwise generate one.
      const title = item.title || `Imported Item ${index + 1}`;
      const id = item.id || `imported-${index}`;

      const clusterId = Math.floor(Math.random() * 5);
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
      const radius = 100 + Math.random() * 50;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;

      return {
        id: id,
        title: title,
        text: text,
        cluster: clusterId,
        color: colors[clusterId],
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        size: size,
      };
    }).filter(item => item !== null); // Filter out the items we couldn't process

    if (processedData.length === 0) {
      console.error('[App.jsx] No processable records found in the imported file.');
      return null;
    }

    console.log(`[App.jsx] Step 3: Finished processing data. Sample of first item:`, processedData[0]);
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
  const performScreenshotCapture = useCallback(async () => {
    if (isCapturingScreenshot) return

    try {
      setIsCapturingScreenshot(true)
      setScreenshotMessage('Rendering screenshot...')

      const html2canvas = await loadHtml2Canvas()
      const target = document.body

      if (!html2canvas || !target) {
        throw new Error('html2canvas failed to initialize or target unavailable')
      }

      const canvas = await html2canvas(target, {
        backgroundColor: '#000000',
        useCORS: true,
        logging: false,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        onclone: (doc) => {
          doc.documentElement.scrollTop = 0
        }
      })

      await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('html2canvas returned empty blob'))
            return
          }
          const downloadName = `neural-galaxy-${new Date().toISOString().replace(/[:.]/g, '-')}.png`
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = downloadName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          resolve()
        }, 'image/png')
      })

      setScreenshotMessage('Screenshot saved to your downloads.')
    } catch (error) {
      console.error('[Screenshot] Failed to capture UI', error)
      setScreenshotMessage('Unable to capture screenshot. Check console for details.')
    } finally {
      setIsCapturingScreenshot(false)
    }
  }, [isCapturingScreenshot]);

  useEffect(() => {
    if (screenshotCountdown === null) return

    if (screenshotCountdown > 0) {
      setScreenshotMessage(`Screenshot in ${screenshotCountdown}...`)
      const timer = setTimeout(() => {
        setScreenshotCountdown(prev => (prev !== null ? prev - 1 : null))
      }, 1000)
      return () => clearTimeout(timer)
    }

    if (screenshotCountdown === 0) {
      setScreenshotCountdown(null)
      performScreenshotCapture()
    }
  }, [screenshotCountdown, performScreenshotCapture])

  const handleScreenshot = useCallback(() => {
    if (isCapturingScreenshot || screenshotCountdown !== null) return
    setScreenshotCountdown(3)
    setScreenshotMessage('Screenshot in 3...')
  }, [isCapturingScreenshot, screenshotCountdown]);


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
      // S: Capture screenshot
      if (e.key === 's' || e.key === 'S') {
        handleScreenshot()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedParticle, focusedParticle, showKeyboardHelp, isGestureMode, showSetupGuide, handleScreenshot]) // Added showSetupGuide to dependency array

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }} role="application" aria-label="Neural Galaxy 3D Visualization">
      {showSetupGuide ? (
        <SetupGuide onSetupComplete={handleSetupComplete} />
      ) : (
        <>
          <Canvas
            className="galaxy-canvas"
            gl={{ preserveDrawingBuffer: true }}
            camera={{ position: [0, 0, 200], fov: 60 }}
          >
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

            {/* Screenshot Button */}
            <button
              onClick={handleScreenshot}
              aria-label="Save a screenshot of the current galaxy view"
              disabled={isCapturingScreenshot || screenshotCountdown !== null}
              style={{
                background: 'rgba(0, 255, 153, 0.2)',
                border: '2px solid #00ff99',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#00ffcc',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: (isCapturingScreenshot || screenshotCountdown !== null) ? 'wait' : 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                whiteSpace: 'nowrap',
                opacity: (isCapturingScreenshot || screenshotCountdown !== null) ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (isCapturingScreenshot || screenshotCountdown !== null) return
                e.target.style.background = 'rgba(0, 255, 153, 0.4)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                if (isCapturingScreenshot || screenshotCountdown !== null) return
                e.target.style.background = 'rgba(0, 255, 153, 0.2)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <FaCamera style={{ fontSize: '16px' }} />
              {isCapturingScreenshot ? 'Saving...' : 'Screenshot (S)'}
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
            <div
              aria-live="polite"
              role="status"
              style={{
                marginTop: '4px',
                fontSize: '12px',
                color: '#e8fff9',
                fontFamily: 'monospace',
                textAlign: 'right',
                minHeight: '18px',
              }}
            >
              {screenshotMessage}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#b3fff0',
                fontFamily: 'monospace',
                textAlign: 'right',
                lineHeight: 1.4,
              }}
            >
              Copyright 2025 by{' '}
              <a
                href="https://github.com/ktwu01/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ffff', textDecoration: 'none' }}
              >
                Koutian Wu
              </a>.
            </div>
          </div>
          {screenshotCountdown !== null && screenshotCountdown > 0 && (
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#00ffcc',
                fontSize: '64px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(0, 255, 204, 0.8)',
                pointerEvents: 'none',
                zIndex: 1500,
              }}
              aria-live="assertive"
            >
              {screenshotCountdown}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
