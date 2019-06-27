var classes
(c => {
  "use strict";
  class RainSplash {
    constructor(sketch, x, y, z, size, colorBackground, colorForeground) {
      this.splashFrames = 8;
      this.s = sketch;
      this.x = x;
      this.y = y;
      this.z = z;
      this.size = size;

      this.colorBackground = colorBackground;
      this.colorForeground = colorForeground;
      // current frame for the animation
      this.change = 1;
    }

    update() {
      this.change++;
    }

    draw() {
      this.s.noFill();
      this.s.stroke(this.s.lerpColor(this.colorBackground, 
        this.colorForeground, this.z / this.splashFrames * this.change));
      this.s.strokeWeight(this.size);
      this.s.ellipse(this.x, this.y, 3 * this.size * this.change, 
        this.size * this.change);
    }

  }
  c.RainSplash = RainSplash;
})(classes || (classes = {}))