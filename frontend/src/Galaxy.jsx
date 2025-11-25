import { useEffect, useState, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FocusHighlight } from './FocusHighlight'

export function Galaxy({ onParticleClick, onFocusChange, focusedParticle, rotationSpeed = 0.005, isGestureMode = false, galaxyRotation = { x: 0, y: 0 } }) {
  const [galaxyData, setGalaxyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const pointsRef = useRef()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const lastCameraPosition = useRef(new THREE.Vector3())
  const { camera, gl } = useThree()

  // Configure raycaster for point cloud - increased threshold for better detection at distance
  raycaster.current.params.Points.threshold = 10

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

  // Handle click on canvas
  useEffect(() => {
    if (!galaxyData) return

    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update raycaster
      raycaster.current.setFromCamera(mouse.current, camera)

      // Check for intersections with points
      if (pointsRef.current) {
        const intersects = raycaster.current.intersectObject(pointsRef.current)

        if (intersects.length > 0) {
          const intersect = intersects[0]
          const index = intersect.index
          const clickedPoint = galaxyData[index]

          console.log(`🎯 Clicked particle ${index}:`, clickedPoint.title)

          if (onParticleClick) {
            onParticleClick(clickedPoint)
          }
        }
      }
    }

    gl.domElement.addEventListener('click', handleClick)
    return () => {
      gl.domElement.removeEventListener('click', handleClick)
    }
  }, [galaxyData, camera, gl, onParticleClick])

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
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    console.log('✅ Geometry and material created')
    return { geometry: geo, material: mat }
  }, [galaxyData, particleTexture])

  // Gentle rotation animation (controllable speed) + Auto-focus detection
  useFrame((state) => {
    if (pointsRef.current) {
      if (isGestureMode) {
        // In gesture mode: apply manual rotation from gestures
        pointsRef.current.rotation.x = galaxyRotation.x;
        pointsRef.current.rotation.y = galaxyRotation.y;
      } else {
        // In orbit mode: auto-rotate
        pointsRef.current.rotation.y = state.clock.getElapsedTime() * rotationSpeed;
      }
    }

    // Auto-focus: detect particle closest to screen center (only when camera moves)
    if (galaxyData && onFocusChange && pointsRef.current) {
      const time = state.clock.getElapsedTime()

      // Initialize lastCameraPosition on first frame
      if (!lastCameraPosition.current.x && !lastCameraPosition.current.y && !lastCameraPosition.current.z) {
        lastCameraPosition.current.copy(camera.position)
      }

      const cameraHasMoved = !lastCameraPosition.current.equals(camera.position)

      // Always detect focus on first load, then only on camera movement
      if (cameraHasMoved || time < 1) {
        lastCameraPosition.current.copy(camera.position)

        // Find the particle closest to screen center (not just first hit)
        // This allows focusing on interior particles, not just the outer shell
        
        let closestParticle = null
        let closestScreenDistance = Infinity
        
        // Project all particles to screen space and find the one closest to center
        const screenCenter = new THREE.Vector2(0, 0)
        const tempVec = new THREE.Vector3()
        const screenPos = new THREE.Vector2()
        
        for (let i = 0; i < galaxyData.length; i++) {
          // Get particle position in world space
          tempVec.set(galaxyData[i].x, galaxyData[i].y, galaxyData[i].z)
          
          // Transform to camera space to check if in front
          const particleInCameraSpace = tempVec.clone().applyMatrix4(camera.matrixWorldInverse)
          
          // Skip particles behind the camera
          if (particleInCameraSpace.z >= 0) continue
          
          // Project to screen space (normalized device coordinates)
          tempVec.project(camera)
          screenPos.set(tempVec.x, tempVec.y)
          
          // Calculate distance from screen center
          const distanceFromCenter = screenPos.distanceTo(screenCenter)
          
          // Only consider particles close to center (within a reasonable threshold)
          // This creates a "focus cone" rather than checking the entire screen
          if (distanceFromCenter < 0.1 && distanceFromCenter < closestScreenDistance) {
            closestScreenDistance = distanceFromCenter
            closestParticle = galaxyData[i]
          }
        }

        if (closestParticle) {
          onFocusChange(closestParticle)
        } else {
          // Fallback: if raycast fails, find closest particle to screen center in 3D space
          const centerPoint = new THREE.Vector3(0, 0, 0)
          camera.getWorldDirection(centerPoint)
          centerPoint.multiplyScalar(100).add(camera.position)

          let closestIndex = 0
          let closestDistance = Infinity

          const positions = pointsRef.current.geometry.attributes.position
          const tempVec = new THREE.Vector3()

          for (let i = 0; i < galaxyData.length; i++) {
            tempVec.set(
              positions.getX(i),
              positions.getY(i),
              positions.getZ(i)
            )
            tempVec.applyMatrix4(pointsRef.current.matrixWorld)

            const dist = tempVec.distanceTo(centerPoint)
            if (dist < closestDistance) {
              closestDistance = dist
              closestIndex = i
            }
          }

          onFocusChange(galaxyData[closestIndex])
        }
      }
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
    <>
      <points ref={pointsRef} geometry={geometry} material={material} />
      {focusedParticle && pointsRef.current && (
        <FocusHighlight
          particle={focusedParticle}
          parentRotation={pointsRef.current.rotation}
        />
      )}
    </>
  )
}
