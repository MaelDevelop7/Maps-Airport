import { useState, useEffect } from "react";
import System from "../utils/System";
import type { Theme } from "../utils/System";

interface Props {
  onClose: () => void;
}

export default function SettingsMenu({ onClose }: Props) {
  const [theme, setTheme] = useState<Theme>("auto");

  // Initialiser le select avec le thème actuel
  useEffect(() => {
    setTheme(System.getTheme());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as Theme;
    setTheme(newTheme);
    System.applyTheme(newTheme);
  };

  return (
    <div id="settingsMenu">
      <div className="settings-card">
        <h2>Paramètres</h2>
        <select id="themeSelector" value={theme} onChange={handleChange}>
          <option value="auto">Automatique</option>
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}
