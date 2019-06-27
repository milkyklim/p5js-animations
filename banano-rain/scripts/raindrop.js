var classes
(c => {
  "use strict";

  const RainSplash = classes.RainSplash;

  class RainDrop {
    constructor(sketch, colorBackground, colorForeground) {
      this.s = sketch;
      // the Y position of the screen in which drop appears
      this.horizon = this.s.height / 2;
      this.colorBackground = colorBackground;
      this.colorForeground = colorForeground;

      this.maxSpeed = 6;
      this.size = 10;
      this.offset = 80; // offset to compensate for noise

      this.reset(this.s.random(this.s.height));
    }
    
    reset(y) {
      this.x = this.s.random(-this.offset, this.s.width + this.offset);
      this.y = y
      this.z = this.s.map(this.end, this.horizon, this.s.height, 0, 1);
      this.end = this.s.random(this.horizon, this.s.height);
      this.speed = this.s.map(this.end, 0, this.s.height, 1, this.maxSpeed);
    }

    update() {
      let rainSplash = null;
      if (this.y < this.end) {
        // noise for wind effect
        this.x += this.s.map(this.s.noise(this.s.millis() / 1000), 
          0, 1, -1, 1) * 2;
        this.y += this.speed;
      } else {
        rainSplash = new RainSplash(this.s, this.x, this.y, this.z, 
          (this.y / this.s.height), this.colorBackground, this.colorForeground)
        this.reset(0);
      }

      return rainSplash;
    }

    draw() {
      // we use the Z value to interpolate from the FG and BG colors to give a sense of depth
      this.s.stroke(this.s.lerpColor(this.colorBackground, 
        this.colorForeground, this.z));
      this.s.strokeWeight((255 - this.z) / 100);
      this.s.line(this.x, this.y, this.x, this.y + this.size);
    }
  }
  c.RainDrop = RainDrop;
})(classes || (classes = {}))