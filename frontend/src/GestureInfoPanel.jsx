export function GestureInfoPanel({ isGestureMode }) {
  if (!isGestureMode) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '8px',
      padding: '15px 20px',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '13px',
      zIndex: 1000,
      maxWidth: '300px',
      backdropFilter: 'blur(5px)',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#00ffff',
        borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
        paddingBottom: '8px',
      }}>
        ✋ Gesture Controls
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
        {/* GRAB/PINCH - Forward */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>✊🤏</span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#00ff88' }}>GRAB / PINCH</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Fly Forward</div>
          </div>
        </div>

        {/* VICTORY - Backward */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>✌️</span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#00ff88' }}>VICTORY</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Fly Backward</div>
          </div>
        </div>

        {/* Two Hands - Zoom */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🤲</span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#00ff88' }}>TWO HANDS</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Pinch/Spread to Zoom</div>
          </div>
        </div>

        {/* Direction Control */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>👉</span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#00ff88' }}>DIRECTION</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Hand position steers (center = straight)</div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '12px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(0, 255, 255, 0.2)',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'left',
      }}>
        Enable/disable features in Control Panel →
      </div>
    </div>
  );
}


