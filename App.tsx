import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Generator from './components/Generator';

function App() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');

  const handleGetStarted = (prompt: string) => {
    setInitialPrompt(prompt);
    setShowGenerator(true);
  };

  return (
    <div className="antialiased">
      {showGenerator ? (
        <Generator initialPrompt={initialPrompt} />
      ) : (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
    </div>
  );
}

export default App;
