(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingObject = Asteroids.MovingObject = function(pos, vel, radius, color) {
    this.pos = pos;
    this.vel = vel;

    this.radius = radius;
    this.color = color;
  };

  MovingObject.prototype.move = function(BOARDSIZE) {
    for(var i = 0; i < 2; i++) {
      this.pos[i] = (BOARDSIZE[i]*1000 + this.pos[i] + this.vel[i]) % BOARDSIZE[i];
    }
  }

  MovingObject.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2, true);
    ctx.stroke();
  }

  MovingObject.prototype.isCollidedWith = function(obj) {
    var x1 = this.pos[0];
    var y1 = this.pos[1];
    var x2 = obj.pos[0];
    var y2 = obj.pos[1];
    //(x1 - x2) ^ 2 + (y1 - y2) ^ 2 = r ^ 2
    return Math.pow(this.radius + obj.radius, 2) >=
           Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  }
})(this);