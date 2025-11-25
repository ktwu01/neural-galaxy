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
import { FaStar, FaCodeBranch, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa'
import './App.css'

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


  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      // ESC: close HUD
      if (e.key === 'Escape' && selectedParticle) {
        setSelectedParticle(null)
      }
      // K: open focused particle in HUD
      if (e.key === 'k' || e.key === 'K') {
        if (focusedParticle) {
          setSelectedParticle(focusedParticle)
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedParticle, focusedParticle])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
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
          <div style={{ fontSize: '24px', fontWeight: 'bold', textShadow: '0 0 10px #00ffff' }}>Neural Galaxy</div>
          {/* GitHub Repo Links */}
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px', fontSize: '24px' }}>
            <a href="https://github.com/ktwu01/neural-galaxy" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff', textDecoration: 'none' }}><FaStar /></a>
            <a href="https://github.com/ktwu01/neural-galaxy/fork" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff', textDecoration: 'none' }}><FaCodeBranch /></a>
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
        <div style={{ display: 'flex', gap: '8px', fontSize: '24px' }}>
          <a href="https://www.linkedin.com/in/ktwu01/" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff', textDecoration: 'none', pointerEvents: 'auto' }}><FaLinkedin /></a>
          <a href="https://x.com/ktwu01" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff', textDecoration: 'none', pointerEvents: 'auto' }}><FaTwitter /></a>
          <a href="https://github.com/ktwu01/" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff', textDecoration: 'none', pointerEvents: 'auto' }}><FaGithub /></a>
        </div>
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
    </div>
  )
}

export default App
