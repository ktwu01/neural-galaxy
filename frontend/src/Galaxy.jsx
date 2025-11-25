import { useEffect, useState, useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export function Galaxy() {
  const [galaxyData, setGalaxyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const pointsRef = useRef()

  // Load galaxy data
  useEffect(() => {
    fetch('/galaxy_data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log(`✅ Loaded ${data.length} galaxy points`)
        setGalaxyData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ Failed to load galaxy data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Create particle texture (circle sprite)
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    // Create radial gradient for glow effect
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  // Create particle geometry and materials
  const { geometry, material } = useMemo(() => {
    if (!galaxyData) return { geometry: null, material: null }

    const count = galaxyData.length
    console.log(`🎨 Creating geometry for ${count} particles`)

    // Create buffer geometry
    const geo = new THREE.BufferGeometry()

    // Position array (x, y, z for each point)
    const positions = new Float32Array(count * 3)
    // Color array (r, g, b for each point)
    const colors = new Float32Array(count * 3)

    // Helper to convert hex color to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 1, g: 1, b: 1 }
    }

    // Fill arrays
    galaxyData.forEach((point, i) => {
      const i3 = i * 3

      // Positions
      positions[i3] = point.x
      positions[i3 + 1] = point.y
      positions[i3 + 2] = point.z

      // Colors
      const rgb = hexToRgb(point.color)
      colors[i3] = rgb.r
      colors[i3 + 1] = rgb.g
      colors[i3 + 2] = rgb.b
    })

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Create point material with texture
    const mat = new THREE.PointsMaterial({
      size: 3.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      map: particleTexture,
      blending: THREE.AdditiveBlending, // Makes particles glow
      depthWrite: false, // Prevents rendering artifacts
    })

    console.log('✅ Geometry and material created')
    return { geometry: geo, material: mat }
  }, [galaxyData, particleTexture])

  // Gentle rotation animation
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="yellow" wireframe />
      </mesh>
    )
  }

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>
    )
  }

  if (!geometry || !material) return null

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  )
}
