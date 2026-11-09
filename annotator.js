// Annotator: your rewrite. Build it one step at a time; each step should run before you start the next.
//   1. show one image, fitted to the window; ← → to move through the collection
//   2. zoom with the scroll wheel; hold Space and drag to pan
//   3. U / L to choose a line, then click twice to draw it
//   4. drag a line's ends
//   5. save after each change (saveAnnotation, in given.js)
//   6. the loupe
//   7. strip checkboxes, reject, next unannotated, and the text
// The working prototype is in ../exquisite-corpse/annotator.js if you want to compare.

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
}
