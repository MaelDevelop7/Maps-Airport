// --- Gestion des vues et thème ---

// Bouton "Entrer"
document.getElementById("enterBtn").addEventListener("click", () => {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("map").style.display = "block";
  document.getElementById("menu").style.display = "block";
});

// Bouton ouvrir réglages
document.getElementById("settingsBtn").addEventListener("click", () => {
  document.getElementById("settingsMenu").style.display = "flex";
});

// Bouton fermer réglages
document.getElementById("closeSettings").addEventListener("click", () => {
  document.getElementById("settingsMenu").style.display = "none";
});

// Gestion du thème
window.addEventListener("DOMContentLoaded", () => {
  const themeSelector = document.getElementById("themeSelector");
  const savedTheme = localStorage.getItem("theme") || "auto";
  themeSelector.value = savedTheme;
  applyTheme(savedTheme);

  themeSelector.addEventListener("change", (e) => {
    const theme = e.target.value;
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  });
});

function applyTheme(theme) {
  document.documentElement.classList.remove("dark-mode", "light-mode");
  if (theme === "dark") {
    document.documentElement.classList.add("dark-mode");
  } else if (theme === "light") {
    document.documentElement.classList.add("light-mode");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.add(prefersDark ? "dark-mode" : "light-mode");
  }
}

// --- Carte globale ---

const defaultCoords = [40.4168, -3.7038]; // Madrid
const defaultZoom = 5;

const globalMap = L.map("map").setView(defaultCoords, defaultZoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(globalMap);

// Marqueurs aéroports
const madridMarker = L.marker([40.4959, -3.5676]).addTo(globalMap);
const parisMarker = L.marker([49.0097, 2.5479]).addTo(globalMap);

madridMarker.bindPopup('<a href="#" class="openAirport" data-airport="mad">Madrid Airport (MAD)</a>');
parisMarker.bindPopup('<a href="#" class="openAirport" data-airport="cdg">Paris CDG Airport (CDG)</a>');

// Icône rouge utilisateur
const redIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
           <path fill="red" stroke="black" stroke-width="2" d="M12.5 0C7 0 3 4.5 3 10c0 7.5 9.5 30 9.5 30s9.5-22.5 9.5-30c0-5.5-4-10-9.5-10z"/>
           <circle fill="white" cx="12.5" cy="10" r="5"/>
         </svg>`,
  className: '',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Bouton recentrer sur position utilisateur
document.getElementById("recenterMap").addEventListener("click", (e) => {
  e.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        globalMap.setView(coords, 12);
        L.marker(coords, { icon: redIcon }).addTo(globalMap).bindPopup("Vous êtes ici").openPopup();
      },
      () => console.warn("Géolocalisation échouée")
    );
  } else {
    console.warn("Géolocalisation non supportée");
  }
});

// --- Carte plan aéroport ---

let planMap = null;
let zonesLayer = null;

// Fonction afficher plan aéroport
function showAirportPlan(imagePath, width, height) {
  // Cacher la carte globale et menu
  document.getElementById("map").style.display = "none";
  document.getElementById("menu").style.display = "none";
  // Afficher la div plan aéroport
  document.getElementById("airportPlan").style.display = "block";

  // Supprimer ancienne carte plan si existante
  if (planMap) {
    planMap.remove();
    planMap = null;
  }

  planMap = L.map("airportPlanMap", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 4,
  });

  const bounds = [[0, 0], [height, width]];
  L.imageOverlay(imagePath, bounds).addTo(planMap);
  planMap.fitBounds(bounds);

  // Créer le layerGroup pour zones (marqueurs)
  zonesLayer = L.layerGroup().addTo(planMap);

  // Charger zones depuis JSON (nom du fichier dépend de l'aéroport)
  const jsonPath = imagePath.replace(".png", ".json");
  fetch(jsonPath + "?v=" + Date.now())
    .then((res) => res.json())
    .then((zones) => {
      zones.forEach((zone) => {
        const marker = L.marker([zone.y, zone.x], { draggable: true });
        marker.bindPopup(zone.label);
        zonesLayer.addLayer(marker);
      });
    })
    .catch(() => console.warn(`Impossible de charger les zones depuis ${jsonPath}.`));
}

// Gestion clic dans popup aéroport
function attachPopupClick(marker, imagePath, width, height) {
  marker.on("popupopen", () => {
    const popupContent = marker.getPopup().getContent();
    const matches = popupContent.match(/data-airport="(\w+)"/);
    if (!matches) return;
    const airportCode = matches[1];
    const link = document.querySelector(`.openAirport[data-airport="${airportCode}"]`);
    if (link) {
      if (link._clickHandler) {
        link.removeEventListener("click", link._clickHandler);
      }
      link._clickHandler = (e) => {
        e.preventDefault();
        showAirportPlan(imagePath, width, height);
      };
      link.addEventListener("click", link._clickHandler);
    }
  });
}

attachPopupClick(madridMarker, "MAD.json", 1962, 1652);
attachPopupClick(parisMarker, "CDG.json", 2000, 2000);

// Bouton retour au plan global
document.getElementById("backBtn").addEventListener("click", () => {
  if (planMap) {
    planMap.remove();
    planMap = null;
  }
  document.getElementById("airportPlan").style.display = "none";
  document.getElementById("map").style.display = "block";
  document.getElementById("menu").style.display = "block";
});
