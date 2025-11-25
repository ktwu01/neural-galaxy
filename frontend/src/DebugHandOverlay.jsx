import { useEffect, useRef } from 'react'

export function DebugHandOverlay({ landmarks, status, gesture }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!landmarks) return

    // Draw Status/Gesture Text
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'
    ctx.font = '16px monospace'
    if (gesture) {
        const gestureName = gesture.categoryName || gesture
        ctx.fillText(`Gesture: ${gestureName}`, 10, 30)
        if (gesture.score !== undefined) {
            ctx.fillText(`Score: ${gesture.score.toFixed(2)}`, 10, 50)
        }
    }
    
    // Draw Connections (Skeleton)
    // MediaPipe Hand connections indices
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm
    ]

    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2

    // Draw lines
    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start]
      const endPoint = landmarks[end]
      if (startPoint && endPoint) {
        ctx.beginPath()
        ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height)
        ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height)
        ctx.stroke()
      }
    })

    // Draw points
    ctx.fillStyle = '#ff0000'
    landmarks.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

  }, [landmarks, gesture, status])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '320px', // Match internal resolution or scale
      height: '240px',
      pointerEvents: 'none',
      zIndex: 200,
      border: '1px solid rgba(0, 255, 0, 0.3)',
      background: 'rgba(0, 0, 0, 0.2)'
    }}>
        {/* Status Label */}
        <div style={{ 
            position: 'absolute', 
            top: 5, 
            right: 5, 
            color: status?.includes('Error') ? 'red' : '#0f0',
            fontSize: '12px',
            fontWeight: 'bold',
            background: 'rgba(0,0,0,0.7)',
            padding: '4px'
        }}>
            {status || 'Waiting...'}
        </div>
        
        <canvas 
            ref={canvasRef} 
            width={320} 
            height={240} 
            style={{ width: '100%', height: '100%' }}
        />
    </div>
  )
}

