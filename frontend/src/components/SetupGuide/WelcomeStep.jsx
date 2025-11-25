import React from 'react';

const WelcomeStep = ({ onNext, onSkip }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Welcome to Neural Galaxy</h2>
      <p>Discover your intellectual journey in 3D!</p>
      <p>Import your chat history to create a personalized galaxy.</p>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={onNext}
          style={{
            padding: '10px 20px',
            background: '#00ffff',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '15px',
          }}
        >
          Start Setup
        </button>
        <button
          onClick={onSkip}
          style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;
