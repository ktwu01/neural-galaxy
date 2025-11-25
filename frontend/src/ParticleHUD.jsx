export function ParticleHUD({ particle, onClose }) {
  if (!particle) return null

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      background: 'rgba(0, 0, 0, 0.9)',
      border: `2px solid ${particle.color}`,
      borderRadius: '12px',
      padding: '24px',
      color: 'white',
      fontFamily: 'monospace',
      overflowY: 'auto',
      boxShadow: `0 0 30px ${particle.color}40`,
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)'
          e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)'
          e.target.style.transform = 'scale(1)'
        }}
      >
        ×
      </button>

      {/* Content */}
      <div>
        {/* Title */}
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          color: particle.color,
          borderBottom: `1px solid ${particle.color}40`,
          paddingBottom: '12px',
        }}>
          {particle.title}
        </h2>

        {/* Message text */}
        <div style={{
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '16px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}>
          {particle.text}
        </div>

        {/* Metadata */}
        <div style={{
          fontSize: '12px',
          opacity: 0.6,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '12px',
          marginTop: '16px',
        }}>
          <div>ID: {particle.id.slice(0, 8)}...</div>
          {particle.timestamp && (
            <div>
              Date: {new Date(particle.timestamp * 1000).toLocaleDateString()}
            </div>
          )}
          <div>
            Position: ({particle.x.toFixed(1)}, {particle.y.toFixed(1)}, {particle.z.toFixed(1)})
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '11px',
        opacity: 0.4,
      }}>
        Press ESC or click × to close
      </div>
    </div>
  )
}
