const sketch = ( s ) => {
    let raindropNum; // max number of drops to be drawn on the screen
    let rainDrops = []; // the array holding the RainDrop objects
    let rainSplashes = []; // the array holding the RainSplash objects
    let maxSpeed = 6; // max speed of the drops
    let splashFrames = 8; // number of frames for the splash animation
    let horizon; // the Y position of the screen in which splashes cease to appear
    let colFG; // foreground color
    let colBG; // background color
    let isPressed = false; // bollean to check if mouse/screen was pressed

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
        horizon = s.height/2;
        colFG = s.color(0, 0, 0);
        colBG = s.color(255, 255, 255);
        // Populate the rainDrops array with RainDrop objects
        raindropNum = 800/3; //windowWidth/3;
        for(var i = 0; i < raindropNum; i++){
          rainDrops.push(new RainDrop(3));
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
        for(var i = 0; i < rainDrops.length; i++){
          rainDrops[i].update();
          rainDrops[i].draw();
        }
        // iterate through rhe rainSplashes array to update and draw its objects
        for(var j = 0; j < rainSplashes.length; j++){
          // if the frame of a RainSplash is less that the max value of frames we update and draw it
          if(rainSplashes[j].change < splashFrames){
            rainSplashes[j].update();
            rainSplashes[j].draw();
          // else we update, draw it and then remove it from the array
          } else{
            rainSplashes[j].update();
            rainSplashes[j].draw();
            rainSplashes.splice(j, j+1);
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


      class RainDrop{
        // the only input the object takes is size
        constructor(_size){
          this.size = _size;
          this.end = s.random(horizon, s.height);// the Y position in which the object will restart
          this.x = s.random(-80, s.width + 80); // X position, has an offset to compensate for the noise
          this.y = s.random(s.height); // Y position
          // Z position, defined as a value from 0 to 1 mapped from the distance between horizon and canvas height
          this.z = s.map(this.end, horizon, s.height, 0, 1)
          // speed, if the distance to travel is less then the speed is lower
          this.speed = s.map(this.end, 0, s.height, 1, maxSpeed);
        }
        // function to update the RainDrop values
        update(){
          // if the Y position is less that the END position, then the drop keeps falling
          if(this.y < this.end){
            this.x += s.map(s.noise(s.millis()/1000), 0, 1, -1, 1)*2; //we add noise to the X position to emulate wind
            this.y += this.speed;
          } else{
          //else it creates a new RainSplash object on the END position
            rainSplashes.push(new RainSplash(this.x, this.y, this.z, (this.y / s.height) * 1));
            // values are reset
            this.end = s.random(horizon, s.height);
            this.x = s.random(-80, s.width + 80);
            this.y = 0;
            this.z = s.map(this.end, horizon, s.height, 0, 1);
            this.speed = s.map(this.end, 0, s.height, 1, maxSpeed);
          }
        }
        // function to draw the object
        draw(){
          // we use the Z value to interpolate from the FG and BG colors to give a sense of depth
          s.stroke(s.lerpColor(colBG, colFG, this.z));
          s.strokeWeight((255-this.z)/100); // Z value also influences the width of the raindrop
          s.line(this.x, this.y, this.x, this.y + this.size);
        }
      
      }
      // the RainSplash object
      class RainSplash{
        // it gets ist X, Y, Z, and SIZE values from the RainDrop object that creates it
        constructor(_x, _y, _z, _size){
          this.x = _x;
          this.y = _y;
          this.z = _z;
          this.size = _size;
          this.change = 1;// this value is the current frame for the animation
        }
        // each time update() is called it increases the current frame
        update(){
          this.change++;
        }
        // the draw() function is similar to that of the RainDrop object
        // but CHANGE influences the stroke color
        draw(){
          s.noFill();
          s.stroke(s.lerpColor(colBG, colFG, this.z/splashFrames * this.change));
          s.strokeWeight(this.size);
          s.ellipse(this.x, this.y, this.size * this.change * 3, this.size * this.change);
        }
      
      }

  };
  
let myp5 = new p5(sketch, 'rain');