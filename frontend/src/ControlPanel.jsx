import { useState } from 'react'
import { FaCog, FaTimes, FaHands, FaMousePointer, FaCheck, FaBan } from 'react-icons/fa'

export function ControlPanel({ rotationSpeed, onRotationSpeedChange, flySpeed, onFlySpeedChange, isGestureMode, onToggleGestureMode, enableTwoHandRotation, onToggleTwoHandRotation, enableHeadTracking, onToggleHeadTracking, edgeThreshold, onEdgeThresholdChange, boundaryDistance, onBoundaryDistanceChange }) {
  const [isExpanded, setIsExpanded] = useState(false) // Start folded by default


  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Settings Icon / Toggle, always visible and clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Close Settings' : 'Open Settings'}
        aria-expanded={isExpanded}
        style={{
          cursor: 'pointer',
          color: '#00ffff',
          fontSize: '24px',
          lineHeight: '1',
          zIndex: 101,
          background: 'none',
          border: 'none',
          padding: '0',
          transition: 'opacity 0.2s, transform 0.2s',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '0.7'
          e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '1'
          e.target.style.transform = 'scale(1)'
        }}
        onFocus={(e) => {
          e.target.style.outline = '2px solid #00ffff'
          e.target.style.outlineOffset = '4px'
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none'
        }}
      >
        {isExpanded ? <FaTimes /> : <FaCog />}
      </button>

      {/* Panel Content, visibility is toggled */}
      <div
        style={{
          position: 'absolute',
          top: '35px',
          right: '0px',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '8px 10px',
          fontFamily: 'monospace',
          color: 'white',
          boxShadow: '0 0 10px rgba(100, 150, 255, 0.1)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
          pointerEvents: isExpanded ? 'auto' : 'none',
          width: '150px',
          visibility: isExpanded ? 'visible' : 'hidden'
        }}
      >
        <div style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s 0.1s ease-in' }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            borderBottom: 'none',
            paddingBottom: '5px',
            color: '#00ffff', // Highlighted color
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
            aria-label={`Control mode: ${isGestureMode ? 'Hands' : 'Mouse'}. Click to toggle`}
            aria-pressed={isGestureMode}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #00ffff'
              e.target.style.outlineOffset = '2px'
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none'
            }}
          >
            {isGestureMode ? <><FaHands /> Hands</> : <><FaMousePointer /> Mouse</>}
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
              aria-label={`Fly speed: ${flySpeed} units per second`}
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
              aria-label={`Boundary distance: ${boundaryDistance} units`}
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
              aria-label={`Two-hand rotation: ${enableTwoHandRotation ? 'Enabled' : 'Disabled'}. Click to toggle`}
              aria-pressed={enableTwoHandRotation}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.outline = '2px solid #00ffff'
                e.target.style.outlineOffset = '2px'
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none'
              }}
            >
              {enableTwoHandRotation ? <><FaCheck /> Enabled</> : <><FaBan /> Disabled</>}
            </button>
            <div style={{ fontSize: '9px', marginTop: '3px', color: 'rgba(255, 255, 255, 0.4)' }}>
              {enableTwoHandRotation ? 'GRAB gesture rotates galaxy' : 'GRAB gesture disabled'}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}



