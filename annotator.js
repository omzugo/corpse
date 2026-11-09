let images = [];
let annotations = {};
let current = 0;
let view = {x:0, y:0, s:1};
let fitted = false;
let panning = false;
let firstClick;
let mode = 'upper'; 
const COLORS = { upper: [150, 205, 235], lower: [235, 125, 65] };


async function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ images, annotations } = await loadData ()); 
}

function draw() {
  background(0);
  if (images.length === 0) return; // if there is no image yet do not draw yet

  const img = getImage (images[current]);
    if (img) {
    if (!fitted) fit(img);

    push();
    translate(view.x, view.y);
    scale(view.s);
    image(img, 0, 0);
    if (firstClick) {
      noStroke();
      fill(255);
      circle(firstClick.x, firstClick.y, 1 / view.s);
    }
    const a = annotations[images[current].id];
        for (const name of ['upper', 'lower']) {
      if (a && a[name]) {
        stroke(...COLORS[name]);
        strokeWeight(1 / view.s);
        const y = a[name].y * img.height;
        line(a[name].x1 * img.width, y, a[name].x2 * img.width, y);
      }
    }
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
  if (key === 'u' || key === 'U') { mode = 'upper'; firstClick = null; return; }
  if (key === 'l' || key === 'L') { mode = 'lower'; firstClick = null; return; }
  if (keyCode === RIGHT_ARROW) {
    current = (current + 1) % images.length;
  } else if (keyCode === LEFT_ARROW) {
    current = (current - 1 + images.length) % images.length;
  } else {
    return;
  }
  keepOnlyImages([images[current].id]); // keep only the current image
  fitted = false; // the new image needs fitting
  firstClick = null; // drop any half-drawn line from the previous painting
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

function mousePressed() {
  if (!keyIsDown(SHIFT)) {          // no Shift: pan
    panning = true;
    return;
  }
  const p = mouseInImage();
  if (!firstClick) {                // first Shift-click: remember it
    firstClick = p;
    return;
  }
  addLine(firstClick, p);           // second Shift-click: make the line
  firstClick = null;                // ready for the next one
}

function mouseDragged(){
  if(panning){
    view.x+=movedX;
    view.y+= movedY;
  }
}

function mouseReleased(){
  panning = false;

}

function mouseInImage(){
  return {
    x: (mouseX-view.x) / view.s,
    y: (mouseY-view.y) / view.s,
  };
}

function addLine(a, b) {
  const img = getImage(images[current]);
  const id = images[current].id;
  if (!annotations[id]) annotations[id] = {}; // this image has no record yet: start one
    annotations[id][mode] = {
    y: a.y / img.height,                // the first click's height, as a fraction
    x1: min(a.x, b.x) / img.width,      // the left end, whichever click was further left
    x2: max(a.x, b.x) / img.width,      // the right end
  };
  if (mode === 'upper') mode = 'lower';
}