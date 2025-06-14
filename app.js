// Coordonnées par défaut sur Madrid
const defaultCoords = [40.4168, -3.7038];
const defaultZoom = 5;

// Création de la carte globale
const globalMap = L.map("map").setView(defaultCoords, defaultZoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(globalMap);

// Marqueur optionnel Madrid
const madridMarker = L.marker([40.4959, -3.5676]).addTo(globalMap);
madridMarker.bindPopup("Madrid Airport (MAD)");

// Icône rouge pour l'utilisateur
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

// Bouton Relocalize
document.getElementById("recenterMap").addEventListener("click", (e) => {
  e.preventDefault();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        globalMap.setView(userCoords, 12);
        const userMarker = L.marker(userCoords, { icon: redIcon }).addTo(globalMap);
        userMarker.bindPopup("Vous êtes ici").openPopup();
      },
      (error) => {
        console.warn("Géolocalisation échouée, position par défaut.");
      }
    );
  } else {
    console.warn("Géolocalisation non supportée.");
  }
});

// Carte plan aéroport
let planMap = null;

function showMadridPlan() {
  // Masquer carte globale
  document.getElementById("map").style.display = "none";
  document.getElementById("menu").style.display = "none";

  // Afficher le plan
  const planDiv = document.getElementById("airportPlan");
  planDiv.style.display = "block";

  // Supprimer l'ancienne carte
  if (planMap) {
    planMap.remove();
  }

  const imageWidth = 1962;
  const imageHeight = 1652;

  planMap = L.map("airportPlanMap", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 4,
  });

  const bounds = [[0, 0], [imageHeight, imageWidth]];
  L.imageOverlay("mad.png", bounds).addTo(planMap);
  planMap.fitBounds(bounds);

  fetch("MAD.json")
    .then(res => res.json())
    .then(zones => {
      zones.forEach(zone => {
        const centerY = zone.y + zone.height / 2;
        const centerX = zone.x + zone.width / 2;
        const marker = L.marker([centerY, centerX]).addTo(planMap);
        marker.bindPopup(zone.label);
      });
    });
}

// Bouton pour ouvrir le plan
document.getElementById("openMadrid").addEventListener("click", (e) => {
  e.preventDefault();
  showMadridPlan();
});

// Bouton retour
document.getElementById("backBtn").addEventListener("click", () => {
  if (planMap) {
    planMap.remove();
    planMap = null;
  }
  document.getElementById("airportPlan").style.display = "none";
  document.getElementById("map").style.display = "block";
  document.getElementById("menu").style.display = "block";
});
