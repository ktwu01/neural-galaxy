import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Galaxy } from './Galaxy'
import './App.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 200], fov: 60 }}>
        {/* Deep space background */}
        <color attach="background" args={['#000000']} />

        {/* Minimal lighting for depth perception */}
        <ambientLight intensity={0.3} />

        {/* The galaxy particle system */}
        <Galaxy />

        {/* Camera controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          minDistance={50}
          maxDistance={500}
        />
      </Canvas>

      {/* UI Overlay */}
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
          Drag to rotate | Scroll to zoom
        </div>
      </div>
    </div>
  )
}

export default App
