(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  var BOARDSIZE = Asteroids.BOARDSIZE = [500, 500];

  var Game = Asteroids.Game = function(ctx) {
    this.ctx = ctx;
    this.asteroids = [];
    this.bullets = [];
    this.player = new Asteroids.Ship(
      [BOARDSIZE[0] / 2 + 30, BOARDSIZE[1] / 2 + 30],
      this
    );

    this.addAsteroids(1);
  }

  Game.FPS = 60;

  Game.prototype = {
    addAsteroids: function(num) {
      this.player.radius = 200;

      for(var i = 0; i < num; i++) {
        // spawn away from the player
        do {
          var newAsteroid = Asteroids.Asteroid.random(this);
        } while(this.player.isCollidedWith(newAsteroid));

        this.asteroids.push(newAsteroid);
      }

      this.player.radius = Asteroids.Ship.RADIUS;
    },

    draw: function() {
      this.ctx.clearRect(0, 0, BOARDSIZE[0], BOARDSIZE[1]);

      this.entities().forEach(function(entity) {
        entity.draw(this.ctx);
      })
    },

    move: function() {
      this.entities().forEach(function(entity) {
        entity.move();
      });
    },

    step: function() {
      this.player.cooldown--;
      this.playerInput();
      this.move();
      this.checkCollisions();
      this.draw();
      this.checkWin();
    },

    start: function() {
      this.gameLoop = window.setInterval(this.step.bind(this), 1000/Game.FPS);
    },

    checkCollisions: function() {
      var player = this.player;
      var that = this;
      this.asteroids.forEach(function(asteroid) {
        if (asteroid.isCollidedWith(player)) {
          that.lose();
        }
      });
    },

    fireBullet: function() {
      this.bullets.push(this.player.fireBullet());
    },

    removeAsteroid: function(index) {
      this.asteroids[index].spawn(this);
      this.asteroids.splice(index, 1);
    },

    removeBullet: function(bullet) {
      this.bullets.splice(this.bullets.indexOf(bullet), 1);
    },

    playerInput: function() {
      var player = this.player;
      if(key.isPressed('w'))
        player.power(0.1);
      if(key.isPressed('a'))
        player.rotation -= 1/10;
      if(key.isPressed('d'))
        player.rotation += 1/10;
      if(key.isPressed('space') && player.canFire())
        this.fireBullet();
    },

    entities: function() {
      var entities = this.asteroids
        .concat(this.bullets);
      
      entities.push(this.player);

      return entities;
    },

    lose: function() {
      setTimeout(function(){ alert("Defeat is unacceptable."); }, 100);
      clearInterval(this.gameLoop);
    },

    win: function() {
      setTimeout(function(){
        alert("Congratulations, you have saved the day!");
      }, 100);
      clearInterval(this.gameLoop);
    },

    checkWin: function() {
      if(this.asteroids.length == 0) {
        this.win();
      }
    }
  }
})(this);