// TODO: disable once done
// p5.disableFriendlyErrors = true; // disables FES

const sketch = ( s ) => {
  "use strict";

  const RainDrop = classes.RainDrop;

  let raindropNum; 
  let rainDrops = [];
  let rainSplashes = [];
  let isPressed = false;

  let hngShifts = [];
  let hngN;
  
  let colorForeground = s.color('#FBDD11'); 
  let colorBackground = s.color('#2A2A2E');

  // let bYellow = s.color('#FBDD11'); 
  // let bGreen = s.color('#4CBF4B');
  // let bGrey = s.color('#2A2A2E');
  // let bDarkGrey = s.color('#212124');
  
  let hng;
  let banano;
  let banano2;
  let bt;

  s.preload = () => {
    hng = s.loadImage('./assets/images/hng.svg');
    banano = s.loadImage('./assets/images/banano-logo.svg');
    banano2 = s.loadImage('./assets/images/banano-logo-2.svg');
  }

  s.setup = () => {
    let divWidth = document.getElementById("rain").clientWidth;
    let divHeight = document.getElementById("rain").clientHeight;
    let myCanvas = s.createCanvas(divWidth, divHeight);
    myCanvas.parent('rain');

    s.imageMode(s.CENTER);
    bt = banano;

    hngN = 7;

    // s.createCanvas(800, 340);
    raindropNum = Math.floor(s.windowWidth/3);
    for(let i = 0; i < raindropNum; i++)
      rainDrops.push(new RainDrop(s, colorBackground, colorForeground));
  }

  s.draw = () => {
    // use the background color RGB values to create an RGBA value for the background
    s.background('rgba(' + s.red(colorBackground) + ',' 
    + s.green(colorBackground) + ',' 
    + s.blue(colorBackground) + ',' 
    + 0.5 + ')');

    s.image(hng, 0.8*s.width, 0.75*s.height);

    // hngIt(10);
    s.image(bt, s.width/2, s.height/4);

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

  s.mouseReleased = () => {
    // s.image(hng, 500*s.random(), 500*s.random());
    // console.log('released');

    [colorBackground, colorForeground] = [colorForeground, colorBackground]
    bt = isPressed ? banano : banano2;
    isPressed = !isPressed;
  }


  s.windowResized = () => {
      var divWidth = document.getElementById("rain").clientWidth;
      var divHeight = document.getElementById("rain").clientHeight;
      s.resizeCanvas(divWidth, divHeight);
  }

  const hngIt = (n=1) => {

    let shift = s.width / (n);

    for (let i = 1; i < n; i++){
      s.image(hng, shift * (i), 
        0.7*s.height);
    }

    // for (let i = 1; i < n; i++){
    //   s.noiseSeed(i);
    //   s.image(hng, shift * (i + s.noise(s.millis() / 1000)), 
    //     0.7*s.height + shift*s.noise(s.millis() / 1000));
    // }
    
  }
};
  
let myp5 = new p5(sketch, 'rain');