(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Particle = Asteroids.Particle = function(pos, vel, game) {
    var radius = 1;
    this.killTime = 10 + Math.random() * 11;

    var newVel = [vel[0], vel[1]];
    newVel[0] = 2 - 4 * Math.random() + vel[0];
    newVel[1] = 2 - 4 * Math.random() + vel[1];

    var newPos = [pos[0] - 30, pos[1] - 30];

    Asteroids.MovingObject.call(this, newPos, newVel, radius, game);
  };

  Particle.inherits(Asteroids.MovingObject);

  Particle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    var x = this.pos[0] - .5 * this.radius;
    var y = this.pos[1] - .5 * this.radius;

    ctx.fillRect(x, y, this.radius, this.radius);

    ctx.fill();
  };
})(this);