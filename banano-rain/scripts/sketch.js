p5.disableFriendlyErrors = true;

const sketch = (s) => {
  "use strict";

  const RainDrop = classes.RainDrop;

  let rainDrops = [];
  let rainSplashes = [];
  let isPressed = false;
  
  let colorForeground = s.color('#FBDD11'); 
  let colorBackground = s.color('#2A2A2E');
  
  let hngImage;
  let bananoLogo;
  let bananoLogoInv;
  let bananoLogoCurrent;

  s.preload = () => {
    hngImage = s.loadImage('./assets/images/hng.svg');
    bananoLogo = s.loadImage('./assets/images/banano-logo.svg');
    bananoLogoInv = s.loadImage('./assets/images/banano-logo-2.svg');
  }

  s.setup = () => {
    let divWidth = document.getElementById("rain").clientWidth;
    let divHeight = document.getElementById("rain").clientHeight;
    let sketchCanvas = s.createCanvas(divWidth, divHeight);
    sketchCanvas.parent('rain');

    s.imageMode(s.CENTER);
    bananoLogoCurrent = bananoLogo;

    // s.createCanvas(800, 340);
    let raindropNum = Math.floor(s.windowWidth/2);
    for(let i = 0; i < raindropNum; i++)
      rainDrops.push(new RainDrop(s, colorBackground, colorForeground));
  }

  s.draw = () => {
    // use the background color RGB values to create an RGBA value for the background
    s.background('rgba(' + s.red(colorBackground) + ',' 
      + s.green(colorBackground) + ',' 
      + s.blue(colorBackground) + ',' 
      + 0.5 + ')');

    s.image(hngImage, 0.8*s.width, 0.75*s.height);

    let scale = 1;
    if (s.width < bananoLogoCurrent.width)
      scale = s.width / bananoLogoCurrent.width;
    if (s.height < bananoLogoCurrent.height){
      let tmp = s.height / bananoLogoCurrent.height;
      scale = tmp < scale ? tmp : scale;
    }

    s.image(bananoLogoCurrent, s.width/2, s.height/4, 
      scale*bananoLogoCurrent.width, scale*bananoLogoCurrent.height);

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
    // random fast hng on screen
    s.image(hngImage, s.width*s.random(), s.height*s.random());
    [colorBackground, colorForeground] = [colorForeground, colorBackground]
    bananoLogoCurrent = isPressed ? bananoLogo : bananoLogoInv;
    isPressed = !isPressed;
  }

  s.windowResized = () => {
      let divWidth = document.getElementById("rain").clientWidth;
      let divHeight = document.getElementById("rain").clientHeight;
      s.resizeCanvas(divWidth, divHeight);
  }
};
  
let myp5 = new p5(sketch, 'rain');