// Appliquer le thème au chargement (localStorage ou préférence système)
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "auto";
  const themeSelector = document.getElementById("themeSelector");

  themeSelector.value = savedTheme;

  applyTheme(savedTheme);

  // Écouter le changement de préférence système si mode auto
  if (savedTheme === "auto") {
    listenSystemThemeChange();
  }
});

function applyTheme(theme) {
  document.documentElement.classList.remove("dark-mode", "light-mode");

  if (theme === "auto") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }
  } else if (theme === "dark") {
    document.documentElement.classList.add("dark-mode");
  } else {
    document.documentElement.classList.add("light-mode");
  }
}

function listenSystemThemeChange() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Supprimer un ancien listener éventuel avant d'en ajouter un nouveau
  if (window.systemThemeListener) {
    mediaQuery.removeEventListener("change", window.systemThemeListener);
  }

  window.systemThemeListener = (e) => {
    applyTheme("auto");
  };

  mediaQuery.addEventListener("change", window.systemThemeListener);
}

// Gestion du changement par l'utilisateur
document.getElementById("themeSelector").addEventListener("change", (e) => {
  const newTheme = e.target.value;
  localStorage.setItem("theme", newTheme);

  if (newTheme === "auto") {
    listenSystemThemeChange();
  } else {
    // Si on quitte le mode auto, on retire le listener
    if (window.systemThemeListener) {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", window.systemThemeListener);
      window.systemThemeListener = null;
    }
  }

  applyTheme(newTheme);
});