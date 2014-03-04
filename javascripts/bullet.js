(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(pos, vel, game, type) {
    this.type = type;
    this.killTime = 60;
    Asteroids.MovingObject.call(this, pos, vel, Bullet.RADIUS, game);
  };

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.RADIUS = 2;

  Bullet.prototype.hitAsteroids = function() {
    var that = this;
    this.game.asteroids.forEach(function(asteroid, i) {
      if (that.isCollidedWith(asteroid)) {
        that.game.spawnParticles(asteroid.pos, asteroid.vel, asteroid.mass);
        that.game.removeAsteroid(i, that);
        that.destroy();
      }
    });
  };

  Bullet.prototype.hitSaucer = function() {
    var saucer = this.game.saucer;
    if(saucer && this.type == "player" && saucer.isCollidedWith(this)) {
      this.game.spawnParticles(saucer.pos, saucer.vel, saucer.type == "large" ? 3 : 2);
      this.game.removeSaucer(this);
      this.destroy();
    }
  };

  Bullet.prototype.hitShip = function() {
    var player = this.game.player;
    if(this.type == "enemy" &&
      player &&
      !player.inHyperSpace &&
      this.game.invincibleTimer <= 0 &&
      player.isCollidedWith(this)) {
      createjs.Sound.play("explode2");
      this.game.killPlayer();
      this.destroy();
    }
  };

  Bullet.prototype.move = function() {
    Asteroids.MovingObject.prototype.move.call(this, Asteroids.SIZE);
    this.hitAsteroids();
    this.hitSaucer();
    this.hitShip();
  };

  Bullet.prototype.draw = function(ctx) {
    var player = this.game.player;
    var saucer = this.game.saucer;
    if(this.type === "player" && (player === null || !player.isCollidedWith(this)) ||
      this.type === "enemy" && (saucer === null || !saucer.isCollidedWith(this))) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.pos[0] - 30, this.pos[1] - 30, this.radius, 0, Math.PI * 2, true);
      ctx.fill();
    }
  };
})(this);
