var classes
(c => {
  "use strict"; "use strong"
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
      c.RainSplash = RainSplash;
    })(classes || (classes = {}))