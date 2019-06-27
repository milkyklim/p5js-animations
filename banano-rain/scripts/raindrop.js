var classes
(c => {
  "use strict"; "use strong"

  const RainSplash = classes.RainSplash;

  class RainDrop{
      // the only input the object takes is size
      constructor(sketch, colBG, colFG, _size){
        this.s = sketch;

        // DEBUG: goes to raindrop
        this.maxSpeed = 6; // max speed of the drops
        this.horizon = this.s.height/2; // the Y position of the screen in which splashes cease to appear

        this.colBG = colBG;
        this.colFG = colFG;

        this.size = _size;
        this.end = this.s.random(this.horizon, this.s.height);// the Y position in which the object will restart
        this.x = this.s.random(-80, this.s.width + 80); // X position, has an offset to compensate for the noise
        this.y = this.s.random(this.s.height); // Y position
        // Z position, defined as a value from 0 to 1 mapped from the distance between horizon and canvas height
        this.z = this.s.map(this.end, this.horizon, this.s.height, 0, 1)
        // speed, if the distance to travel is less then the speed is lower
        this.speed = this.s.map(this.end, 0, this.s.height, 1, this.maxSpeed);
      }
      // function to update the RainDrop values
      update(){

        let res = null;

        // if the Y position is less that the END position, then the drop keeps falling
        if(this.y < this.end){
          this.x += this.s.map(this.s.noise(this.s.millis()/1000), 0, 1, -1, 1)*2; //we add noise to the X position to emulate wind
          this.y += this.speed;
        } else {
        //else it creates a new RainSplash object on the END position
          // rainSplashes.push(new RainSplash(this.x, this.y, this.z, (this.y / this.height) * 1));
          res = new RainSplash(this.s, this.x, this.y, this.z, (this.y / this.s.height) * 1, this.colBG, this.colFG)
          // values are reset
          this.end = this.s.random(this.horizon, this.s.height);
          this.x = this.s.random(-80, this.s.width + 80);
          this.y = 0;
          this.z = this.s.map(this.end, this.horizon, this.s.height, 0, 1);
          this.speed = this.s.map(this.end, 0, this.s.height, 1, this.maxSpeed);

        }

        return res;
      }
      // function to draw the object
      draw(){
        // we use the Z value to interpolate from the FG and BG colors to give a sense of depth

        this.s.stroke(this.s.lerpColor(this.colBG, this.colFG, this.z));
        this.s.strokeWeight((255-this.z)/100); // Z value also influences the width of the raindrop
        this.s.line(this.x, this.y, this.x, this.y + this.size);
      }
    
    }
  c.RainDrop = RainDrop;
})(classes || (classes = {}))