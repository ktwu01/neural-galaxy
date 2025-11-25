import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const ProcessingStep = ({ onNext, onPrevious }) => {
  // In a real application, this step would trigger the actual data processing
  // and then call onNext when complete.
  // For now, we'll simulate a delay or just allow manual progression.

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <FaSpinner style={{ fontSize: '48px', color: '#00ffff', animation: 'spin 1.5s linear infinite', marginBottom: '20px' }} />
      <h2>Processing Your Galaxy Data...</h2>
      <p>Please wait while we generate your personalized Neural Galaxy.</p>
      <p style={{ fontSize: '14px', opacity: 0.7 }}>This might take a few moments depending on the size of your data.</p>
      {/* For demonstration, provide a way to manually advance */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '15px' }}>
        <button
          onClick={onPrevious}
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
          Back
        </button>
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
          }}
        >
          Skip Processing (Debug)
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingStep;
