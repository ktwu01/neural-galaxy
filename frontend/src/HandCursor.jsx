import React, { useEffect, useRef } from 'react'
import { HAND_CONNECTIONS } from '@mediapipe/hands'

export function HandCursor({ hand, position, gesture, visible, landmarks }) {
  if (!visible || !landmarks) return null
  
  const canvasRef = useRef(null)

  // Gesture-specific colors
  const getGestureColor = () => {
    switch (gesture) {
      case 'GRAB': return '#ff4444'
      case 'PALM_OPEN': return '#44ff44'
      case 'PINCH': return '#4444ff'
      case 'VICTORY': return '#ff44ff'
      case 'PINCH_SCALE': return '#ffaa00'
      default: return '#00ffff'
    }
  }

  const color = getGestureColor()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !landmarks) return

    const ctx = canvas.getContext('2d')
    const width = window.innerWidth
    const height = window.innerHeight
    
    canvas.width = width
    canvas.height = height
    
    ctx.clearRect(0, 0, width, height)

    // Scale factor to make hands smaller (0.5 = 50% size)
    const scale = 0.5
    const centerX = width / 2
    const centerY = height / 2
    
    // Helper to scale coordinates toward center
    const scalePoint = (point) => ({
      x: centerX + ((1 - point.x) * width - centerX) * scale,
      y: centerY + (point.y * height - centerY) * scale
    })
    
    // Draw connections (lines between landmarks)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.shadowBlur = 10
    ctx.shadowColor = color
    
    HAND_CONNECTIONS.forEach(([start, end]) => {
      const startScaled = scalePoint(landmarks[start])
      const endScaled = scalePoint(landmarks[end])
      
      ctx.beginPath()
      ctx.moveTo(startScaled.x, startScaled.y)
      ctx.lineTo(endScaled.x, endScaled.y)
      ctx.stroke()
    })

    // Draw landmark points
    ctx.fillStyle = color
    ctx.shadowBlur = 8
    landmarks.forEach((point) => {
      const scaled = scalePoint(point)
      ctx.beginPath()
      ctx.arc(scaled.x, scaled.y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw label at wrist position (landmark 0)
    const wristScaled = scalePoint(landmarks[0])
    ctx.shadowBlur = 5
    ctx.fillStyle = color
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(
      `${hand.toUpperCase()} • ${gesture}`,
      wristScaled.x,
      wristScaled.y - 15
    )
  }, [landmarks, color, hand, gesture])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  )
}

