(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(pos, vel, game) {
    Asteroids.MovingObject.call(this, pos, vel, Bullet.RADIUS, game);
    setTimeout(this.destroy.bind(this), 1000);
    this.travelling = true;
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.RADIUS = 2;

  Bullet.prototype.hitAsteroids = function() {
    var that = this;
    this.game.asteroids.forEach(function(asteroid, i) {
      if (that.travelling && that.isCollidedWith(asteroid)) {
        that.game.removeAsteroid(i);
        that.destroy();
      }
    });
    return !this.travelling;
  }

  Bullet.prototype.destroy = function() {
    if(this.travelling) {
      this.travelling = false;
      this.game.removeBullet(this);
    }
  }

  Bullet.prototype.move = function(BOARDSIZE) {
    Asteroids.MovingObject.prototype.move.call(this, Asteroids.BOARDSIZE);
    this.hitAsteroids();
  }

  Bullet.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0] - 30, this.pos[1] - 30, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
  }
})(this);
