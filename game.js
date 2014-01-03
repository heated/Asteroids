(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  var BOARDSIZE = Asteroids.BOARDSIZE = [500, 500];

  var Game = Asteroids.Game = function(ctx) {
    this.ctx = ctx;
    this.asteroids = [];
    this.addAsteroids(10);
    this.player = new Asteroids.Ship(
      [BOARDSIZE[0] / 2, BOARDSIZE[1] / 2],
      [0, 0]
    );
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
  }

  Game.prototype.move = function() {
    this.asteroids.forEach(function(asteroid) {
      asteroid.move(BOARDSIZE);
    })
    this.player.move(BOARDSIZE)
  }

  Game.prototype.step = function() {
    
    this.move();
    this.checkCollisions();
    this.draw();
  }

  Game.prototype.start = function() {
    Game.gameLoop = window.setInterval(this.step.bind(this), 1000/Game.FPS);
  }

  Game.prototype.checkCollisions = function () {
    var player = this.player;
    this.asteroids.forEach(function(asteroid) {
      if (asteroid.isCollidedWith(player)) {
        Game.over();
      }
    });
  }

  Game.prototype.bindKeyHandlers = function() {
    
  }

  Game.over = function () {
    alert("You suck at this game <3 !!!1XD");
    clearInterval(Game.gameLoop);
  }
})(this);