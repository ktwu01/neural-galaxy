import { useState, useRef, useEffect } from 'react';

export function GestureInfoPanel({ isGestureMode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      const panelWidth = panelRef.current.offsetWidth;
      const panelHeight = panelRef.current.offsetHeight;
      setPosition({
        x: 100, // Initial top-left position
        y: 50, // Initial top-left position
      });
    }
  }, [isGestureMode]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);


  if (!isGestureMode) return null;

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        padding: '8px 10px', // Reduced padding
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '13px',
        zIndex: 1000,
        maxWidth: '150px', // Reduced width
        backdropFilter: 'blur(5px)',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)', // Added subtle box-shadow
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '5px',
          cursor: 'move',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
        onMouseDown={handleMouseDown}
      >
        &#x2630;
      </div>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '6px', // Reduced margin
        color: 'rgba(0, 255, 255, 0.7)', // Muted color
        borderBottom: 'none', // Removed border
        paddingBottom: '4px', // Reduced padding
      }}>
      Let's fly!
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
        {/* GRAB/PINCH - Forward */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>✊🤏</span>
          <div>
            <div style={{ fontWeight: 'bold', color: 'rgba(0, 255, 136, 0.7)' }}>GRAB / PINCH</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Fly Forward</div>
          </div>
        </div>

        {/* VICTORY - Backward */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>✌️</span>
          <div>
            <div style={{ fontWeight: 'bold', color: 'rgba(0, 255, 136, 0.7)' }}>VICTORY</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Fly Backward</div>
          </div>
        </div>

        {/* Two Hands - Zoom */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🤲</span>
          <div>
            <div style={{ fontWeight: 'bold', color: 'rgba(0, 255, 136, 0.7)' }}>TWO HANDS</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Pinch/Spread to Zoom</div>
          </div>
        </div>

        {/* Direction Control */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>👉</span>
          <div>
            <div style={{ fontWeight: 'bold', color: 'rgba(0, 255, 136, 0.7)' }}>DIRECTION</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Hand position steers (center = straight)</div>
          </div>
        </div>
      </div>

      {/* <div style={{
        marginTop: '6px', // Reduced margin
        paddingTop: '4px', // Reduced padding
        borderTop: '1px solid rgba(0, 255, 255, 0.1)', // Muted border
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'left',
      }}>
        Enable/disable features in Control Panel →
      </div> */}
    </div>
  );
}

