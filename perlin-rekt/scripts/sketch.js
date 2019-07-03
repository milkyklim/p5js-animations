// TODO: check, maybe this is not the best way

// p5.disableFriendlyErrors = true;

const sketch = (s) => {
  "use strict";
  // to set constants 
  const NVERTICES = 150;
  const NLINES = 20;
  const NWORDS = 5;
  const FONTSIZE = 96;
  const REKT = 'reKt';
  const FONTPATH = 'assets/fonts/Flatiron/Flatiron Casual.ttf';

  const NAME = "rekt";


  // globals
  let font;
  let shift = 0;
  let letters;

  // positions of the font letters
  let openfontPath;
  let unitsPerEm;
  let fontScale;
  let boundingBox; // left to right doesn't include weird spaces in the end

  s.preload = () => {
    font = s.loadFont(FONTPATH);
    opentype.load(FONTPATH, (e, f) => {
      if (e)
        console.log(e);
      else {
        openfontPath = f.getPath(REKT, 0, 0, FONTSIZE);
        boundingBox = openfontPath.getBoundingBox(REKT, 0, 0, FONTSIZE);
        letters = f.stringToGlyphs(REKT, 0, 0, FONTSIZE);
        unitsPerEm = f.unitsPerEm;
        fontScale = (1 / unitsPerEm) * FONTSIZE;
      }
    });
  }

  s.setup = () => {
    let divWidth = document.getElementById(NAME).clientWidth;
    let divHeight = document.getElementById(NAME).clientHeight;
    let sketchCanvas = s.createCanvas(divWidth, divHeight);
    sketchCanvas.parent(NAME);

    // createCanvas(640, 480);
    s.background(160);
    s.frameRate(10);
    s.textFont(font);
    s.textSize(FONTSIZE);
    s.textAlign(s.CENTER, s.CENTER);
    s.strokeWeight(2);
  }

  s.draw = () => {
    // hack to be sure that the value is initialized
    if (boundingBox !== undefined) {
      s.background(160);
      drawWords(NWORDS, s.width * .5, letters, boundingBox);
      drawLinesWithVertices(NLINES, NVERTICES);
      // noLoop();
    }
  }

  // always centerered text; works best for one word
  function drawLetters(letters, bb) {
    let gShifts = {
      'x': s.width / 2,
      'y': s.height / 2
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
      s.push();
      s.translate(gShifts.x - textWidth / 2, gShifts.y + textHeight / 2);
      s.beginShape();
      drawLetter(letters, j);
      s.endShape(s.CLOSE);
      // DEBUG:
      // drawBoundingBox(bb);
      s.pop();
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
        s.vertex(jitteredPos.x + xOffset, jitteredPos.y);
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
        s.vertex(jitteredPos.x + xOffset, jitteredPos.y);
      } else {
        innerIdx = j + 1;
        break;
      }
    }

    s.beginContour();
    for (let j = innerIdx; j < nPoints; j++) {
      let cmd = letter.getPath(0, 0, FONTSIZE).commands[j];
      // vertex(cmd.x + xOffset, cmd.y);
      let jitteredPos = jitterPositions(cmd);
      s.vertex(jitteredPos.x + xOffset, jitteredPos.y);
    }
    s.endContour();
  }

  // nWords centered rekt words
  const drawWords = (nWords, x, letters, bb) => {
    let yOffset = Math.round(s.height / (nWords + 1)); // this one seems to be correct
    for (let y = yOffset; y < s.height; y += yOffset) {
      console.log(y);
      if (y == yOffset)
        s.noFill();
      else {
        let color = s.map(y, yOffset, s.height, 255, 0);
        s.fill(color);
      }
      let gShifts = {
        'x': s.width / 2,
        'y': y
      };
      drawLetters(letters, bb, gShifts);
    }
  }

  function jitterPositions(pos) {
    let maxShift = 20;
    let curShift = 0.01;
    shift = shift + 0.06;

    let xShift = s.map(s.noise(shift), 0, 1, -maxShift, maxShift);
    let yShift = s.map(s.noise(shift), 0, 1, -maxShift, maxShift);

    let newPos = {
      'x': pos.x + xShift,
      'y': pos.y + yShift
    };
    return newPos;
  }

  // DEBUG: function
  function drawBoundingBox(bb) {
    s.rectMode(s.CORNERS);
    s.noFill();
    s.strokeWeight(3);
    s.rect(bb.x1, bb.y1, bb.x2, bb.y2);

    // reset the defaults
    s.strokeWeight(1);
    s.fill(255, 0, 0);
  }

  function getInWordOffset(letters, letterIdx) {
    let xOffset = 0;
    for (let k = 0; k < letterIdx; k++)
      xOffset += letters[k].advanceWidth * fontScale;
    return xOffset;
  }

  s.windowResized = () => {
    let divWidth = document.getElementById(NAME).clientWidth;
    let divHeight = document.getElementById(NAME).clientHeight;
    s.resizeCanvas(divWidth, divHeight);
  }

  // function mousePressed() {
  //   saveFrames('frames/out', 'png', 5, 10, function(data) {
  //     print(data);
  //   });
  // }

  // draw curved lines
  function drawLinesWithVertices(nLines, nVertices) {
    let xOffset = s.height / nLines;
    let yOffset = s.width / nVertices;
    let maxShift = 50;
    let curShift = 0.01;
    s.noFill();
    for (let h = 0; h <= (s.height + xOffset); h += xOffset) {
      s.beginShape();
      for (let w = 0; w <= (s.width + yOffset); w += yOffset) {
        shift = shift + 0.06;
        let yShift = s.map(s.noise(shift), 0, 1, -maxShift, maxShift);
        s.vertex(w, h + yShift);
      }
      s.endShape();
    }
  }


}

let myp5 = new p5(sketch, 'rekt');