const wallContainer = document.getElementById('wall-container');
const wallStage = document.getElementById('wall-stage');
const btnGenerate = document.getElementById('btn-generate');
const btnPdf = document.getElementById('btn-pdf');
const planerArea = document.getElementById('planer-area');

let currentScale = 1;

// Automatische Bildschirm-Skalierungsfunktion
function autoScaleWall() {
  const cols = parseInt(document.getElementById('cols').value) || 1;
  const rows = parseInt(document.getElementById('rows').value) || 1;

  const wallWidth = cols * 100;
  const wallHeight = rows * 200;

  wallStage.style.width = `${wallWidth}px`;
  wallStage.style.height = `${wallHeight}px`;

  // Verfübarer Platz im Arbeitsbereich
  const availableWidth = planerArea.clientWidth - 80;
  const availableHeight = planerArea.clientHeight - 80;

  if (availableWidth <= 0 || availableHeight <= 0) return;

  const scaleX = availableWidth / wallWidth;
  const scaleY = availableHeight / wallHeight;

  currentScale = Math.min(scaleX, scaleY, 1);
  wallStage.style.transform = `scale(${currentScale})`;
}

window.addEventListener('resize', autoScaleWall);

// Hilfsfunktion zur Erzeugung der Vektorzeichnung der Tri-Frames
function createTriFrameSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'tri-frame-overlay');
  svg.setAttribute('viewBox', '0 0 100 200');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.innerHTML = `
    <!-- CAD Line-Art Tri-Frame -->
    <line x1="8" y1="0" x2="8" y2="200" stroke="#ffffff" stroke-width="2"/>
    <line x1="92" y1="0" x2="92" y2="200" stroke="#ffffff" stroke-width="2"/>
    
    <rect x="43" y="-10" width="14" height="220" fill="#181818" stroke="#ffffff" stroke-width="2.5"/>
    <line x1="50" y1="-10" x2="50" y2="210" stroke="#ffffff" stroke-width="1" stroke-dasharray="4,3"/>
    
    <line x1="8" y1="10" x2="92" y2="10" stroke="#ffffff" stroke-width="2.5"/>
    <line x1="8" y1="100" x2="92" y2="100" stroke="#ffffff" stroke-width="2.5"/>
    <line x1="8" y1="190" x2="92" y2="190" stroke="#ffffff" stroke-width="2.5"/>
    
    <line x1="8" y1="10" x2="43" y2="55" stroke="#ffffff" stroke-width="2"/>
    <line x1="92" y1="10" x2="57" y2="55" stroke="#ffffff" stroke-width="2"/>
    <line x1="8" y1="100" x2="43" y2="55" stroke="#ffffff" stroke-width="2"/>
    <line x1="92" y1="100" x2="57" y2="55" stroke="#ffffff" stroke-width="2"/>
    
    <line x1="8" y1="100" x2="43" y2="145" stroke="#ffffff" stroke-width="2"/>
    <line x1="92" y1="100" x2="57" y2="145" stroke="#ffffff" stroke-width="2"/>
    <line x1="8" y1="190" x2="43" y2="145" stroke="#ffffff" stroke-width="2"/>
    <line x1="92" y1="190" x2="57" y2="145" stroke="#ffffff" stroke-width="2"/>
    
    <rect x="2" y="25" width="6" height="12" fill="#ffffff"/>
    <rect x="92" y="25" width="6" height="12" fill="#ffffff"/>
    <rect x="2" y="163" width="6" height="12" fill="#ffffff"/>
    <rect x="92" y="163" width="6" height="12" fill="#ffffff"/>

    <rect x="40" y="-14" width="20" height="8" fill="#ffffff" stroke="#ffffff" rx="1"/>
    <rect x="41" y="196" width="18" height="12" fill="#181818" stroke="#ffffff" stroke-width="2" rx="1"/>
  `;
  return svg;
}

// Proportionale Vektorzeichnung der Traversen
function renderTrussGraphics(type, width) {
  let svgPaths = '';
  let labelText = '';
  let svgHeight = 24;

  if (type === '1punkt') {
    labelText = '1-Punkt Pipe';
    svgHeight = 24;
    svgPaths = `
      <line x1="6" y1="12" x2="${width - 6}" y2="12" stroke="#00d2ff" stroke-width="8" stroke-linecap="round"/>
      <circle cx="10" cy="12" r="4" fill="#ffffff"/>
      <circle cx="${width - 10}" cy="12" r="4" fill="#ffffff"/>
    `;
  } else if (type === 'hofbolt') {
    labelText = 'HOFBOLT 2-Punkt';
    svgHeight = 48;
    let diagonals = '';
    const step = 30;
    for (let x = 0; x < width; x += step) {
      const x2 = Math.min(x + step, width);
      const y1 = Math.floor(x / step) % 2 === 0 ? 8 : 40;
      const y2 = Math.floor(x / step) % 2 === 0 ? 40 : 8;
      diagonals += `<line x1="${x}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#aaaaaa" stroke-width="2.5"/>`;
    }
    svgPaths = `
      <line x1="0" y1="8" x2="${width}" y2="8" stroke="#ffffff" stroke-width="4"/>
      <line x1="0" y1="40" x2="${width}" y2="40" stroke="#ffffff" stroke-width="4"/>
      ${diagonals}
      <rect x="0" y="4" width="8" height="40" fill="#007acc" rx="2"/>
      <rect x="${width - 8}" y="4" width="8" height="40" fill="#007acc" rx="2"/>
    `;
  } else if (type === '3punkt') {
    labelText = '3-Punkt Traverse';
    svgHeight = 56;
    let diagonals = '';
    const step = 30;
    for (let x = 0; x < width; x += step) {
      const x2 = Math.min(x + step, width);
      const y1 = Math.floor(x / step) % 2 === 0 ? 6 : 50;
      const y2 = Math.floor(x / step) % 2 === 0 ? 50 : 6;
      diagonals += `<line x1="${x}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#00d2ff" stroke-width="2.5"/>`;
    }
    svgPaths = `
      <line x1="0" y1="6" x2="${width}" y2="6" stroke="#ffffff" stroke-width="4"/>
      <line x1="0" y1="28" x2="${width}" y2="28" stroke="#007acc" stroke-width="3" stroke-dasharray="6,4"/>
      <line x1="0" y1="50" x2="${width}" y2="50" stroke="#ffffff" stroke-width="4"/>
      ${diagonals}
      <rect x="0" y="3" width="8" height="50" fill="#00d2ff" rx="2"/>
      <rect x="${width - 8}" y="3" width="8" height="50" fill="#00d2ff" rx="2"/>
    `;
  }

  const lengthInMeters = (width / 100 * 0.5).toFixed(1);

  return `
    <div class="truss-svg-wrapper" style="width: ${width}px;">
      <svg width="${width}" height="${svgHeight}" viewBox="0 0 ${width} ${svgHeight}">
        ${svgPaths}
      </svg>
    </div>
    <span class="truss-label-tag">${labelText} (${lengthInMeters}m)</span>
  `;
}

// Zentrale Funktion zur Berechnung und Aktualisierung aller Materialzahlen
function updateMaterialList() {
  const cols = parseInt(document.getElementById('cols').value) || 0;
  const rows = parseInt(document.getElementById('rows').value) || 0;
  const totalCabinets = cols * rows;

  const triFrames = document.querySelectorAll('.tri-frame-overlay');
  const placedBraces = document.querySelectorAll('.placed-element');

  const totalTriFrames = triFrames.length;
  const totalStiffeners = placedBraces.length;

  let totalCouplers = 0;

  triFrames.forEach(frame => {
    const frameRect = frame.getBoundingClientRect();
    let isAttachedToBrace = false;

    placedBraces.forEach(brace => {
      const braceRect = brace.getBoundingClientRect();

      const overlaps = !(
        braceRect.right < frameRect.left ||
        braceRect.left > frameRect.right ||
        braceRect.bottom < frameRect.top ||
        braceRect.top > frameRect.bottom
      );

      if (overlaps) {
        isAttachedToBrace = true;
      }
    });

    if (isAttachedToBrace) {
      totalCouplers++;
    }
  });

  // 1. Sidebar befüllen
  const sideCabinets = document.getElementById('sideCabinets');
  const sideTriFrames = document.getElementById('sideTriFrames');
  const sideStiffeners = document.getElementById('sideStiffeners');
  const sideCouplers = document.getElementById('sideCouplers');

  if (sideCabinets) sideCabinets.innerText = `${totalCabinets} Stk.`;
  if (sideTriFrames) sideTriFrames.innerText = `${totalTriFrames} Stk.`;
  if (sideStiffeners) sideStiffeners.innerText = `${totalStiffeners} Stk.`;
  if (sideCouplers) sideCouplers.innerText = `${totalCouplers} Stk.`;

  // 2. Plankopf befüllen
  const pkCount = document.getElementById('pkCount');
  const pkGrid = document.getElementById('pkGrid');
  const pkTriFrames = document.getElementById('pkTriFrames');
  const pkStiffeners = document.getElementById('pkStiffeners');
  const pkCouplers = document.getElementById('pkCouplers');
  const pkDate = document.getElementById('pkDate');

  if (pkCount) pkCount.innerText = `${totalCabinets} Stk.`;
  if (pkGrid) pkGrid.innerText = `${cols} x ${rows}`;
  if (pkTriFrames) pkTriFrames.innerText = `${totalTriFrames} Stk.`;
  if (pkStiffeners) pkStiffeners.innerText = `${totalStiffeners} Stk.`;
  if (pkCouplers) pkCouplers.innerText = `${totalCouplers} Stk.`;
  if (pkDate) pkDate.innerText = new Date().toLocaleDateString('de-DE');
}

// Funktion zum Erstellen der LED-Wand
function generateWall() {
  const cols = parseInt(document.getElementById('cols').value) || 1;
  const rows = parseInt(document.getElementById('rows').value) || 1;

  wallContainer.innerHTML = '';
  wallContainer.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('cabinet-wrapper');

      const img = document.createElement('img');
      img.src = 'bilder/ledwand.jpg';
      img.classList.add('cabinet-img');
      img.alt = 'LED Cabinet';

      wrapper.appendChild(img);

      // Klick-Event für Vektor-Tri-Frames auf einzelnen Cabinets
      wrapper.addEventListener('click', () => {
        let existingFrame = wrapper.querySelector('.tri-frame-overlay');
        if (existingFrame) {
          existingFrame.remove();
        } else {
          const frameSVG = createTriFrameSVG();
          wrapper.appendChild(frameSVG);
        }
        updateMaterialList();
      });

      wallContainer.appendChild(wrapper);
    }
  }

  const currentWidth = cols * 100;

  // Traversen anpassen
  document.querySelectorAll('.placed-element').forEach(element => {
    const type = element.getAttribute('data-type') || 'hofbolt';
    element.innerHTML = renderTrussGraphics(type, currentWidth);
  });

  autoScaleWall();
  updateMaterialList();
}

btnGenerate.addEventListener('click', generateWall);

// Drag-and-Drop für Traversen
const bauteile = document.querySelectorAll('.bauteil');

bauteile.forEach(bauteil => {
  bauteil.addEventListener('dragstart', (e) => {
    const type = bauteil.getAttribute('data-type');
    e.dataTransfer.setData('text/plain', type);
  });
});

planerArea.addEventListener('dragover', (e) => {
  e.preventDefault();
});

planerArea.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('text/plain');

  if (type) {
    const cols = parseInt(document.getElementById('cols').value) || 1;
    const wallWidth = cols * 100;

    const newElement = document.createElement('div');
    newElement.classList.add('placed-element');
    newElement.setAttribute('data-type', type);
    newElement.innerHTML = renderTrussGraphics(type, wallWidth);

    const stageRect = wallStage.getBoundingClientRect();
    let relativeY = (e.clientY - stageRect.top) / currentScale - 20;

    relativeY = Math.round(relativeY / 20) * 20;

    newElement.style.top = `${relativeY}px`;

    makeDraggable(newElement);
    wallStage.appendChild(newElement);

    updateMaterialList();
  }
});

function makeDraggable(element) {
  let isDragging = false;
  let startY;
  let startTop;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startTop = parseFloat(element.style.top) || 0;
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaY = (e.clientY - startY) / currentScale;
      let newTop = startTop + deltaY;
      newTop = Math.round(newTop / 20) * 20;
      element.style.top = `${newTop}px`;

      updateMaterialList();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      updateMaterialList();
    }
  });

  element.addEventListener('dblclick', () => {
    element.remove();
    updateMaterialList();
  });
}

// PDF-Export-Funktionalität mit intelligenter A4/A3 Umschaltung
btnPdf.addEventListener('click', async () => {
  const planNo = document.getElementById('pkNo').innerText || 'VT-Plan';
  const cols = parseInt(document.getElementById('cols').value) || 1;
  const rows = parseInt(document.getElementById('rows').value) || 1;

  // Ab mehr als 12 Spalten ODER 8 Zeilen wird automatisch A3 gewählt
  const isA3 = cols > 12 || rows > 8;
  const paperFormat = isA3 ? 'a3' : 'a4';

  // Pixel-Abmessungen für A4 (1122x793) vs A3 (1587x1122) bei 96 DPI
  const targetW = isA3 ? 1587 : 1122;
  const targetH = isA3 ? 1122 : 793;

  const exportClass = isA3 ? 'pdf-export-mode-a3' : 'pdf-export-mode-a4';
  document.body.classList.add(exportClass);

  const wallWidth = cols * 100;
  const wallHeight = rows * 200;

  const availableW = targetW - 100;
  const availableH = targetH - 140;

  const scaleX = availableW / wallWidth;
  const scaleY = availableH / wallHeight;
  const printScale = Math.min(scaleX, scaleY, 1);

  wallStage.style.transform = `scale(${printScale})`;
  wallStage.style.transformOrigin = 'center center';

  await new Promise(resolve => setTimeout(resolve, 250));

  const opt = {
    margin:       0,
    filename:     `LED_Wand_${planNo}_${paperFormat.toUpperCase()}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 2, 
      useCORS: true, 
      allowTaint: true,
      backgroundColor: '#181818',
      scrollX: 0,
      scrollY: 0,
      windowWidth: targetW,
      windowHeight: targetH,
      logging: false 
    },
    jsPDF:        { unit: 'mm', format: paperFormat, orientation: 'landscape' },
    pagebreak:    { mode: 'avoid-all' }
  };

  try {
    await html2pdf().set(opt).from(planerArea).save();
  } catch (err) {
    console.error('PDF Export Fehler:', err);
  } finally {
    document.body.classList.remove(exportClass);
    autoScaleWall();
  }
});

// Wand initial beim Laden aufbauen
generateWall();
