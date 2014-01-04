(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  var BOARDSIZE = Asteroids.BOARDSIZE = [500, 500];

  var Game = Asteroids.Game = function(ctx) {
    this.ctx = ctx;
    this.asteroids = [];
    this.addAsteroids(10);
    this.bullets = [];
    this.player = new Asteroids.Ship(
      [BOARDSIZE[0] / 2, BOARDSIZE[1] / 2],
      [0, 0]
    );
    this.bindKeyHandlers();
  }

  Game.FPS = 60;

  Game.prototype.addAsteroids = function(num) {
    for(var i = 0; i < num; i++) {
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(BOARDSIZE));
    }
  }

  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, BOARDSIZE[0], BOARDSIZE[1]);

    this.player.draw(this.ctx);

    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(this.ctx);
    })

    this.bullets.forEach(function(bullet) {
      bullet.draw(this.ctx);
    })
  }

  Game.prototype.move = function() {
    this.asteroids.forEach(function(asteroid) {
      asteroid.move(BOARDSIZE);
    })
    this.bullets.forEach(function(bullet) {
      bullet.move(BOARDSIZE);
    })
    this.player.move(BOARDSIZE);
  }

  Game.prototype.step = function() {
    this.move();
    this.checkCollisions();
    this.draw();
  }

  Game.prototype.start = function() {
    Game.gameLoop = window.setInterval(this.step.bind(this), 1000 / Game.FPS);
  }

  Game.prototype.checkCollisions = function() {
    var player = this.player;
    this.asteroids.forEach(function(asteroid) {
      if (asteroid.isCollidedWith(player)) {
        //Game.over();
      }
    });
  }

  Game.prototype.fireBullet = function() {
    if (this.bullets.length < 10) {
      this.bullets.push(this.player.fireBullet());
      this.bullets[this.bullets.length - 1].game = this;
    }
  }

  Game.prototype.removeAsteroid = function(index) {
    this.asteroids[index].spawn(this);
    this.asteroids.splice(index, 1);
  }

  Game.prototype.removeBullet = function(bullet) {
    this.bullets.splice(this.bullets.indexOf(bullet), 1);
  }

  Game.prototype.bindKeyHandlers = function() {
    var player = this.player;
    var that = this;
    key('w', function() { player.power(1); });
    key('a', function() { player.rotation -= 1/5; });
    key('s', function() { player.power(-1); });
    key('d', function() { player.rotation += 1/5; });
    key('space', function() { that.fireBullet(); });
  }

  Game.over = function () {
    alert("Unacceptable.");
    clearInterval(Game.gameLoop);
  }
})(this);