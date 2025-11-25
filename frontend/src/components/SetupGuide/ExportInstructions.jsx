import React from 'react';

const ExportInstructions = ({ onNext, onPrevious }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Export Your Chat History</h2>
      <p style={{ marginBottom: '20px' }}>Follow these steps to export your chat data:</p>

      <div style={{ marginBottom: '25px', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '8px', padding: '15px' }}>
        <h3>For ChatGPT:</h3>
        <ol>
          <li style={{ marginBottom: '8px' }}>Go to Settings → Data controls → Export data.</li>
          <li style={{ marginBottom: '8px' }}>Wait for email with download link.</li>
          <li style={{ marginBottom: '8px' }}>Unzip the downloaded file.</li>
          <li>Import `conversations.json` inside the extracted folder to here.</li>
        </ol>
      </div>

      {/* <div style={{ marginBottom: '25px', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '8px', padding: '15px' }}>
        <h3>Generic JSON Format:</h3>
        <p>If your chat history is from another platform, ensure it's a JSON array of conversation objects.</p>
        <p>Required fields: `title`, `text`/`content`</p>
        <details style={{ marginTop: '10px', cursor: 'pointer' }}>
          <summary style={{ fontWeight: 'bold', color: '#00ffff' }}>Example structure</summary>
          <pre style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '5px', overflowX: 'auto', fontSize: '13px' }}>
            {`[
  {
    "title": "Conversation about AI",
    "text": "User: What is AI?\nBot: AI is Artificial Intelligence...",
    "timestamp": "2023-10-26T10:00:00Z"
  },
  {
    "title": "Project discussion",
    "content": "User: Let's discuss the project.\nBot: Sure, what are your ideas?",
    "id": "12345"
  }
]`}
          </pre>
        </details>
      </div> */}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
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
            marginRight: '15px',
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
          }}
        >
          Next: Import File
        </button>
      </div>
    </div>
  );
};

export default ExportInstructions;
