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
import { GESTURE_CONFIG } from './config'
import { FaStar, FaCodeBranch, FaLinkedin, FaTwitter, FaGithub, FaKeyboard } from 'react-icons/fa'
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      // Ignore shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

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
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedParticle, focusedParticle, showKeyboardHelp, isGestureMode])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }} role="application" aria-label="Neural Galaxy 3D Visualization">
      <Canvas camera={{ position: [0, 0, 200], fov: 60 }}>
        {/* Deep space background */}
        <color attach="background" args={['#000000']} />

        {/* Minimal lighting for depth perception */}
        <ambientLight intensity={0.3} />

        {/* The galaxy particle system */}
        <Galaxy
          ref={galaxyRef}
          onParticleClick={null}
          onFocusChange={setFocusedParticle}
          focusedParticle={focusedParticle}
          rotationSpeed={rotationSpeed}
          isGestureMode={isGestureMode}
          galaxyRotation={galaxyRotation}
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
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={50}
            maxDistance={500}
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

      {/* Help Button - Bottom Right */}
      <button
        onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard Shortcuts (H)"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 255, 255, 0.2)',
          border: '2px solid #00ffff',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00ffff',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(5px)',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 255, 255, 0.4)'
          e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 255, 255, 0.2)'
          e.target.style.transform = 'scale(1)'
        }}
      >
        <FaKeyboard />
      </button>
    </div>
  )
}

export default App
