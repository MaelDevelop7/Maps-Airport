import { useState, useEffect } from 'react';
import HomeScreen from './pages/Home';
import SettingsMenu from './components/SettingsMenu';
import MapView from './components/MapView';
import AirportPlan from './components/AirportPlan';
import 'leaflet/dist/leaflet.css';
import System from './utils/System';
import type { Theme } from './utils/System';
import './index.css';

type View = 'home' | 'map' | 'airportPlan';

function App() {
  const [view, setView] = useState<View>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => System.getTheme());
  const [selectedAirportCode, setSelectedAirportCode] = useState<string | null>(null);

  // Initialisation du système de thème
  useEffect(() => {
    System.init();
  }, []);

  // Application du thème à chaque mise à jour
  useEffect(() => {
    System.applyTheme(theme);
  }, [theme]);

  // Gestion de la navigation vers un aéroport
  const handleOpenAirportPlan = (code: string) => {
    setSelectedAirportCode(code.toLowerCase());
    setView('airportPlan');
  };

  return (
    <>
      {view === 'home' && (
        <HomeScreen
          onEnter={() => setView('map')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {showSettings && (
        <SettingsMenu
          onClose={() => setShowSettings(false)}
          onChangeTheme={(value) => setTheme(value)}
        />
      )}

      {view === 'map' && (
        <MapView
          onBackHome={() => setView('home')}
          onOpenAirportPlan={handleOpenAirportPlan}
        />
      )}

      {view === 'airportPlan' && selectedAirportCode && (
        <AirportPlan
          airportCode={selectedAirportCode}
          onBack={() => setView('map')}
        />
      )}
    </>
  );
}

export default App;
