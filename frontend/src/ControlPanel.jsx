import { useState } from 'react'

export function ControlPanel({ rotationSpeed, onRotationSpeedChange, flySpeed, onFlySpeedChange, isGestureMode, onToggleGestureMode, enableTwoHandRotation, onToggleTwoHandRotation }) {
  const [isExpanded, setIsExpanded] = useState(false)


  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      right: isExpanded ? '0' : '-280px',
      transform: 'translateY(-50%)',
      width: '320px',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRight: 'none',
      borderRadius: '12px 0 0 12px',
      padding: '20px',
      fontFamily: 'monospace',
      color: 'white',
      transition: 'right 0.3s ease',
      zIndex: 100,
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Close Settings' : 'Open Settings'}
        style={{
          position: 'absolute',
          left: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '80px',
          background: 'rgba(100, 100, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(100, 150, 255, 0.6)',
          borderRight: 'none',
          borderRadius: '12px 0 0 12px',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: '0 0 15px rgba(100, 150, 255, 0.4), inset 0 0 10px rgba(100, 150, 255, 0.2)',
          padding: '0',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(100, 150, 255, 0.5)'
          e.target.style.boxShadow = '0 0 25px rgba(100, 150, 255, 0.7), inset 0 0 15px rgba(100, 150, 255, 0.3)'
          e.target.style.borderColor = 'rgba(150, 200, 255, 0.9)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(100, 100, 255, 0.3)'
          e.target.style.boxShadow = '0 0 15px rgba(100, 150, 255, 0.4), inset 0 0 10px rgba(100, 150, 255, 0.2)'
          e.target.style.borderColor = 'rgba(100, 150, 255, 0.6)'
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
          <path d="M18.36 5.64l-4.24 4.24m-4.24 4.24l-4.24 4.24m12.72 0l-4.24-4.24m-4.24-4.24L5.64 5.64" />
        </svg>
      </button>

      {/* Panel Content */}
      <div style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '16px',
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '10px',
        }}>
          ⚙️ Controls
        </h3>

        {/* Rotation Speed Slider */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            Control Mode
          </label>
          <button
            onClick={onToggleGestureMode}
            style={{
              width: '100%',
              padding: '8px',
              background: isGestureMode ? 'rgba(100, 255, 100, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: isGestureMode ? '1px solid rgba(100, 255, 100, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: isGestureMode ? '#aaffaa' : 'white',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease',
            }}
          >
            {isGestureMode ? '👋 Hands (Gesture)' : '🖱️ Mouse (Orbit)'}
          </button>
          <div style={{ fontSize: '10px', marginTop: '4px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {isGestureMode ? 'Move hands to fly & zoom' : 'Drag to rotate, scroll to zoom'}
          </div>
        </div>

        {/* Rotation Speed Slider */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            Rotation Speed
          </label>
          <input
            type="range"
            min="0"
            max="0.02"
            step="0.001"
            value={rotationSpeed}
            onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            marginTop: '4px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>
            <span>Stop</span>
            <span style={{ color: 'white' }}>{rotationSpeed.toFixed(3)}</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Fly Speed Slider (only show in gesture mode) */}
        {isGestureMode && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
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
                height: '4px',
                borderRadius: '2px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              marginTop: '4px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              <span>Slow</span>
              <span style={{ color: 'white' }}>{flySpeed} units/s</span>
              <span>Fast</span>
            </div>
          </div>
        )}

        {/* Two-Hand Rotation Toggle (only show in gesture mode) */}
        {isGestureMode && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              Two-Hand Rotation
            </label>
            <button
              onClick={onToggleTwoHandRotation}
              style={{
                width: '100%',
                padding: '8px',
                background: enableTwoHandRotation ? 'rgba(100, 255, 100, 0.2)' : 'rgba(255, 100, 100, 0.2)',
                border: enableTwoHandRotation ? '1px solid rgba(100, 255, 100, 0.5)' : '1px solid rgba(255, 100, 100, 0.5)',
                borderRadius: '4px',
                color: enableTwoHandRotation ? '#aaffaa' : '#ffaaaa',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              {enableTwoHandRotation ? '✅ Enabled' : '❌ Disabled'}
            </button>
            <div style={{ fontSize: '10px', marginTop: '4px', color: 'rgba(255, 255, 255, 0.5)' }}>
              {enableTwoHandRotation ? 'GRAB gesture rotates galaxy' : 'GRAB gesture disabled'}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.5)',
          lineHeight: '1.6',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Galaxy Info:</strong>
          </div>
          <div>• 488 particles</div>
          <div>• 5 semantic clusters</div>
          <div>• UMAP projection (3D)</div>
        </div>

        {/* Advanced Settings Placeholder */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.5)',
        }}>
          <div style={{ marginBottom: '6px', color: 'rgba(255, 255, 255, 0.7)' }}>
            ⚠️ Advanced Settings
          </div>
          <div style={{ fontSize: '10px' }}>
            Cluster tightness and particle separation adjustments require rebuilding the galaxy data. 
            These controls will be added in a future update.
          </div>
        </div>
      </div>
    </div>
  )
}

