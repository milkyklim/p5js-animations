// TODO: disable once done
// p5.disableFriendlyErrors = true; // disables FES

const sketch = ( s ) => {

    "use strict"; "use strong"

    const RainDrop = classes.RainDrop;
    // don't need actual import
    const RainSplash = classes.RainSplash;

    // local 
    let raindropNum; // max number of drops to be drawn on the screen
    let rainDrops = []; // the array holding the RainDrop objects
    let rainSplashes = []; // the array holding the RainSplash objects
    let splashFrames = 8; // number of frames for the splash animation
    let isPressed = false; // bollean to check if mouse/screen was pressed
    
    // local but passed 
    let colFG = s.color(0, 0, 0);
    let colBG = s.color(255, 255, 255);

    let bYellow = s.color('#FBDD11');
    let bGreen = s.color('#4CBF4B');
    let bGrey = s.color('#2A2A2E');
    let bDarkGrey = s.color('#212124');
  

    s.setup = () => {      
        // find the size of the underlying div
        // var divWidth = $("#rain").width();
        // var divHeight = $("#rain").height();
        // the canvas is defined as half the height and width of the window
        // var myCanvas = createCanvas(divWidth, divHeight);
      
        s.createCanvas(800, 340);
        // myCanvas.parent('rain');
        // Populate the rainDrops array with RainDrop objects
        raindropNum = 800/3; //windowWidth/3;
        for(var i = 0; i < raindropNum; i++){
          rainDrops.push(new RainDrop(s, colBG, colFG, 3));
        }
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
        s.background('rgba(' + s.red(colBG) + ',' + s.green(colBG) + ',' + s.blue(colBG) + ',' + 0.5 + ')');
        // iterate thgough the rainDrops array to update and draw its objects
        for(let i = 0; i < rainDrops.length; i++){
          rainDrops[i].update();
          rainDrops[i].draw();
        }
        // iterate through rhe rainSplashes array to update and draw its objects
        for(let j = 0; j < rainSplashes.length; j++){
          // if the frame of a RainSplash is less that the max value of frames we update and draw it
          if(rainSplashes[j].change < splashFrames){
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
      //w

  
        //when the window is resized the canvas is resized accordingly
        function windowResized(){
            var divWidth = $('rain').width();
            var divHeight = $('rain').height();
            s.resizeCanvas(divWidth, divHeight);
        }
        // this function switches the foreground and background colors
        function invertColor(){
            var temp = colBG;
            colBG = colFG;
            colFG = temp;
        }



  };
  
let myp5 = new p5(sketch, 'rain');