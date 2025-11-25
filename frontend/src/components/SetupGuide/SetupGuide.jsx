import React, { useState } from 'react';
import WelcomeStep from './WelcomeStep';
import ExportInstructions from './ExportInstructions';
import FileUploadStep from './FileUploadStep';
import ProcessingStep from './ProcessingStep';
import SuccessStep from './SuccessStep';

const SetupGuide = ({ onSetupComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [importedData, setImportedData] = useState(null);
  const [fileName, setFileName] = useState('');

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleDataLoaded = (data, name) => {
    setImportedData(data);
    setFileName(name);
    goToNextStep(); // Move to processing step
  };

  const handleSkipSetup = () => {
    // Logic to skip setup, potentially load demo data or just proceed to main app
    console.log("Setup skipped.");
    onSetupComplete(null); // Indicate no custom data
  };

  const handleFinishSetup = () => {
    console.log("Setup finished. Data:", importedData, "File:", fileName);
    onSetupComplete(importedData); // Pass the imported data to the parent (App.jsx)
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={goToNextStep} onSkip={handleSkipSetup} />;
      case 1:
        return <ExportInstructions onNext={goToNextStep} onPrevious={goToPreviousStep} />;
      case 2:
        return <FileUploadStep onNext={goToNextStep} onPrevious={goToPreviousStep} onDataLoaded={handleDataLoaded} />;
      case 3:
        return <ProcessingStep onNext={goToNextStep} onPrevious={goToPreviousStep} />;
      case 4:
        return <SuccessStep onFinish={handleFinishSetup} />;
      default:
        return <WelcomeStep onNext={goToNextStep} onSkip={handleSkipSetup} />;
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="setup-guide-title"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #00ffff',
        borderRadius: '12px',
        padding: '32px',
        color: 'white',
        fontFamily: 'monospace',
        zIndex: 2000,
        maxWidth: '700px',
        width: '90%',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px', // Ensure it has a decent height
      }}
    >
      <h1 id="setup-guide-title" style={{ margin: '0 0 20px 0', color: '#00ffff', fontSize: '24px' }}>
        Neural Galaxy Setup
      </h1>
      <div style={{
        marginBottom: '20px',
        fontSize: '16px',
        color: '#00ffff',
        borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
        paddingBottom: '10px',
        width: '100%',
        textAlign: 'center',
      }}>
        Step {currentStep + 1} of 5
      </div>
      <div style={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {renderStep()}
      </div>
    </div>
  );
};

export default SetupGuide;