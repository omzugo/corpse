let images = [];
let annotations = {};
let current = 0;
let view = {x:0, y:0, s:1};
let fitted = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ images, annotations } = await loadData ()); 
}

function draw() {
  background(0);
  if (images.length === 0) return; // if there is no image yet do not draw yet

  const img = getImage (images[current]);
  if (img) {
  if(!fitted) fit(img);

  push();
  translate(view.x, view.y);
  scale(view.s);
  image(img,0,0);
  pop();
  }
}

function fit(img) {
  view.s = min(width/img.width, height / img.height);
  view.x = (width - img.width * view.s) / 2;
  view.y = (height - img.height * view.s) / 2;
  fitted = true;
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
  current = (current + 1) % images.length;
  }
  if (keyCode === LEFT_ARROW){
  current = (current - 1  + images.length) % images.length;
  }
  keepOnlyImages([images[current].id]); // keep only current image
  fitted = false; // the new image needs fitting
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  fitted = false; // the new image needs fitting
}

function mouseWheel (event) {
  const zoom = event.delta > 0 ? 0.9 : 1.1;
  const newS = constrain(view.s * zoom, 0.05, 8);
  view.x = mouseX-(mouseX - view.x) * (newS / view.s);
  view.y = mouseY - (mouseY - view.y) * (newS / view.s);
  view.s = newS;
  return false;
}
