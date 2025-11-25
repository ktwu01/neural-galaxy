import React from 'react';
import { FileUpload } from '../../FileUpload'; // Adjust path as needed

const FileUploadStep = ({ onNext, onPrevious, onDataLoaded }) => {
  const handleDataLoaded = (data, fileName) => {
    // Potentially store data in context/state or pass it up
    onDataLoaded(data, fileName);
    onNext();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Import Your Chat Data</h2>
      <p style={{ marginBottom: '20px' }}>Select or drag your exported chat history file (e.g., `conversations.json`).</p>
      <FileUpload onDataLoaded={handleDataLoaded} onClose={onPrevious} /> {/* onClose here acts as a "back" or "cancel" */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
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
      </div>
    </div>
  );
};

export default FileUploadStep;
