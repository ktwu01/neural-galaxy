import { useState } from 'react'

export function ControlPanel({ rotationSpeed, onRotationSpeedChange, flySpeed, onFlySpeedChange, isGestureMode, onToggleGestureMode, enableTwoHandRotation, onToggleTwoHandRotation, enableHeadTracking, onToggleHeadTracking, edgeThreshold, onEdgeThresholdChange, boundaryDistance, onBoundaryDistanceChange }) {
  const [isExpanded, setIsExpanded] = useState(true) // Start expanded by default


  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
      }}
    >
      {/* Settings Icon / Toggle, always visible and clickable */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'pointer',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '16px',
          lineHeight: '1',
          zIndex: 101, // Above the panel content
        }}
        title={isExpanded ? 'Close Settings' : 'Open Settings'}
      >
        {isExpanded ? '❌' : '⚙️'}
      </div>

      {/* Panel Content, visibility is toggled */}
      <div
        style={{
          width: '150px',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '8px 10px',
          fontFamily: 'monospace',
          color: 'white',
          boxShadow: '0 0 10px rgba(100, 150, 255, 0.1)',
          transition: 'opacity 0.3s ease',
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '14px',
          fontWeight: 'bold',
          borderBottom: 'none',
          paddingBottom: '5px',
          color: 'rgba(100, 150, 255, 0.8)',
        }}>
          Settings
        </h3>

        {/* Control Mode Button */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            marginBottom: '5px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}>
            Control Mode
          </label>
          <button
            onClick={onToggleGestureMode}
            style={{
              width: '100%',
              padding: '6px',
              background: isGestureMode ? 'rgba(100, 255, 100, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isGestureMode ? '1px solid rgba(100, 255, 100, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              color: isGestureMode ? '#aaffaa' : 'white',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'all 0.2s ease',
            }}
          >
            {isGestureMode ? '👋 Hands' : '🖱️ Mouse'}
          </button>
          <div style={{ fontSize: '9px', marginTop: '3px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {isGestureMode ? 'Move hands to fly & zoom' : 'Drag to rotate, scroll to zoom'}
          </div>
        </div>

        {/* Fly Speed Slider (only show in gesture mode) */}
        {isGestureMode && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              marginBottom: '5px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Fly Speed
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={flySpeed}
              onChange={(e) => onFlySpeedChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '3px',
                borderRadius: '1.5px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9px',
              marginTop: '3px',
              color: 'rgba(255, 255, 255, 0.4)'
            }}>
              <span>Slow</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{flySpeed} units/s</span>
              <span>Fast</span>
            </div>
          </div>
        )}

        {/* Boundary Distance Slider (only show in gesture mode) */}
        {isGestureMode && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              marginBottom: '5px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Boundary Distance
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={boundaryDistance}
              onChange={(e) => onBoundaryDistanceChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#00ffff',
                height: '3px',
                borderRadius: '1.5px',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9px',
              color: 'rgba(255, 255, 255, 0.4)',
              marginTop: '3px',
            }}>
              <span>Close</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{boundaryDistance} units</span>
              <span>Far</span>
            </div>
            <div style={{ fontSize: '9px', marginTop: '3px', color: 'rgba(255, 255, 255, 0.3)' }}>
              How far you can fly before bouncing back
            </div>
          </div>
        )}

        {/* Two-Hand Rotation Toggle (only show in gesture mode) */}
        {isGestureMode && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              marginBottom: '5px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Two-Hand Rotation
            </label>
            <button
              onClick={onToggleTwoHandRotation}
              style={{
                width: '100%',
                padding: '6px',
                background: enableTwoHandRotation ? 'rgba(100, 255, 100, 0.15)' : 'rgba(255, 100, 100, 0.15)',
                border: enableTwoHandRotation ? '1px solid rgba(100, 255, 100, 0.15)' : '1px solid rgba(255, 100, 100, 0.1)',
                borderRadius: '4px',
                color: enableTwoHandRotation ? '#aaffaa' : '#ffaaaa',
                cursor: 'pointer',
                fontSize: '11px',
                transition: 'all 0.2s ease',
              }}
            >
              {enableTwoHandRotation ? '✅ Enabled' : '❌ Disabled'}
            </button>
            <div style={{ fontSize: '9px', marginTop: '3px', color: 'rgba(255, 255, 255, 0.4)' }}>
              {enableTwoHandRotation ? 'GRAB gesture rotates galaxy' : 'GRAB gesture disabled'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

