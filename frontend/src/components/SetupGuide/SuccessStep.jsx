import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessStep = ({ onFinish }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <FaCheckCircle style={{ fontSize: '48px', color: '#00ff00', marginBottom: '20px' }} />
      <h2>Setup Complete!</h2>
      <p>Your personalized Neural Galaxy has been successfully created.</p>
      <p style={{ fontSize: '14px', opacity: 0.7 }}>Get ready to explore your intellectual journey.</p>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={onFinish}
          style={{
            padding: '10px 20px',
            background: '#00ffff',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Go to My Galaxy
        </button>
      </div>
    </div>
  );
};

export default SuccessStep;
