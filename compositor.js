// Compositor: your rewrite. This is the page that goes live.
//   1. load the data; pick a random top, middle and bottom
//   2. line up the seams: scale and shift the top and bottom so their seams match the middle's
//   3. load those three images and draw the strips
//   4. Space for a new figure; click a strip to lock it
//   5. credits with links
//   6. download, ⌘-click to annotate, day / night
// The working prototype is in ../exquisite-corpse/compositor.js if you want to compare.

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
}
