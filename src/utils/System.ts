export type Theme = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'maps-airport-theme';

export default class System {
  private static theme: Theme = 'auto';

  static init() {
    // Charge le thème stocké ou auto par défaut
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      this.theme = storedTheme;
    }
    this.applyTheme(this.theme);
    this.listenPrefersColorScheme();
  }

  static applyTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);

    const root = document.documentElement;

    if (theme === 'auto') {
      root.classList.remove('light-mode', 'dark-mode');
      this.updateSystemTheme();
    } else {
      root.classList.remove('light-mode', 'dark-mode');
      root.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
    }
  }

  private static listenPrefersColorScheme() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      if (this.theme === 'auto') {
        this.updateSystemTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  private static updateSystemTheme(prefers?: 'light' | 'dark') {
    const root = document.documentElement;
  
    const darkPreferred = prefers !== undefined 
      ? prefers === 'dark' 
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    root.classList.toggle('dark-mode', darkPreferred);
    root.classList.toggle('light-mode', !darkPreferred);
  }

  static getTheme(): Theme {
    return this.theme;
  }
}
