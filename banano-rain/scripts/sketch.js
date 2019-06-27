// TODO: disable once done
// p5.disableFriendlyErrors = true; // disables FES

const sketch = ( s ) => {
  "use strict";

  const RainDrop = classes.RainDrop;

  let raindropNum; 
  let rainDrops = [];
  let rainSplashes = [];
  let isPressed = false;
  
  let colorForeground = s.color('#FBDD11'); 
  let colorBackground = s.color('#2A2A2E');

  // let bYellow = s.color('#FBDD11'); 
  // let bGreen = s.color('#4CBF4B');
  // let bGrey = s.color('#2A2A2E');
  // let bDarkGrey = s.color('#212124');
  
  s.setup = () => {
    let divWidth = document.getElementById("rain").clientWidth;
    let divHeight = document.getElementById("rain").clientHeight;
    let myCanvas = s.createCanvas(divWidth, divHeight);
    myCanvas.parent('rain');

    // s.createCanvas(800, 340);
    raindropNum = Math.floor(s.windowWidth/3);
    for(let i = 0; i < raindropNum; i++)
      rainDrops.push(new RainDrop(s, colorBackground, colorForeground));
  }

  s.draw = () => {
    //Check to see if screen or mouse are pressed
    if(s.mouseIsPressed || s.touches.length != 0 /* || touchIsDown */) {
      if(!isPressed) {
        [colorBackground, colorForeground] = [colorForeground, colorBackground]
        isPressed = true;
      }
    } 
    else {
      isPressed = false;
    }
    // use the background color RGB values to create an RGBA value for the background
    s.background('rgba(' + s.red(colorBackground) + ',' 
      + s.green(colorBackground) + ',' 
      + s.blue(colorBackground) + ',' 
      + 0.5 + ')');
    for(let i = 0; i < rainDrops.length; i++) {
      let rs = rainDrops[i].update();
      if (rs != null)
        rainSplashes.push(rs);
      rainDrops[i].draw();
    }
    for(let j = 0; j < rainSplashes.length; j++) {
      rainSplashes[j].update();
      rainSplashes[j].draw();
      if(rainSplashes[j].change >= rainSplashes[j].splashFrames){
        rainSplashes.splice(j, j + 1);
      } 
    }
  }
  
  s.windowResized = () => {
      var divWidth = document.getElementById("rain").clientWidth;
      var divHeight = document.getElementById("rain").clientHeight;
      s.resizeCanvas(divWidth, divHeight);
  }
};
  
let myp5 = new p5(sketch, 'rain');