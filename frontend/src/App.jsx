import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Galaxy } from './Galaxy'
import { ParticleHUD } from './ParticleHUD'
import { FocusPanel } from './FocusPanel'
import { ControlPanel } from './ControlPanel'
import { GestureController } from './GestureController'
import { DebugHandOverlay } from './DebugHandOverlay'
import { HandCursor } from './HandCursor'
import './App.css'

function App() {
  const [selectedParticle, setSelectedParticle] = useState(null)
  const [focusedParticle, setFocusedParticle] = useState(null)
  const [rotationSpeed, setRotationSpeed] = useState(0.005)
  const [isGestureMode, setIsGestureMode] = useState(true)
  const [flySpeed, setFlySpeed] = useState(90) // Base fly speed (3x from 30)
  const [enableTwoHandRotation, setEnableTwoHandRotation] = useState(false) // Disabled by default
  
  // Debug State for Gesture Mode
  const [debugData, setDebugData] = useState({ landmarks: null, gesture: null, status: null })
  
  // Galaxy rotation controlled by gestures
  const [galaxyRotation, setGalaxyRotation] = useState({ x: 0, y: 0 })
  
  // Hand UI state
  const [handsUI, setHandsUI] = useState({
    left: { visible: false, position: null, gesture: 'IDLE' },
    right: { visible: false, position: null, gesture: 'IDLE' }
  })




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
      </Canvas>
      
      {/* Debug Overlay for Gesture Mode */}
      {isGestureMode && (
          <DebugHandOverlay 
            leftHand={debugData.leftHand}
            rightHand={debugData.rightHand}
            status={debugData.status}
            gesture={debugData.gesture}
          />
      )}

      {/* UI Overlay - Instructions */}
      {!selectedParticle && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '14px',
          pointerEvents: 'none',
          textShadow: '0 0 4px rgba(0,0,0,0.8)'
        }}>
          <div>🌌 Neural Galaxy</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>
            Drag to rotate | Scroll to zoom | Press K to open
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

      {/* Control Panel (right side) */}
      <ControlPanel
        rotationSpeed={rotationSpeed}
        onRotationSpeedChange={setRotationSpeed}
        flySpeed={flySpeed}
        onFlySpeedChange={setFlySpeed}
        isGestureMode={isGestureMode}
        onToggleGestureMode={() => setIsGestureMode(!isGestureMode)}
        enableTwoHandRotation={enableTwoHandRotation}
        onToggleTwoHandRotation={() => setEnableTwoHandRotation(!enableTwoHandRotation)}
      />

      {/* Debug Overlay for Gesture Mode */}
      {isGestureMode && (
          <DebugHandOverlay 
            leftHand={debugData.leftHand}
            rightHand={debugData.rightHand}
            status={debugData.status}
            gesture={debugData.gesture}
          />
      )}

      {/* Hand Cursors (Visual Feedback) */}
      {isGestureMode && (
        <>
          <HandCursor 
            hand="left"
            position={handsUI.left.position}
            gesture={handsUI.left.gesture}
            visible={handsUI.left.visible}
          />
          <HandCursor 
            hand="right"
            position={handsUI.right.position}
            gesture={handsUI.right.gesture}
            visible={handsUI.right.visible}
          />
        </>
      )}
    </div>
  )
}

export default App
