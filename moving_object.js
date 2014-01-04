(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingObject = Asteroids.MovingObject = function(pos, vel, rotation, rotSpd, radius, color) {
    this.pos = pos;
    this.vel = vel;

    this.rotation = rotation;
    this.rotSpd = rotSpd;

    this.radius = radius;
    this.color = color;
  };

  MovingObject.prototype.move = function(BOARDSIZE) {
    FIELD = BOARDSIZE[0] + 60;
    for(var i = 0; i < 2; i++) {
      this.pos[i] = (FIELD * 1000 + this.pos[i] + this.vel[i]) % FIELD;
    }

    this.rotation += this.rotSpd;
  }

  MovingObject.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0] - 30, this.pos[1] - 30, this.radius, 0, Math.PI * 2, true);
    ctx.stroke();
  }

  MovingObject.prototype.isCollidedWith = function(obj) {
    var x1 = this.pos[0];
    var y1 = this.pos[1];
    var x2 = obj.pos[0];
    var y2 = obj.pos[1];
    return Math.pow(this.radius + obj.radius, 2) >=
           Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  }
})(this);