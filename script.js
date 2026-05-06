    const STATE = {
        cols: 32, 
        rows: 32, 
        tool: 'pencil', 
        color: '#2d6a4f',
        savedColors: new Array(24).fill(null),
        isDrawing: false, 
        hue: 150,
        layers: [], 
        activeLayerIndex: 0
    };


const mainCanvas = document.getElementById('mainCanvas');
const gridCanvas = document.getElementById('gridCanvas');
const ctx = mainCanvas.getContext('2d');
const gctx = gridCanvas.getContext('2d');
let cellSize = 16;

function initCanvas() {
  cellSize = Math.floor(Math.min((window.innerWidth - 500) / STATE.cols, (window.innerHeight - 100) / STATE.rows) * STATE.zoom);
  const w = STATE.cols * cellSize; const h = STATE.rows * cellSize;
  mainCanvas.width = w; mainCanvas.height = h;
  gridCanvas.width = w; gridCanvas.height = h;
  renderAll();
}

function addLayer(name) {
  const off = document.createElement('canvas');
  off.width = STATE.cols; off.height = STATE.rows;
  const layer = { name: name || `Layer ${STATE.layers.length + 1}`, canvas: off, ctx: off.getContext('2d'), visible: true, opacity: 1 };
  STATE.layers.unshift(layer);
  renderLayersList();
}

function renderLayersList() {
  const list = document.getElementById('layersList');
  list.innerHTML = '';
  STATE.layers.forEach((layer, i) => {
    const item = document.createElement('div');
    item.className = 'layer-item' + (i === STATE.activeLayerIndex ? ' active' : '');
    item.textContent = layer.name;
    item.onclick = () => { STATE.activeLayerIndex = i; renderLayersList(); };
    list.appendChild(item);
  });
}

function renderAll() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  for (let i = STATE.layers.length - 1; i >= 0; i--) {
    ctx.drawImage(STATE.layers[i].canvas, 0, 0, mainCanvas.width, mainCanvas.height);
  }
}

mainCanvas.addEventListener('mousedown', (e) => {
  STATE.isDrawing = true;
  const rect = mainCanvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  STATE.layers[STATE.activeLayerIndex].ctx.fillStyle = STATE.color;
  STATE.layers[STATE.activeLayerIndex].ctx.fillRect(x, y, 1, 1);
  renderAll();
});

window.addEventListener('mouseup', () => STATE.isDrawing = false);

// Initialize
addLayer('Base Layer');
initCanvas();
