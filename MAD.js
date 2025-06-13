function createZone(zone, container) {
  const div = document.createElement("div");
  div.id = zone.id;
  div.className = "zone";
  div.style.left = zone.x + "px";
  div.style.top = zone.y + "px";
  div.style.width = zone.width + "px";
  div.style.height = zone.height + "px";
  div.title = zone.label;

  div.addEventListener("click", function () {
    alert("Zone cliquée : " + zone.label);
  });

  container.appendChild(div);
}

function initZonesFromJSON() {
  const container = document.getElementById("plan-container");
  if (!container) {
    console.error("Conteneur plan non trouvé");
    return;
  }

  fetch("MAD.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur chargement JSON");
      }
      return response.json();
    })
    .then((zones) => {
      zones.forEach((zone) => {
        createZone(zone, container);
      });
    })
    .catch((err) => {
      console.error("Erreur lors du chargement des zones :", err);
    });
}

window.addEventListener("DOMContentLoaded", initZonesFromJSON);

// === MODE DEV : Affichage des coordonnées au clic sur le plan ===
const devMode = true; // passe à false pour désactiver

if (devMode) {
  const img = document.getElementById("plan-image");
  if (img) {
    img.addEventListener("click", (e) => {
      const rect = img.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      console.log(`{ "id": "zoneX", "x": ${x}, "y": ${y}, "width": 100, "height": 100, "label": "Nom de la zone" },`);
    });
  }
}
