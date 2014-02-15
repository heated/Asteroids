(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  var SIZE = Asteroids.SIZE = 500;

  var Game = Asteroids.Game = function(ctx, callbacks) {
    this.ctx = ctx;
    this.UICallbacks = callbacks;
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
      var ctx = this.ctx;
      ctx.clearRect(0, 0, SIZE, SIZE);

      this.entities().forEach(function(entity) {
        if(entity !== null) {
          entity.draw(ctx);
        }
      })
    },

    playerBlink: function() {
      if(this.player !== null && this.invincibleTimer > 0 && this.invincibleTimer % 10 == 0) {
        this.player.color = this.player.color == "black" ? "white" : "black" 
      }
    },

    move: function() {
      this.entities().forEach(function(entity) {
        if(entity !== null) {
          entity.move();
        }
      });
    },

    step: function() {
      if(this.player !== null) {
        this.player.cooldown--;
        this.playerInput();
      }
      this.checkSpawn();
      if(this.invincibleTimer > 0) {
        this.playerBlink();
        this.invincibleTimer -= 1;
      } else if (this.player !== null) {
        this.player.color = "white";
      }
      this.move();
      this.checkCollisions();
      this.checkScore();
      this.draw();
      this.checkWin();
      this.UICallbacks.update();
    },

    checkScore: function() {
      if(this.pointsToNextLife <= 0) {
        this.lives++;
        this.pointsToNextLife = 10000 - this.pointsToNextLife
      }
    },

    checkSpawn: function() {
      if(this.player == null && this.spawnTimer <= 0 && this.lives > 0){
        var newPlayer = new Asteroids.Ship(
          [SIZE / 2 + 30, SIZE / 2 + 30],
          this
        );
        this.invincibleTimer = 180;
        this.player = newPlayer;
      } else if (this.player == null && this.spawnTimer > 0) {
        this.spawnTimer -= 1;
      }
    },

    start: function() {
      this.invincibleTimer = 0;
      this.pointsToNextLife = 10000;
      this.level = (this.level === undefined ? 1 : this.level + 1);
      this.score = (this.score === undefined ? 0 : this.score);
      this.lives = (this.lives === undefined ? 3 : this.lives);
      this.asteroids = [];
      this.bullets = [];
      this.particles = [];
      this.player = new Asteroids.Ship(
        [SIZE / 2 + 30, SIZE / 2 + 30],
        this
      );

      var howMany = 10 + this.level;
      this.addAsteroids(howMany > 20 ? 20 : howMany);
      this.UICallbacks.preparation();
      var that = this;
      this.step();
      window.setTimeout(function() {
        that.gameLoop = window.setInterval(that.step.bind(that), 1000/Game.FPS);
        that.UICallbacks.endPreparation();
      }, 2000);
    },

    checkCollisions: function() {
      var player = this.player;
      var that = this;
      this.asteroids.forEach(function(asteroid) {
        if (player !== null && asteroid.isCollidedWith(player) && that.invincibleTimer <= 0) {
          that.player = null;
          soundManager.play("explode2");
          that.lives = that.lives <= 0 ? 0 : that.lives - 1;
          if (that.lives <= 0) {
            that.lose();
          } else {
            that.spawnTimer = 120;
          }
        }
      });
    },

    fireBullet: function() {
      soundManager.play("fire");
      this.bullets.push(this.player.fireBullet());
    },

    removeAsteroid: function(index) {
      soundManager.play("explode" + Math.abs(this.asteroids[index].mass - 4));
      switch(this.asteroids[index].mass) {
        case 1:
          this.score += 100;
          this.pointsToNextLife -= 100;
          break;
        case 2:
          this.score += 50;
          this.pointsToNextLife -= 50;
          break;
        case 3:
          this.score += 20;
          this.pointsToNextLife -= 20;
          break;
      }
      this.asteroids[index].spawn(this);
      this.asteroids.splice(index, 1);
    },

    removeBullet: function(bullet) {
      this.bullets.splice(this.bullets.indexOf(bullet), 1);
    },

    playerInput: function() {
      if(this.player !== null) {
        var player = this.player;
        if(key.isPressed('w')) {
          player.power(0.1);
          soundManager.play("thrust");
        }
        if(key.isPressed('a'))
          player.rotation -= 1/10;
        if(key.isPressed('d'))
          player.rotation += 1/10;
        if(key.isPressed('space') && player.canFire())
          this.fireBullet();

        key('r', this.restart.bind(this));
      }
    },

    entities: function() {
      var entities = this.particles
        .concat(this.asteroids)
        .concat(this.bullets);
      
      entities.push(this.player);

      return entities;
    },

    lose: function() {
      this.UICallbacks.beforeLoss();
      var that = this;
      window.setTimeout(function() {
        window.clearInterval(that.gameLoop);
        that.UICallbacks.loss();
      }, 3000);
    },

    win: function() {
      window.clearInterval(this.gameLoop);
      if(this.level < 50) {
        this.start();
      } else {
        this.UICallbacks.win();
      }
    },

    checkWin: function() {
      if(this.asteroids.length == 0) {
        this.win();
      }
    },

    restart: function() {
      this.level = undefined;
      this.score = undefined;
      this.lives = undefined;
      clearInterval(this.gameLoop);
      this.start();
    }
  }
})(this);