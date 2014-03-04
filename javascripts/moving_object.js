(function(root) {
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
    FIELD = Asteroids.SIZE + 60;
    for(var i = 0; i < 2; i++) {
      this.pos[i] = (FIELD * 1000 + this.pos[i] + this.vel[i]) % FIELD;
    }

    this.rotation += this.rotSpd;
  };

  MovingObject.prototype.decrement = function() {
    this.killTime && this.killTime <= 0 ? this.destroy() : this.killTime--;
  };

  MovingObject.prototype.destroy = function() {
    this.game.removeMovingObject(this);
  };

  MovingObject.prototype.draw = function() {
  };

  MovingObject.prototype.isCollidedWith = function(obj) {
    var x1 = this.pos[0];
    var x2 = obj.pos[0];

    var minX1 = x1 - this.radius;
    var maxX1 = x1 + this.radius;

    var minX2 = x2 - obj.radius;
    var maxX2 = x2 + obj.radius;

    if(minX2 <= maxX1 && maxX2 >= minX1 ||
      maxX2 >= minX1 && maxX2 <= maxX1) {
      var y1 = this.pos[1];
      var y2 = obj.pos[1];

      var minY1 = y1 - this.radius;
      var maxY1 = y1 + this.radius;

      var minY2 = y2 - obj.radius;
      var maxY2 = y2 + obj.radius;

        if(minY2 <= maxY1 && maxY2 >= minY1 ||
          maxY2 >= minY1 && maxY2 <= maxY1) {
          return Math.pow(this.radius + obj.radius, 2) >=
            Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
        }
    }
    return false;
  };
})(this);