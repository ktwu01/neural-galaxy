import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function FocusHighlight({ particle, parentRotation }) {
  const spriteRef = useRef()
  const groupRef = useRef()

  // Create circle texture for highlight ring
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d', { alpha: true })

    // CRITICAL: Clear canvas to fully transparent
    ctx.clearRect(0, 0, 128, 128)

    // Draw hollow circle (ring)
    ctx.strokeStyle = particle.color
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.arc(64, 64, 50, 0, Math.PI * 2)
    ctx.stroke()

    // Add outer glow
    ctx.strokeStyle = particle.color + '60'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(64, 64, 58, 0, Math.PI * 2)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [particle.color])

  // Sync rotation with parent and add pulsing animation
  useFrame((state) => {
    if (groupRef.current && parentRotation) {
      groupRef.current.rotation.copy(parentRotation)
    }

    if (spriteRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15
      spriteRef.current.scale.set(scale * 8, scale * 8, 1)
    }
  })

  return (
    <group ref={groupRef}>
      <sprite
        ref={spriteRef}
        position={[particle.x, particle.y, particle.z]}
      >
        <spriteMaterial
          map={texture}
          transparent={true}
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}
