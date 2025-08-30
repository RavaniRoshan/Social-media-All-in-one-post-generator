import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import Generator from './components/Generator';

declare const gsap: any;

function App() {
  const [view, setView] = useState<'landing' | 'generator'>('landing');
  const [initialPrompt, setInitialPrompt] = useState('');
  
  const landingPageRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGetStarted = (prompt: string) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setInitialPrompt(prompt);
    
    gsap.to(landingPageRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => {
        setView('generator');
      },
    });
  };

  useEffect(() => {
    if (view === 'generator' && generatorRef.current) {
      gsap.from(generatorRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          setIsAnimating(false);
        }
      });
    }
  }, [view]);

  return (
    <div className="antialiased">
      <div ref={landingPageRef} style={{ display: view === 'landing' ? 'block' : 'none' }}>
        <LandingPage onGetStarted={handleGetStarted} />
      </div>
      {view === 'generator' && (
        <div ref={generatorRef} style={{ opacity: 0 }}>
          <Generator initialPrompt={initialPrompt} />
        </div>
      )}
    </div>
  );
}

export default App;
