document.addEventListener("DOMContentLoaded", () => {
  const planImg = document.getElementById("plan-image");
  const drawingLayer = document.getElementById("drawing-layer");
  const jsonOutput = document.getElementById("json-output");
  const copyBtn = document.getElementById("copy-json");
  const resetBtn = document.getElementById("reset-zones");

  let startX, startY;
  let currentRect = null;
  let zones = [];
  let zoneCount = 0;

  // Ajuste la taille du calque de dessin au chargement et redimensionnement
  function resizeLayer() {
    const rect = planImg.getBoundingClientRect();
    drawingLayer.style.width = rect.width + "px";
    drawingLayer.style.height = rect.height + "px";
  }
  window.addEventListener("resize", resizeLayer);
  planImg.addEventListener("load", resizeLayer);
  resizeLayer();

  // Conversion position souris relative à l'image
  function getRelativePos(event) {
    const rect = planImg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }

  // Commencer à dessiner la zone
  drawingLayer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const pos = getRelativePos(e);
    startX = pos.x;
    startY = pos.y;

    currentRect = document.createElement("div");
    currentRect.className = "zone-rect";
    currentRect.style.left = startX + "px";
    currentRect.style.top = startY + "px";
    currentRect.style.width = "0px";
    currentRect.style.height = "0px";

    drawingLayer.appendChild(currentRect);
  });

  // Mettre à jour la zone dessinée pendant le drag
  drawingLayer.addEventListener("mousemove", (e) => {
    if (!currentRect) return;
    e.preventDefault();
    const pos = getRelativePos(e);

    const x = Math.min(pos.x, startX);
    const y = Math.min(pos.y, startY);
    const width = Math.abs(pos.x - startX);
    const height = Math.abs(pos.y - startY);

    currentRect.style.left = x + "px";
    currentRect.style.top = y + "px";
    currentRect.style.width = width + "px";
    currentRect.style.height = height + "px";
  });

  // Finir le dessin de la zone
  drawingLayer.addEventListener("mouseup", (e) => {
    if (!currentRect) return;
    e.preventDefault();
    const rect = currentRect.getBoundingClientRect();
    const imgRect = planImg.getBoundingClientRect();

    // Coordonnées relatives à l'image, arrondies
    const x = Math.round(rect.left - imgRect.left);
    const y = Math.round(rect.top - imgRect.top);
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    if (width < 10 || height < 10) {
      // Trop petit => annuler
      drawingLayer.removeChild(currentRect);
      currentRect = null;
      return;
    }

    zoneCount++;
    const zoneId = "zone" + zoneCount;
    const label = prompt("Nom de la zone ?", "Nouvelle zone");

    // Ajout à la liste
    const zoneData = { id: zoneId, x, y, width, height, label };
    zones.push(zoneData);

    // Affiche JSON dans textarea
    updateJsonOutput();

    // Fixer le style (pointer-events none pour éviter interférence)
    currentRect.style.pointerEvents = "auto"; // on peut changer si besoin
    currentRect.title = label;
    currentRect.id = zoneId;
    currentRect = null;
  });

  // Met à jour le textarea JSON
  function updateJsonOutput() {
    jsonOutput.value = JSON.stringify(zones, null, 2);
  }

  // Copier JSON dans le presse-papier
  copyBtn.addEventListener("click", () => {
    jsonOutput.select();
    document.execCommand("copy");
    alert("JSON copié dans le presse-papier !");
  });

  // Réinitialiser tout
  resetBtn.addEventListener("click", () => {
    zones = [];
    zoneCount = 0;
    jsonOutput.value = "";
    drawingLayer.innerHTML = "";
  });
});
