export function FocusPanel({ particle }) {
  if (!particle) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Focused particle information"
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: '300px',
        maxWidth: '500px',
        background: 'rgba(0, 0, 0, 0.85)',
        border: `2px solid ${particle.color}`,
        borderRadius: '8px',
        padding: '12px 16px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '13px',
        boxShadow: `0 0 20px ${particle.color}40`,
        backdropFilter: 'blur(8px)',
        pointerEvents: 'none',
        zIndex: 100,
      }}>
      {/* Title */}
      <div style={{
        fontSize: '15px',
        fontWeight: 'bold',
        color: particle.color,
        marginBottom: '6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {particle.title}
      </div>

      {/* Preview text */}
      <div style={{
        fontSize: '12px',
        opacity: 0.8,
        lineHeight: '1.4',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {particle.text.substring(0, 80)}...
      </div>

      {/* Hint */}
      <div style={{
        marginTop: '8px',
        fontSize: '10px',
        opacity: 0.4,
        textAlign: 'center',
      }}>
        Press K to view full message
      </div>
    </div>
  )
}
