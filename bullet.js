(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(pos, vel) {
    Asteroids.MovingObject.call(this, pos, vel, 0, 0, Bullet.RADIUS, Bullet.COLOR);
    setTimeout(this.destroy.bind(this), 1000);
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.hitAsteroids = function(asteroids) {
    var that = this;
    asteroids.forEach(function(asteroid, i) {
      if (that.isCollidedWith(asteroid)) {
        that.game.removeAsteroid(i);
        that.destroy();
        return true;
      }
    });
    return false;
  }

  Bullet.prototype.destroy = function() {
    this.game.removeBullet(this);
  }

  Bullet.prototype.move = function(BOARDSIZE) {
    Asteroids.MovingObject.prototype.move.call(this, Asteroids.BOARDSIZE);
    this.hitAsteroids(this.game.asteroids);
  }

  Bullet.RADIUS = 2;
  Bullet.COLOR = "white";
})(this);
