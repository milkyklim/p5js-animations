// TODO: check, maybe this is not the best way
// to set constants 
const NVERTICES = 150;
const NLINES = 20;
const NWORDS = 5;
const FONTSIZE = 96;
const REKT = 'reKt';
const FONTPATH = 'assets/fonts/Flatiron/Flatiron Casual.ttf';

// globals
var font;
var shift = 0;
var letters;

// positions of the font letters
var openfontPath;
var unitsPerEm;
var fontScale;
var boundingBox; // left to right doesn't include weird spaces in the end

function preload() {
  font = loadFont(FONTPATH);
  opentype.load(FONTPATH, function (err, font1) {
    if (err)
      console.log(err);
    else {
      openfontPath = font1.getPath(REKT, 0, 0, FONTSIZE);
      boundingBox = openfontPath.getBoundingBox(REKT, 0, 0, FONTSIZE);
      letters = font1.stringToGlyphs(REKT, 0, 0, FONTSIZE);
      unitsPerEm = font1.unitsPerEm;
      fontScale = (1 / unitsPerEm) * FONTSIZE;
    }
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(640, 480);
  background(160);
  frameRate(10);
  textFont(font);
  textSize(FONTSIZE);
  textAlign(CENTER, CENTER);
  strokeWeight(2);
}

function draw() {
  // hack to be sure that the value is initialized
  if (boundingBox !== undefined) {
    background(160);
    drawWords(NWORDS, width * .5, letters, boundingBox);
    drawLinesWithVertices(NLINES, NVERTICES);
    // noLoop();
  }
}

// always centerered text; works best for one word
function drawLetters(letters, bb) {
  let gShifts = {
    'x': width / 2,
    'y': height / 2
  };
  drawLetters(letters, bb, gShifts);
}

function drawLetters(letters, bb, gShifts) {
  // imp: 
  // x0 is the left-most pixel
  // y0 is the baseline
  let textWidth = (bb.x2 - bb.x1);
  let textHeight = (bb.y2 - bb.y1);

  for (let j = 0; j < letters.length; j++) {
    push();
    translate(gShifts.x - textWidth / 2, gShifts.y + textHeight / 2);
    beginShape();
    drawLetter(letters, j);
    endShape(CLOSE);
    // DEBUG:
    // drawBoundingBox(bb);
    pop();
  }
}

function drawLetter(letters, letterIdx) {
  let xOffset = getInWordOffset(letters, letterIdx);
  let nPoints = letters[letterIdx].getPath(0, 0, FONTSIZE).commands.length;

  if (letterIdx != 0) { // if not R
    for (let i = 0; i < nPoints; i++) {
      let cmd = letters[letterIdx].getPath(0, 0, FONTSIZE).commands[i];
      // vertex(cmd.x + xOffset, cmd.y);
      let jitteredPos = jitterPositions(cmd);
      vertex(jitteredPos.x + xOffset, jitteredPos.y);
    }
  } else {
    fixR(letters[letterIdx], nPoints, xOffset);
  }
}

// fix the hole in the R letter
function fixR(letter, nPoints, xOffset) {
  // todo: this fix tou have to iterate though all cmd values 
  // and find those that are Z -> this is the termination symbol
  let innerIdx = nPoints;
  for (let j = 0; j < nPoints; j++) {
    let cmd = letter.getPath(0, 0, FONTSIZE).commands[j];
    if (cmd.type != 'Z') { // termination type
      // vertex(cmd.x + xOffset, cmd.y);
      let jitteredPos = jitterPositions(cmd);
      vertex(jitteredPos.x + xOffset, jitteredPos.y);
    } else {
      innerIdx = j + 1;
      break;
    }
  }

  beginContour();
  for (let j = innerIdx; j < nPoints; j++) {
    let cmd = letter.getPath(0, 0, FONTSIZE).commands[j];
    // vertex(cmd.x + xOffset, cmd.y);
    let jitteredPos = jitterPositions(cmd);
    vertex(jitteredPos.x + xOffset, jitteredPos.y);
  }
  endContour();
}

// nWords centered rekt words
function drawWords(nWords, x, letters, bb) {
  let yOffset = Math.round(height / (nWords + 1)); // this one seems to be correct
  for (let y = yOffset; y < height; y += yOffset) {
    console.log(y);
    if (y == yOffset)
      noFill();
    else {
      let color = map(y, yOffset, height, 255, 0);
      fill(color);
    }
    let gShifts = {
      'x': width / 2,
      'y': y
    };
    drawLetters(letters, bb, gShifts);
  }
}

function jitterPositions(pos) {
  let maxShift = 20;
  let curShift = 0.01;
  shift = shift + 0.06;

  let xShift = map(noise(shift), 0, 1, -maxShift, maxShift);
  let yShift = map(noise(shift), 0, 1, -maxShift, maxShift);

  let newPos = {
    'x': pos.x + xShift,
    'y': pos.y + yShift
  };
  return newPos;
}

// DEBUG: function
function drawBoundingBox(bb) {
  rectMode(CORNERS);
  noFill();
  strokeWeight(3);
  rect(bb.x1, bb.y1, bb.x2, bb.y2);

  // reset the defaults
  strokeWeight(1);
  fill(255, 0, 0);
}

function getInWordOffset(letters, letterIdx) {
  let xOffset = 0;
  for (let k = 0; k < letterIdx; k++)
    xOffset += letters[k].advanceWidth * fontScale;
  return xOffset;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// function mousePressed() {
//   saveFrames('frames/out', 'png', 5, 10, function(data) {
//     print(data);
//   });
// }

// draw curved lines
function drawLinesWithVertices(nLines, nVertices) {
  let xOffset = height / nLines;
  let yOffset = width / nVertices;
  let maxShift = 50;
  let curShift = 0.01;
  noFill();
  for (let h = 0; h <= (height + xOffset); h += xOffset) {
    beginShape();
    for (let w = 0; w <= (width + yOffset); w += yOffset) {
      shift = shift + 0.06;
      let yShift = map(noise(shift), 0, 1, -maxShift, maxShift);
      vertex(w, h + yShift);
    }
    endShape();
  }
}