import React, { useState, useMemo } from 'react';
import { MoodProvider, useMood } from './context/MoodContext';
import { MOODS } from './constants';
import LoggerScreen from './screens/LoggerScreen';
import DashboardScreen from './screens/DashboardScreen';
import Navigation from './components/Navigation';

const AppContent: React.FC = () => {
  const [screen, setScreen] = useState<'logger' | 'dashboard'>('logger');
  const { entries } = useMood();

  const handleLogComplete = () => {
    setScreen('dashboard');
  };

  return (
    <div className={`w-full h-screen max-w-md mx-auto relative overflow-hidden bg-dark-bg`}>
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