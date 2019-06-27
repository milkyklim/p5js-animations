// TODO: disable once done
// p5.disableFriendlyErrors = true; // disables FES

const sketch = ( s ) => {
    "use strict"; "use strong"

    const RainDrop = classes.RainDrop;
 
    let raindropNum; 
    let rainDrops = [];
    let rainSplashes = [];
    let isPressed = false; // boolean to check if mouse/screen was pressed
    
    let colorForeground = s.color('#FBDD11'); 
    let colorBackground = s.color('#2A2A2E');

    let bYellow = s.color('#FBDD11'); 
    let bGreen = s.color('#4CBF4B');
    let bGrey = s.color('#2A2A2E');
    let bDarkGrey = s.color('#212124');
  
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
        if(s.mouseIsPressed || s.touches.length != 0 /* || touchIsDown */){
          if(!isPressed){
            invertColor();
            isPressed = true;
          }
        } else{
          isPressed = false;
        }
        // use the background color RGB values to create an RGBA value for the background
        s.background('rgba(' + s.red(colorBackground) + ',' + s.green(colorBackground) + ',' + s.blue(colorBackground) + ',' + 0.5 + ')');
        // iterate thgough the rainDrops array to update and draw its objects
        for(let i = 0; i < rainDrops.length; i++){
          let rs = rainDrops[i].update();
          if (rs != null)
            rainSplashes.push(rs);
          rainDrops[i].draw();
        }
        // iterate through rhe rainSplashes array to update and draw its objects
        for(let j = 0; j < rainSplashes.length; j++){
          // if the frame of a RainSplash is less that the max value of frames we update and draw it
          if(rainSplashes[j].change < rainSplashes[j].splashFrames){
            rainSplashes[j].update();
            rainSplashes[j].draw();
            
          // else we update, draw it and then remove it from the array
          } else{
            rainSplashes[j].update();
            rainSplashes[j].draw();
            rainSplashes.splice(j, j + 1);
          }
        }
      }
      

  
        //when the window is resized the canvas is resized accordingly
        s.windowResized = () => {
            var divWidth = document.getElementById("rain").clientWidth;
            var divHeight = document.getElementById("rain").clientHeight;
            s.resizeCanvas(divWidth, divHeight);
        }
        // this function switches the foreground and background colors
        const invertColor = () => {
            let temp = colorBackground;
            colorBackground = colorForeground;
            colorForeground = temp;
        }
  };
  
let myp5 = new p5(sketch, 'rain');