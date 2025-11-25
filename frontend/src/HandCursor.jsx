import React from 'react'

export function HandCursor({ hand, position, gesture, visible }) {
  if (!visible) return null

  // Gesture-specific colors and sizes
  const getGestureStyle = () => {
    switch (gesture) {
      case 'GRAB':
        return { color: '#ff4444', size: 60, glow: '0 0 30px rgba(255, 68, 68, 0.8)' }
      case 'PALM_OPEN':
        return { color: '#44ff44', size: 80, glow: '0 0 40px rgba(68, 255, 68, 0.8)' }
      case 'PINCH':
        return { color: '#4444ff', size: 50, glow: '0 0 25px rgba(68, 68, 255, 0.8)' }
      case 'VICTORY':
        return { color: '#ff44ff', size: 70, glow: '0 0 35px rgba(255, 68, 255, 0.8)' }
      case 'PINCH_SCALE':
        return { color: '#ffaa00', size: 90, glow: '0 0 50px rgba(255, 170, 0, 0.9)' }
      default:
        return { color: '#00ffff', size: 40, glow: '0 0 20px rgba(0, 255, 255, 0.6)' }
    }
  }

  const style = getGestureStyle()

  return (
    <div
      className="hand-cursor"
      style={{
        position: 'absolute',
        // Mirror X coordinate (camera is mirrored)
        left: `${(1 - position.x) * 100}%`,
        top: `${position.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          width: `${style.size}px`,
          height: `${style.size}px`,
          borderRadius: '50%',
          border: `3px solid ${style.color}`,
          boxShadow: style.glow,
          animation: 'pulse 1.5s ease-in-out infinite',
          position: 'relative',
        }}
      >
        {/* Inner dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: style.color,
            boxShadow: `0 0 10px ${style.color}`,
          }}
        />
        
        {/* Hand label */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: style.color,
            fontSize: '12px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: `0 0 5px ${style.color}`,
            whiteSpace: 'nowrap',
          }}
        >
          {hand.toUpperCase()} • {gesture}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

