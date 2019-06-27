var classes
(c => {
  "use strict"; "use strong"
      // the RainSplash object
      class RainSplash{
        // it gets ist X, Y, Z, and SIZE values from the RainDrop object that creates it
        constructor(sketch, _x, _y, _z, _size, colBG, colFG){
          this.splashFrames = 8;
          this.s = sketch;
          this.x = _x;
          this.y = _y;
          this.z = _z;
          this.size = _size;

          this.colBG = colBG;
          this.colFG = colFG;

          this.change = 1;// this value is the current frame for the animation
        }
        // each time update() is called it increases the current frame
        update(){
          this.change++;
        }
        // the draw() function is similar to that of the RainDrop object
        // but CHANGE influences the stroke color
        draw(){
          this.s.noFill();
          this.s.stroke(this.s.lerpColor(this.colBG, this.colFG, this.z/this.splashFrames * this.change));
          this.s.strokeWeight(this.size);
          this.s.ellipse(this.x, this.y, this.size * this.change * 3, this.size * this.change);
        }
      
      }
      c.RainSplash = RainSplash;
    })(classes || (classes = {}))