let images = [];
let annotations = {};
let current = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ images, annotations } = await loadData ()); 
}

function draw() {
  background(0);
  if (images.length === 0) return; // if there is no image yet do not draw yet

  const img = getImage (images[current]);
  if (img) {
    const s = min(width / img.width, height / img.height);
    const w = img.width * s;
    const h = img.height * s;
    const x = (width - w) / 2;
    const y = (height - h) / 2;
    image (img, x, y, w, h); 
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
  current = (current + 1) % images.length;
  }
  if (keyCode === LEFT_ARROW){
  current = (current - 1  + images.length) % images.length;
  }
  keepOnlyImages([images[current].id]); // keep only current image
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}