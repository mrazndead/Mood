import React, { useState, useMemo } from 'react';
import { MoodProvider, useMood } from './context/MoodContext';
import { MOODS } from './constants';
import LoggerScreen from './screens/LoggerScreen';
import DashboardScreen from './screens/DashboardScreen';
import Navigation from './components/Navigation';

// Inner component to access context
const AppContent: React.FC = () => {
  const [screen, setScreen] = useState<'logger' | 'dashboard'>('logger');
  const [moodIndex, setMoodIndex] = useState(2); // 'Okay' by default
  const { entries } = useMood();

  // Determine background gradient based on screen or most recent mood
  const bgGradient = useMemo(() => {
    if (screen === 'dashboard') return 'bg-dark-bg';
    
    // In Logger, use the selected mood (simulated here by default 'Okay' for now, 
    // ideally LoggerScreen lifts this state up, but keeping simple for this demo)
    // To make it dynamic based on the planet, we'd need to lift the index state from LoggerScreen.
    // For this MVP, we will stick to a beautiful generic gradient that shifts slightly or dark mode.
    
    return 'bg-gradient-to-br from-[#4c1d95] via-[#86198f] to-[#be185d]';
  }, [screen]);

  const handleLogComplete = () => {
    setScreen('dashboard');
  };

  return (
    <div className={`w-full h-screen max-w-md mx-auto relative overflow-hidden transition-colors duration-1000 ${bgGradient}`}>
        {/* Render Screen */}
        {screen === 'logger' && <LoggerScreen onLogComplete={handleLogComplete} />}
        {screen === 'dashboard' && <DashboardScreen />}

        {/* Navigation */}
        <Navigation 
            currentScreen={screen} 
            setScreen={setScreen} 
            onLogPress={() => setScreen('logger')} 
        />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MoodProvider>
      <AppContent />
    </MoodProvider>
  );
};

export default App;
