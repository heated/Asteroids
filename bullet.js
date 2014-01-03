(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(pos, vel) {
    Asteroids.MovingObject.call(this, pos, vel, Bullet.RADIUS, Bullet.COLOR);
    setTimeout(this.killMyself.bind(this), 1000);
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.hitAsteroids = function(asteroids) {
    var that = this;
    asteroids.forEach(function(asteroid, i) {
      if (that.isCollidedWith(asteroid)) {
        that.game.removeAsteroid(i);
        that.killMyself();
        return true;
      }
    });
    return false;
  }

  Bullet.prototype.killMyself = function() {
    this.game.removeBullet(this);
  }

  Bullet.prototype.move = function(BOARDSIZE) {
    Asteroids.MovingObject.prototype.move.call(this, BOARDSIZE);
    this.hitAsteroids(this.game.asteroids);
  }

  Bullet.RADIUS = 2;
  Bullet.COLOR = "red";
})(this);
