// ---------- Pixel art ----------
// Detailed 32x32 pixel art for heroes, gear and monsters, built from simple shapes. The renderer
// rasterizes the shapes, then adds shading (light from the top left) and a dark
// outline, so every sprite gets the same polished look.
//
// A shape is [type, ...args, color, options]:
//   ["ellipse", cx, cy, rx, ry, color]
//   ["rect", x, y, w, h, color]
//   ["poly", [[x, y], ...], color]
//   ["line", x1, y1, x2, y2, color]          (1px line)
//   ["px", [[x, y], ...], color]             (single pixels)
// options: { flat: true } skips shading (eyes, highlights, small details).
// Colors can be hex values or palette letters resolved through a palette.

const ART_SIZE = 32;
const OUTLINE = "#160f24";

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  const mix = (c) => Math.round(c + (target - c) * t);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function insidePoly(points, x, y) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Draws shapes into a grid of { color, part, flat } cells
function rasterize(shapes, palette, size, grid = []) {
  shapes.forEach((shape, part) => {
    const [type, ...args] = shape;
    const last = args[args.length - 1];
    const opts = typeof last === "object" && !Array.isArray(last) ? args.pop() : {};
    const raw = args.pop();
    const color = palette && palette[raw] ? palette[raw] : raw;
    const set = (x, y) => {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      grid[y * size + x] = { color, part, flat: opts.flat };
    };
    if (type === "ellipse") {
      const [cx, cy, rx, ry] = args;
      for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          const dx = (x + 0.5 - cx) / rx;
          const dy = (y + 0.5 - cy) / ry;
          if (dx * dx + dy * dy <= 1) set(x, y);
        }
      }
    } else if (type === "rect") {
      const [x0, y0, w, h] = args;
      for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(x, y);
    } else if (type === "poly") {
      const [points] = args;
      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
        for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++) {
          if (insidePoly(points, x + 0.5, y + 0.5)) set(x, y);
        }
      }
    } else if (type === "line") {
      let [x1, y1, x2, y2] = args;
      const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
      for (let i = 0; i <= steps; i++) {
        set(Math.round(x1 + ((x2 - x1) * i) / steps), Math.round(y1 + ((y2 - y1) * i) / steps));
      }
    } else if (type === "px") {
      args[0].forEach(([x, y]) => set(x, y));
    }
  });
  return grid;
}

// Shading and outline, then SVG rects
function gridToRects(grid, size, ox = 0, oy = 0) {
  const at = (x, y) => (x < 0 || y < 0 || x >= size || y >= size ? null : grid[y * size + x]);
  let rects = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = at(x, y);
      let color;
      if (cell) {
        color = cell.color;
        if (!cell.flat) {
          const below = at(x + 1, y + 1);
          const above = at(x - 1, y - 1);
          // A neighbor that is empty or belongs to a shape further back is an edge
          if (!below || below.part < cell.part) color = shade(cell.color, -0.3);
          else if (!above || above.part < cell.part) color = shade(cell.color, 0.22);
        }
      } else if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) {
        color = OUTLINE;
      }
      if (color) rects += `<rect x="${x + ox}" y="${y + oy}" width="1" height="1" fill="${color}"/>`;
    }
  }
  return rects;
}

function artSvg(shapes, label, palette = null) {
  const grid = rasterize(shapes, palette, ART_SIZE);
  return `<svg class="sprite art" viewBox="0 0 ${ART_SIZE} ${ART_SIZE}" role="img" aria-label="${label}">${gridToRects(grid, ART_SIZE)}</svg>`;
}

// ---------- Monsters (facing left, toward the hero) ----------

const EYE = "#fef08a";
const RED_EYE = "#ef4444";
const WHITE = "#ffffff";
const DARK = "#1e1b2e";

const MONSTER_ART = {
  rat: [
    ["line", 26, 25, 31, 15, "#f9a8d4"],
    ["line", 27, 25, 31, 16, "#f9a8d4"],
    ["ellipse", 18, 22, 10, 6.5, "#9ca3af"],
    ["ellipse", 18, 25, 7, 3, "#d1d5db"],
    ["rect", 12, 27, 3, 3, "#9ca3af"],
    ["rect", 21, 27, 3, 3, "#9ca3af"],
    ["ellipse", 9, 19, 6, 5, "#9ca3af"],
    ["poly", [[3, 19], [7, 17], [7, 22]], "#9ca3af"],
    ["ellipse", 11, 13.5, 3, 3.5, "#9ca3af"],
    ["ellipse", 11, 14, 1.6, 2.2, "#f9a8d4", { flat: true }],
    ["px", [[3, 19], [2, 19]], "#f472b6", { flat: true }],
    ["px", [[7, 17], [8, 17]], DARK, { flat: true }],
    ["px", [[7, 16]], WHITE, { flat: true }],
    ["px", [[4, 22], [5, 22]], WHITE, { flat: true }],
    ["line", 4, 18, 1, 16, "#e5e7eb", { flat: true }],
    ["line", 4, 20, 1, 21, "#e5e7eb", { flat: true }],
  ],
  goblin: [
    ["line", 24, 8, 27, 26, "#78350f"],
    ["ellipse", 25, 8, 3.5, 3.5, "#92400e"],
    ["rect", 11, 25, 4, 6, "#4d7c0f"],
    ["rect", 17, 25, 4, 6, "#4d7c0f"],
    ["ellipse", 16, 21, 7, 6, "#854d0e"],
    ["rect", 10, 22, 12, 3, "#713f12"],
    ["ellipse", 8, 21, 2.5, 4, "#65a30d"],
    ["ellipse", 24, 19, 2.5, 4, "#65a30d"],
    ["poly", [[4, 6], [11, 11], [9, 14]], "#65a30d"],
    ["poly", [[28, 6], [21, 11], [23, 14]], "#65a30d"],
    ["ellipse", 16, 12, 7, 6.5, "#84cc16"],
    ["px", [[12, 11], [13, 11], [18, 11], [19, 11]], RED_EYE, { flat: true }],
    ["px", [[12, 10], [18, 10]], DARK, { flat: true }],
    ["line", 13, 15, 19, 15, DARK, { flat: true }],
    ["px", [[14, 16], [17, 16]], WHITE, { flat: true }],
    ["px", [[15, 13], [16, 13]], "#4d7c0f", { flat: true }],
  ],
  goblin_king: [
    ["poly", [[7, 14], [25, 14], [29, 31], [3, 31]], "#b91c1c"],
    ["line", 27, 4, 27, 28, "#facc15"],
    ["ellipse", 27, 4, 2.5, 2.5, "#a855f7"],
    ["rect", 10, 25, 5, 6, "#3f6212"],
    ["rect", 17, 25, 5, 6, "#3f6212"],
    ["ellipse", 16, 21, 8, 6.5, "#4c1d95"],
    ["rect", 9, 21, 14, 2, "#facc15"],
    ["ellipse", 7, 20, 3, 4, "#65a30d"],
    ["ellipse", 25, 20, 3, 4, "#65a30d"],
    ["poly", [[2, 8], [10, 12], [9, 15]], "#65a30d"],
    ["poly", [[30, 8], [22, 12], [23, 15]], "#65a30d"],
    ["ellipse", 16, 13, 7.5, 6.5, "#84cc16"],
    ["poly", [[9, 8], [9, 3], [12, 6], [14, 2], [16, 5], [18, 2], [20, 6], [23, 3], [23, 8]], "#facc15"],
    ["px", [[13, 5], [19, 5]], "#ef4444", { flat: true }],
    ["px", [[12, 12], [13, 12], [19, 12], [20, 12]], RED_EYE, { flat: true }],
    ["line", 12, 16, 20, 16, DARK, { flat: true }],
    ["px", [[13, 17], [19, 17]], WHITE, { flat: true }],
  ],
  bat: [
    ["poly", [[16, 14], [2, 6], [1, 13], [4, 12], [5, 17], [8, 15], [10, 20], [13, 17]], "#6b21a8"],
    ["poly", [[16, 14], [30, 6], [31, 13], [28, 12], [27, 17], [24, 15], [22, 20], [19, 17]], "#6b21a8"],
    ["ellipse", 16, 18, 5, 6, "#7e22ce"],
    ["poly", [[11, 12], [12, 6], [14, 11]], "#7e22ce"],
    ["poly", [[21, 12], [20, 6], [18, 11]], "#7e22ce"],
    ["ellipse", 16, 13, 5, 4.5, "#9333ea"],
    ["px", [[13, 12], [14, 12], [18, 12], [19, 12]], RED_EYE, { flat: true }],
    ["px", [[14, 16], [18, 16]], WHITE, { flat: true }],
    ["px", [[14, 17], [18, 17]], WHITE, { flat: true }],
    ["rect", 13, 23, 2, 3, "#581c87"],
    ["rect", 17, 23, 2, 3, "#581c87"],
  ],
  skeleton: [
    ["line", 4, 6, 9, 22, "#d1d5db"],
    ["line", 5, 6, 10, 22, "#e5e7eb"],
    ["rect", 7, 21, 5, 2, "#78350f"],
    ["line", 13, 24, 12, 31, "#e7e5e4"],
    ["line", 19, 24, 20, 31, "#e7e5e4"],
    ["ellipse", 16, 23, 5, 2.5, "#d6d3d1"],
    ["rect", 15, 13, 2, 10, "#e7e5e4"],
    ["line", 11, 15, 21, 15, "#e7e5e4"],
    ["line", 11, 17, 21, 17, "#e7e5e4"],
    ["line", 12, 19, 20, 19, "#e7e5e4"],
    ["line", 10, 14, 8, 21, "#e7e5e4"],
    ["line", 22, 14, 25, 21, "#e7e5e4"],
    ["ellipse", 16, 8, 6, 5.5, "#f5f5f4"],
    ["rect", 13, 12, 6, 3, "#e7e5e4"],
    ["ellipse", 13.5, 8, 1.8, 2, DARK, { flat: true }],
    ["ellipse", 18.5, 8, 1.8, 2, DARK, { flat: true }],
    ["px", [[13, 8], [18, 8]], "#22d3ee", { flat: true }],
    ["px", [[14, 13], [16, 13], [18, 13]], DARK, { flat: true }],
  ],
  lich: [
    ["line", 27, 3, 27, 30, "#57534e"],
    ["ellipse", 27, 4, 3, 3, "#4ade80"],
    ["ellipse", 26.5, 3.5, 1, 1, "#dcfce7", { flat: true }],
    ["poly", [[16, 3], [25, 12], [27, 31], [5, 31], [7, 12]], "#3b0764"],
    ["poly", [[16, 5], [22, 12], [21, 18], [11, 18], [10, 12]], "#1e1b2e"],
    ["ellipse", 16, 13, 4.5, 4.5, "#e7e5e4"],
    ["px", [[14, 13], [18, 13]], "#4ade80", { flat: true }],
    ["px", [[14, 12], [18, 12]], "#bbf7d0", { flat: true }],
    ["px", [[15, 16], [16, 16], [17, 16]], DARK, { flat: true }],
    ["rect", 9, 21, 14, 2, "#7e22ce"],
    ["ellipse", 7, 21, 2.5, 2, "#e7e5e4"],
    ["line", 15, 23, 13, 31, "#581c87"],
  ],
  wolf: [
    ["poly", [[25, 17], [31, 11], [30, 18], [27, 21]], "#4b5563"],
    ["rect", 9, 23, 3, 8, "#374151"],
    ["rect", 22, 23, 3, 8, "#374151"],
    ["ellipse", 18, 20, 9, 6, "#4b5563"],
    ["rect", 13, 23, 3, 8, "#4b5563"],
    ["rect", 25, 23, 3, 7, "#4b5563"],
    ["ellipse", 18, 23, 6, 2.5, "#9ca3af"],
    ["ellipse", 9, 15, 5.5, 5, "#4b5563"],
    ["poly", [[1, 17], [6, 14], [8, 19], [3, 20]], "#6b7280"],
    ["poly", [[7, 6], [10, 11], [6, 11]], "#4b5563"],
    ["poly", [[12, 7], [14, 12], [10, 11]], "#4b5563"],
    ["px", [[6, 14], [7, 14]], EYE, { flat: true }],
    ["px", [[1, 17]], DARK, { flat: true }],
    ["px", [[2, 19], [4, 19]], WHITE, { flat: true }],
  ],
  spider: [
    ["line", 12, 18, 3, 12, "#27272a"], ["line", 3, 12, 1, 22, "#27272a"],
    ["line", 12, 20, 4, 17, "#27272a"], ["line", 4, 17, 2, 27, "#27272a"],
    ["line", 20, 18, 28, 12, "#27272a"], ["line", 28, 12, 31, 22, "#27272a"],
    ["line", 20, 20, 27, 17, "#27272a"], ["line", 27, 17, 30, 27, "#27272a"],
    ["line", 13, 22, 8, 23, "#27272a"], ["line", 8, 23, 7, 29, "#27272a"],
    ["line", 19, 22, 24, 23, "#27272a"], ["line", 24, 23, 25, 29, "#27272a"],
    ["ellipse", 16, 12, 8, 7, "#3f3f46"],
    ["poly", [[16, 7], [19, 12], [16, 17], [13, 12]], "#dc2626", { flat: true }],
    ["ellipse", 16, 21, 5.5, 4.5, "#52525b"],
    ["px", [[13, 20], [14, 19], [18, 19], [19, 20]], RED_EYE, { flat: true }],
    ["px", [[15, 21], [17, 21]], RED_EYE, { flat: true }],
    ["px", [[14, 25], [18, 25]], WHITE, { flat: true }],
  ],
  treant: [
    ["poly", [[8, 31], [10, 26], [12, 31]], "#78350f"],
    ["poly", [[20, 31], [22, 26], [24, 31]], "#78350f"],
    ["rect", 10, 14, 12, 15, "#92400e"],
    ["line", 10, 18, 3, 13, "#92400e"], ["line", 3, 13, 2, 9, "#92400e"],
    ["line", 21, 18, 28, 12, "#92400e"], ["line", 28, 12, 30, 8, "#92400e"],
    ["ellipse", 16, 8, 11, 7, "#15803d"],
    ["ellipse", 8, 10, 5, 4, "#16a34a"],
    ["ellipse", 24, 9, 5, 4, "#16a34a"],
    ["ellipse", 15, 5, 6, 4, "#22c55e"],
    ["ellipse", 13, 18, 1.5, 1.5, DARK, { flat: true }],
    ["ellipse", 19, 18, 1.5, 1.5, DARK, { flat: true }],
    ["px", [[13, 18], [19, 18]], EYE, { flat: true }],
    ["line", 13, 23, 19, 23, DARK, { flat: true }],
    ["line", 12, 26, 12, 28, "#713f12", { flat: true }],
    ["line", 19, 15, 19, 16, "#713f12", { flat: true }],
    ["px", [[2, 9], [30, 8]], "#22c55e", { flat: true }],
  ],
  imp: [
    ["line", 22, 24, 29, 20, "#991b1b"],
    ["poly", [[29, 17], [31, 21], [27, 21]], "#991b1b"],
    ["poly", [[9, 13], [2, 8], [4, 16]], "#7f1d1d"],
    ["poly", [[23, 13], [30, 8], [28, 16]], "#7f1d1d"],
    ["rect", 12, 24, 3, 6, "#b91c1c"],
    ["rect", 18, 24, 3, 6, "#b91c1c"],
    ["ellipse", 16, 20, 6, 6, "#dc2626"],
    ["ellipse", 16, 11, 6.5, 6, "#ef4444"],
    ["poly", [[10, 8], [9, 2], [13, 7]], "#fde68a"],
    ["poly", [[22, 8], [23, 2], [19, 7]], "#fde68a"],
    ["px", [[13, 10], [14, 10], [18, 10], [19, 10]], EYE, { flat: true }],
    ["line", 13, 14, 19, 14, DARK, { flat: true }],
    ["px", [[14, 13], [18, 13]], DARK, { flat: true }],
    ["ellipse", 6, 22, 2, 3, "#f97316", { flat: true }],
    ["ellipse", 6, 22.5, 1, 1.5, "#fde047", { flat: true }],
  ],
  golem: [
    ["rect", 9, 24, 6, 7, "#44403c"],
    ["rect", 18, 24, 6, 7, "#44403c"],
    ["poly", [[7, 10], [25, 10], [27, 25], [5, 25]], "#57534e"],
    ["poly", [[2, 12], [7, 11], [8, 22], [3, 23]], "#44403c"],
    ["poly", [[30, 12], [25, 11], [24, 22], [29, 23]], "#44403c"],
    ["poly", [[11, 2], [21, 2], [23, 10], [9, 10]], "#57534e"],
    ["line", 10, 13, 15, 18, "#f97316", { flat: true }],
    ["line", 15, 18, 13, 23, "#f97316", { flat: true }],
    ["line", 22, 12, 19, 17, "#f97316", { flat: true }],
    ["line", 19, 17, 22, 22, "#fb923c", { flat: true }],
    ["line", 4, 15, 6, 19, "#f97316", { flat: true }],
    ["px", [[13, 6], [14, 6], [18, 6], [19, 6]], "#fde047", { flat: true }],
    ["line", 14, 8, 18, 8, "#f97316", { flat: true }],
  ],
  drake: [
    ["poly", [[18, 14], [30, 3], [29, 13], [24, 18]], "#7f1d1d"],
    ["poly", [[22, 22], [31, 26], [30, 29], [20, 26]], "#b91c1c"],
    ["rect", 13, 24, 4, 7, "#991b1b"],
    ["rect", 20, 24, 4, 7, "#991b1b"],
    ["ellipse", 18, 21, 8, 6, "#dc2626"],
    ["ellipse", 17, 23, 5, 3, "#fca5a5"],
    ["poly", [[11, 19], [8, 11], [12, 9], [15, 17]], "#dc2626"],
    ["ellipse", 8, 9, 5, 4, "#ef4444"],
    ["poly", [[1, 10], [5, 8], [6, 12], [2, 12]], "#ef4444"],
    ["poly", [[9, 6], [12, 1], [12, 6]], "#fde68a"],
    ["px", [[6, 8], [7, 8]], EYE, { flat: true }],
    ["px", [[2, 12], [4, 12]], WHITE, { flat: true }],
    ["ellipse", 0.5, 15, 1.5, 2.5, "#f97316", { flat: true }],
  ],
  wyvern: [
    ["poly", [[14, 14], [2, 3], [5, 13], [1, 16], [9, 19]], "#0f766e"],
    ["poly", [[19, 14], [31, 3], [28, 13], [31, 17], [23, 19]], "#0f766e"],
    ["poly", [[20, 22], [30, 28], [28, 30], [18, 25]], "#14b8a6"],
    ["ellipse", 17, 19, 6, 6, "#14b8a6"],
    ["ellipse", 16, 21, 3.5, 3, "#99f6e4"],
    ["poly", [[13, 16], [9, 8], [12, 7], [16, 14]], "#14b8a6"],
    ["ellipse", 9, 7, 4, 3.5, "#2dd4bf"],
    ["poly", [[3, 8], [6, 6], [7, 9]], "#2dd4bf"],
    ["poly", [[10, 4], [13, 0], [12, 5]], "#ccfbf1"],
    ["px", [[8, 6]], EYE, { flat: true }],
    ["line", 13, 25, 12, 29, "#0f766e"],
    ["line", 19, 25, 20, 29, "#0f766e"],
  ],
  ogre: [
    ["line", 4, 6, 7, 24, "#78350f"],
    ["ellipse", 5, 7, 3.5, 5, "#92400e"],
    ["px", [[4, 4], [6, 6], [3, 8]], "#d6d3d1", { flat: true }],
    ["rect", 10, 25, 5, 6, "#57534e"],
    ["rect", 18, 25, 5, 6, "#57534e"],
    ["ellipse", 16, 19, 10, 8, "#a3a35a"],
    ["ellipse", 16, 22, 6, 5, "#c3c37a"],
    ["rect", 7, 23, 18, 3, "#713f12"],
    ["ellipse", 6, 18, 3, 5, "#a3a35a"],
    ["ellipse", 26, 18, 3, 5, "#a3a35a"],
    ["ellipse", 16, 8, 5, 5, "#a3a35a"],
    ["px", [[14, 7], [18, 7]], RED_EYE, { flat: true }],
    ["line", 14, 6, 15, 6, DARK, { flat: true }],
    ["line", 17, 6, 18, 6, DARK, { flat: true }],
    ["px", [[14, 11], [18, 11]], WHITE, { flat: true }],
    ["px", [[14, 10], [18, 10]], WHITE, { flat: true }],
  ],
  dragon: [
    ["poly", [[17, 13], [31, 0], [30, 9], [31, 14], [24, 19]], "#312e81"],
    ["poly", [[14, 13], [5, 2], [6, 10], [3, 14], [10, 17]], "#3730a3"],
    ["poly", [[22, 23], [31, 25], [31, 30], [19, 27]], "#4338ca"],
    ["rect", 13, 25, 4, 6, "#312e81"],
    ["rect", 21, 25, 4, 6, "#312e81"],
    ["ellipse", 19, 21, 8, 6.5, "#4338ca"],
    ["ellipse", 18, 23, 5, 3.5, "#a5b4fc"],
    ["poly", [[13, 19], [8, 11], [11, 9], [16, 16]], "#4338ca"],
    ["ellipse", 7, 9, 5.5, 4.5, "#4f46e5"],
    ["poly", [[0, 10], [4, 8], [5, 12], [1, 13]], "#4f46e5"],
    ["poly", [[8, 6], [12, 0], [11, 6]], "#facc15"],
    ["poly", [[5, 6], [6, 1], [7, 6]], "#facc15"],
    ["px", [[5, 8], [6, 8]], "#f97316", { flat: true }],
    ["px", [[1, 12], [3, 12]], WHITE, { flat: true }],
    ["px", [[18, 16], [21, 15], [24, 17]], "#facc15", { flat: true }],
  ],
};

function monsterArt(id, label) {
  return artSvg(MONSTER_ART[id], label);
}

// ---------- Hero back views (facing the monster) ----------
// Palette letters match the class sprites, so promotions recolor these too.

const HERO_BACK_ART = {
  barbarian: [
    ["line", 25, 4, 22, 24, "b"],
    ["poly", [[24, 2], [30, 5], [29, 10], [25, 8]], "m"],
    ["rect", 11, 24, 4, 6, "s"],
    ["rect", 18, 24, 4, 6, "s"],
    ["rect", 10, 29, 6, 2, "d"],
    ["rect", 17, 29, 6, 2, "d"],
    ["ellipse", 16, 18, 9, 7, "s"],
    ["ellipse", 6, 17, 3, 5, "s"],
    ["ellipse", 26, 17, 3, 5, "s"],
    ["rect", 9, 22, 15, 4, "f"],
    ["rect", 9, 21, 15, 1, "b"],
    ["line", 16, 13, 16, 20, "d", { flat: true }],
    ["ellipse", 16, 9, 5.5, 5, "h"],
    ["ellipse", 16, 6, 5.5, 3.5, "m"],
    ["poly", [[10, 6], [5, 1], [8, 7]], "w"],
    ["poly", [[22, 6], [27, 1], [24, 7]], "w"],
  ],
  assassin: [
    ["line", 6, 14, 3, 22, "a"],
    ["line", 26, 14, 29, 22, "a"],
    ["rect", 12, 24, 3, 7, "c"],
    ["rect", 17, 24, 3, 7, "c"],
    ["poly", [[10, 13], [22, 13], [24, 26], [8, 26]], "c"],
    ["poly", [[12, 13], [20, 13], [21, 25], [11, 25]], "C"],
    ["ellipse", 8, 17, 2.5, 4.5, "c"],
    ["ellipse", 24, 17, 2.5, 4.5, "c"],
    ["px", [[6, 20], [26, 20]], "s", { flat: true }],
    ["rect", 10, 21, 12, 2, "b"],
    ["ellipse", 16, 9, 6, 6, "C"],
    ["poly", [[16, 2], [21, 8], [16, 15], [11, 8]], "c"],
  ],
  monk: [
    ["ellipse", 16, 25, 12, 6, "O"],
    ["ellipse", 16, 20, 9, 7, "o"],
    ["ellipse", 6, 22, 3, 3.5, "o"],
    ["ellipse", 26, 22, 3, 3.5, "o"],
    ["line", 9, 18, 23, 18, "r"],
    ["line", 9, 19, 23, 19, "r"],
    ["ellipse", 16, 10, 5.5, 5.5, "s"],
    ["ellipse", 16, 15, 3, 1.5, "s"],
    ["px", [[8, 4], [24, 4], [6, 9], [26, 9]], "y", { flat: true }],
  ],
  warrior: [
    ["line", 26, 2, 26, 19, "a"],
    ["line", 27, 2, 27, 19, "a"],
    ["rect", 24, 19, 5, 2, "y"],
    ["rect", 12, 24, 3, 7, "m"],
    ["rect", 17, 24, 3, 7, "m"],
    ["poly", [[10, 14], [22, 14], [23, 26], [9, 26]], "b"],
    ["rect", 9, 22, 14, 4, "B"],
    ["rect", 9, 21, 14, 1, "y"],
    ["ellipse", 23, 17, 2.5, 4, "s"],
    ["ellipse", 7, 18, 5.5, 7, "B"],
    ["ellipse", 7, 18, 3.5, 5, "M"],
    ["px", [[7, 18]], "y", { flat: true }],
    ["ellipse", 16, 9, 5.5, 5.5, "m"],
    ["rect", 11, 11, 11, 2, "M"],
    ["line", 16, 4, 16, 10, "M", { flat: true }],
  ],
  knight: [
    ["line", 26, 3, 26, 19, "a"],
    ["line", 27, 3, 27, 19, "a"],
    ["rect", 24, 19, 5, 2, "y"],
    ["rect", 12, 24, 3, 7, "m"],
    ["rect", 17, 24, 3, 7, "m"],
    ["poly", [[10, 14], [22, 14], [23, 26], [9, 26]], "a"],
    ["poly", [[12, 14], [20, 14], [20, 27], [12, 27]], "t"],
    ["line", 16, 16, 16, 24, "y", { flat: true }],
    ["line", 13, 18, 19, 18, "y", { flat: true }],
    ["ellipse", 23, 16, 3, 3.5, "m"],
    ["poly", [[2, 12], [12, 12], [11, 21], [7, 27], [3, 21]], "T"],
    ["line", 7, 14, 7, 23, "y", { flat: true }],
    ["line", 4, 17, 10, 17, "y", { flat: true }],
    ["ellipse", 16, 9, 5.5, 5.5, "a"],
    ["rect", 11, 11, 11, 2, "m"],
    ["poly", [[15, 4], [17, 0], [21, 2], [18, 6]], "p"],
  ],
};

// ---------- Gear ----------
// Headgear sits on top of the head; hy is the y of the top of the head.

function headGearShapes(item, hy) {
  const c = item.colors;
  const crown = (main, gem) => [
    ["poly", [[10, hy + 2], [10, hy - 3], [13, hy], [16, hy - 4], [19, hy], [22, hy - 3], [22, hy + 2]], main],
    ["px", [[13, hy + 1], [19, hy + 1]], gem, { flat: true }],
    ["px", [[16, hy - 1]], gem, { flat: true }],
  ];
  return {
    leaf_circlet: [
      ["line", 10, hy + 1, 22, hy + 1, c.G],
      ["ellipse", 11, hy, 1.6, 1.2, c.g], ["ellipse", 14, hy - 0.5, 1.6, 1.2, c.g],
      ["ellipse", 18, hy - 0.5, 1.6, 1.2, c.g], ["ellipse", 21, hy, 1.6, 1.2, c.g],
    ],
    iron_crown: crown(c.m, "#64748b"),
    gold_crown: crown(c.y, c.r),
    goblin_crown: crown(c.g, c.y),
    dragon_helm: [
      ["poly", [[10, hy + 1], [5, hy - 5], [11, hy - 1]], c.r],
      ["poly", [[22, hy + 1], [27, hy - 5], [21, hy - 1]], c.r],
      ...crown(c.y, c.r),
    ],
    halo: [
      ["line", 12, hy - 5, 20, hy - 5, c.y, { flat: true }],
      ["line", 12, hy - 3, 20, hy - 3, c.y, { flat: true }],
      ["px", [[11, hy - 4], [21, hy - 4]], c.y, { flat: true }],
    ],
  }[item.id];
}

// Pets on a 12x12 grid
const PET_ART = {
  slime: [
    ["ellipse", 6, 8, 5.5, 4, "#4ade80"],
    ["ellipse", 4.5, 6.5, 1.2, 0.8, "#dcfce7", { flat: true }],
    ["px", [[4, 8], [7, 8]], "#052e16", { flat: true }],
  ],
  cat: [
    ["line", 9, 9, 11, 5, "#ea580c"],
    ["ellipse", 7, 9, 4, 2.5, "#fb923c"],
    ["ellipse", 4.5, 5.5, 3.5, 3, "#fb923c"],
    ["poly", [[1, 4], [2, 0], [4, 3]], "#fb923c"],
    ["poly", [[8, 4], [7, 0], [5, 3]], "#fb923c"],
    ["px", [[3, 5], [6, 5]], "#111827", { flat: true }],
    ["px", [[4, 7], [5, 7]], "#fdba74", { flat: true }],
  ],
  owl: [
    ["ellipse", 6, 7, 4.5, 5, "#a16207"],
    ["ellipse", 6, 8, 3, 3, "#fde68a"],
    ["ellipse", 4.3, 5, 1.6, 1.6, "#fef9c3", { flat: true }],
    ["ellipse", 7.7, 5, 1.6, 1.6, "#fef9c3", { flat: true }],
    ["px", [[4, 5], [7, 5]], "#111827", { flat: true }],
    ["px", [[6, 7]], "#f97316", { flat: true }],
    ["poly", [[2, 3], [3, 0], [4, 2]], "#a16207"],
    ["poly", [[10, 3], [9, 0], [8, 2]], "#a16207"],
  ],
  dragon: [
    ["poly", [[6, 5], [11, 1], [11, 6]], "#991b1b"],
    ["line", 8, 10, 11, 11, "#b91c1c"],
    ["ellipse", 7, 8.5, 4, 3, "#dc2626"],
    ["ellipse", 3.5, 5, 3, 2.5, "#ef4444"],
    ["px", [[2, 2], [4, 2]], "#facc15", { flat: true }],
    ["px", [[2, 5]], "#111827", { flat: true }],
    ["px", [[6, 9], [8, 9]], "#fca5a5", { flat: true }],
  ],
  sprout: [
    ["rect", 4, 6, 4, 6, "#92400e"],
    ["ellipse", 3, 4, 3, 2.2, "#22c55e"],
    ["ellipse", 9, 4, 3, 2.2, "#16a34a"],
    ["ellipse", 6, 2, 2, 2, "#4ade80"],
    ["px", [[5, 8], [7, 8]], "#111827", { flat: true }],
  ],
};

function petRects(id, ox, oy) {
  return gridToRects(rasterize(PET_ART[id], null, 12), 12, ox, oy);
}

function auraRects(aura, size, cx, cy, scale = 1) {
  let rects = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy) / scale;
      const tone = d < 9 ? 2 : d < 13 ? 1 : d < 17 ? 0 : -1;
      if (tone >= 0) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${aura.tones[tone]}" opacity="0.6"/>`;
    }
  }
  return rects;
}

// ---------- Hero front views ----------
// Used everywhere outside battle. headTop is where headgear sits.

const HERO_FRONT_ART = {
  barbarian: {
    headTop: 4,
    shapes: [
      ["line", 27, 5, 24, 26, "b"],
      ["poly", [[25, 3], [31, 6], [30, 11], [26, 9]], "m"],
      ["rect", 11, 24, 4, 5, "s"],
      ["rect", 18, 24, 4, 5, "s"],
      ["rect", 10, 28, 6, 3, "d"],
      ["rect", 17, 28, 6, 3, "d"],
      ["ellipse", 16, 19, 9, 6.5, "s"],
      ["ellipse", 6, 18, 3, 5, "s"],
      ["ellipse", 26, 18, 3, 5, "s"],
      ["rect", 4, 21, 5, 1, "b"],
      ["rect", 24, 21, 5, 1, "b"],
      ["line", 11, 16, 15, 17, "d", { flat: true }],
      ["line", 21, 16, 17, 17, "d", { flat: true }],
      ["px", [[15, 19], [17, 19], [15, 21], [17, 21]], "d", { flat: true }],
      ["rect", 10, 22, 13, 5, "f"],
      ["rect", 10, 22, 13, 1, "b"],
      ["ellipse", 16, 10, 5.5, 5, "s"],
      ["ellipse", 16, 14, 4.5, 3.5, "h"],
      ["ellipse", 16, 6.5, 5.5, 3, "m"],
      ["poly", [[11, 7], [5, 1], [8, 8]], "w"],
      ["poly", [[21, 7], [27, 1], [24, 8]], "w"],
      ["px", [[14, 10], [18, 10]], "e", { flat: true }],
    ],
  },
  assassin: {
    headTop: 4,
    shapes: [
      ["line", 5, 18, 2, 26, "a"],
      ["line", 27, 18, 30, 26, "a"],
      ["rect", 12, 24, 3, 7, "c"],
      ["rect", 17, 24, 3, 7, "c"],
      ["poly", [[10, 15], [22, 15], [24, 27], [8, 27]], "c"],
      ["poly", [[13, 15], [19, 15], [19, 27], [13, 27]], "C"],
      ["ellipse", 7, 19, 2.5, 4.5, "c"],
      ["ellipse", 25, 19, 2.5, 4.5, "c"],
      ["px", [[5, 23], [27, 23]], "s", { flat: true }],
      ["rect", 10, 22, 12, 2, "b"],
      ["ellipse", 16, 10, 6.5, 6.5, "C"],
      ["poly", [[16, 3], [21, 8], [16, 6], [11, 8]], "c"],
      ["ellipse", 16, 11.5, 4.5, 3.5, "k", { flat: true }],
      ["px", [[14, 11], [18, 11]], "g", { flat: true }],
      ["rect", 12, 13, 8, 2, "c"],
    ],
  },
  monk: {
    headTop: 5,
    shapes: [
      ["ellipse", 16, 26, 13, 5.5, "O"],
      ["ellipse", 16, 21, 9, 7, "o"],
      ["poly", [[11, 15], [16, 23], [21, 15]], "O"],
      ["line", 8, 21, 24, 21, "r"],
      ["ellipse", 16, 21.5, 3, 2.5, "s"],
      ["ellipse", 16, 11, 5.5, 5.5, "s"],
      ["line", 13, 11, 14, 11, "k", { flat: true }],
      ["line", 18, 11, 19, 11, "k", { flat: true }],
      ["px", [[15, 14], [16, 14], [17, 14]], "d", { flat: true }],
      ["px", [[7, 6], [25, 6], [5, 12], [27, 12]], "y", { flat: true }],
    ],
  },
  warrior: {
    headTop: 4,
    shapes: [
      ["line", 26, 3, 26, 21, "a"],
      ["line", 27, 3, 27, 21, "a"],
      ["rect", 24, 20, 5, 2, "y"],
      ["rect", 12, 25, 3, 6, "m"],
      ["rect", 17, 25, 3, 6, "m"],
      ["poly", [[10, 15], [22, 15], [23, 25], [9, 25]], "b"],
      ["rect", 9, 23, 14, 4, "B"],
      ["rect", 9, 22, 14, 1, "y"],
      ["ellipse", 23, 18, 2.5, 4, "s"],
      ["ellipse", 7, 19, 5.5, 7, "B"],
      ["ellipse", 7, 19, 3.5, 5, "M"],
      ["px", [[7, 19]], "y", { flat: true }],
      ["ellipse", 16, 10, 5.5, 5.5, "s"],
      ["ellipse", 16, 7, 5.5, 3.5, "m"],
      ["rect", 10, 8, 12, 2, "M"],
      ["line", 16, 8, 16, 12, "M"],
      ["px", [[14, 11], [18, 11]], "e", { flat: true }],
    ],
  },
  knight: {
    headTop: 5,
    shapes: [
      ["line", 26, 3, 26, 21, "a"],
      ["line", 27, 3, 27, 21, "a"],
      ["rect", 24, 20, 5, 2, "y"],
      ["rect", 12, 25, 3, 6, "m"],
      ["rect", 17, 25, 3, 6, "m"],
      ["poly", [[10, 15], [22, 15], [23, 26], [9, 26]], "a"],
      ["poly", [[12, 15], [20, 15], [20, 27], [12, 27]], "t"],
      ["line", 16, 17, 16, 24, "y", { flat: true }],
      ["line", 13, 19, 19, 19, "y", { flat: true }],
      ["ellipse", 23, 16, 3, 3.5, "m"],
      ["poly", [[2, 13], [12, 13], [11, 22], [7, 28], [3, 22]], "T"],
      ["line", 7, 15, 7, 24, "y", { flat: true }],
      ["line", 4, 18, 10, 18, "y", { flat: true }],
      ["ellipse", 16, 10, 5.5, 5.5, "a"],
      ["rect", 12, 10, 9, 2, "k", { flat: true }],
      ["line", 16, 12, 16, 14, "m", { flat: true }],
      ["poly", [[15, 5], [17, 0], [22, 2], [18, 6]], "p"],
    ],
  },
};

// Front view with gear on a 40x40 canvas (used for portraits and previews)
function heroSvg(cls, gear = {}, label = "Your hero") {
  const size = 40;
  const ox = 4;
  const oy = 5;
  const art = HERO_FRONT_ART[baseClass(cls)];
  let rects = "";
  const aura = gearById(gear.aura);
  if (aura) rects += auraRects(aura, size, 20, 21);

  const shapes = [];
  // A cape shows behind the shoulders and at the sides
  const cape = gearById(gear.back);
  if (cape) {
    shapes.push(["poly", [[9, 14], [23, 14], [27, 31], [5, 31]], cape.colors.c]);
    shapes.push(["rect", 5, 30, 22, 2, cape.colors.h]);
  }
  shapes.push(...art.shapes);
  const head = gearById(gear.head);
  if (head) shapes.push(...headGearShapes(head, art.headTop));
  rects += gridToRects(rasterize(shapes, spriteColors(cls), ART_SIZE), ART_SIZE, ox, oy);

  const pet = gearById(gear.pet);
  if (pet) rects += petRects(pet.id, 28, 28);
  // Without an aura or pet, crop the empty margin so the hero fills the frame
  const viewBox = aura || pet ? `0 0 ${size} ${size}` : "3 3 34 34";
  return `<svg class="sprite art" viewBox="${viewBox}" role="img" aria-label="${label}">${rects}</svg>`;
}

// A class's look without gear (class picker, welcome popup)
function spriteSvg(cls, label) {
  return heroSvg(cls, {}, label);
}

// The hero's back view with equipped gear, on a 40x40 canvas
function heroBackArt(cls, gear = {}) {
  const size = 40;
  const ox = 4;
  const oy = 6;
  let rects = "";
  const aura = gearById(gear.aura);
  if (aura) rects += auraRects(aura, size, 20, 22);

  const shapes = [...HERO_BACK_ART[baseClass(cls)]];
  // From behind, a cape hangs over the back
  const cape = gearById(gear.back);
  if (cape) {
    shapes.push(["poly", [[10, 13], [22, 13], [25, 30], [7, 30]], cape.colors.c]);
    shapes.push(["rect", 7, 29, 18, 2, cape.colors.h]);
  }
  const head = gearById(gear.head);
  if (head) shapes.push(...headGearShapes(head, 4));
  rects += gridToRects(rasterize(shapes, spriteColors(cls), ART_SIZE), ART_SIZE, ox, oy);

  const pet = gearById(gear.pet);
  if (pet) rects += petRects(pet.id, 27, 27);
  return `<svg class="sprite art" viewBox="0 0 ${size} ${size}" role="img" aria-label="Your hero">${rects}</svg>`;
}
