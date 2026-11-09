// GIVEN CODE: plumbing you use but don't need to rewrite. Load it before your own sketch.
//
// Annotation format (data/annotations.json); every number is a fraction 0..1 of the image's size:
// { "<imageId>": { "upper": { "y", "x1", "x2" },   <- a horizontal line: its height, left end, right end
//                  "lower": { "y", "x1", "x2" },
//                  "reject": true?,
//                  "no": ["top"]? } }              <- strips this image must not supply
// Image list (data/images.json): [{ id, title, artist, date, medium, source, page, file, thumb, w, h }, ...]
//   w, h are the image's proportions (its thumbnail's size), available before the image loads.

const ROLES = ['top', 'middle', 'bottom'];

// Load the image list and the annotations. Use with await, inside an async setup():
//   ({ images, annotations } = await loadData());
async function loadData() {
  const images = await (await fetch('data/images.json')).json();
  const res = await fetch('data/annotations.json');
  const annotations = res.ok ? await res.json() : {};
  return { images, annotations };
}

// Save one image's annotation record (or delete it, if the record is empty). Needs server.py running.
function saveAnnotation(id, record) {
  const empty = !record || !Object.keys(record).length;
  return fetch('save', { method: 'POST', body: JSON.stringify({ id, record: empty ? null : record }) });
}

// Can this image supply this strip? It needs the right lines (a top needs an upper line, a middle needs
// both with the lower one below, a bottom needs a lower line), and mustn't be rejected or excluded.
function canSupply(a, role) {
  if (!a || a.reject || (a.no && a.no.includes(role))) return false;
  if (role === 'top') return !!a.upper;
  if (role === 'bottom') return !!a.lower;
  return !!(a.upper && a.lower) && a.lower.y - a.upper.y > 0.005;
}

// ---- images ----
// getImage(entry) returns the loaded p5.Image, or null while it's still loading; call it every frame
// from draw(). keepOnlyImages([ids]) frees the rest (big paintings take ~36 MB each in memory).
// Why not p5's loadImage: it fetches each file twice and leaves the first download half-read; with big
// paintings those pile up until the browser can't load anything else.

const imgCache = {};

function getImage(entry) {
  if (imgCache[entry.id]) return imgCache[entry.id].ready ? imgCache[entry.id].img : null;
  const slot = imgCache[entry.id] = { ready: false, img: null };
  const el = new Image();
  el.onload = () => {
    if (imgCache[entry.id] !== slot) return; // dropped while loading
    const img = createImage(el.naturalWidth, el.naturalHeight);
    img.drawingContext.drawImage(el, 0, 0);
    img.modified = true;
    slot.img = img; slot.ready = true;
  };
  el.onerror = () => { slot.failed = true; };
  el.src = entry.file;
  return null;
}

function keepOnlyImages(ids) {
  const keep = new Set(ids);
  for (const id in imgCache) {
    if (keep.has(id)) continue;
    const img = imgCache[id].img;
    if (img && img.canvas) { img.canvas.width = 0; img.canvas.height = 0; } // release the pixels now
    delete imgCache[id];
  }
}

// ---- captions ----

// Cut a caption line to at most 35 characters, ending in "…" when shortened.
function shortLine(s) {
  return s.length <= 35 ? s : s.slice(0, 34).trimEnd() + '…';
}

// Make text safe to put inside HTML.
function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
