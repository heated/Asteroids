(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingObject = Asteroids.MovingObject = function(pos, vel, radius, game, rotation, rotSpd, color) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.game = game;

    this.color = color || "white";
    this.rotation = rotation || 0;
    this.rotSpd = rotSpd || 0;
  };

  MovingObject.prototype.move = function() {
    FIELD = Asteroids.BOARDSIZE[0] + 60;
    for(var i = 0; i < 2; i++) {
      this.pos[i] = (FIELD * 1000 + this.pos[i] + this.vel[i]) % FIELD;
    }

    this.rotation += this.rotSpd;
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