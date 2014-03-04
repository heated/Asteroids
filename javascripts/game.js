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
      this.player.radius = 100;

      for(var i = 0; i < num; i++) {
        // spawn away from the player
        do {
          var newAsteroid = Asteroids.Asteroid.random(this);
        } while(this.player.isCollidedWith(newAsteroid) ||
          newAsteroid.vel[0] == 0 ||
          newAsteroid.vel[1] == 0);

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
      this.elapsed += 1;
      if(this.player !== null) {
        this.player.decelerate(.01);
        this.playerInput();
      }
      this.entities().forEach(function(target) {
        target && target.decrement();
      });
      this.checkSpawn();
      if(this.elapsed % 60 === 0 &&
        this.saucer === null &&
        this.elapsed >= 300 &&
        this.asteroids.length >= 1 &&
        this.player !== null) {
        var odds = Math.random() * 60;
        var extra = (this.level / 25 + (this.elapsed - 300)/600) * 6;
        odds += extra > 30 ? 30 : extra;
        if (Math.floor(odds) >= 59)
          this.spawnSaucer();
      }
      if(this.invincibleTimer > 0) {
        this.playerBlink();
        this.invincibleTimer -= 1;
      } else if (this.player !== null && this.player.color !== "white") {
        this.player.color = "white";
      }
      this.move();
      this.checkCollisions();
      this.checkScore();
      this.draw();
      this.checkWin();
      this.UICallbacks.update();
      this.gameStarted ? window.requestAnimationFrame(this.step.bind(this)) : null;
    },

    checkScore: function() {
      if(this.pointsToNextLife <= 0 && this.lives > 0) {
        createjs.Sound.play("life");
        this.lives++;
        this.pointsToNextLife = 10000 + this.pointsToNextLife;
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
      this.elapsed = 0;
      this.invincibleTimer = 0;
      this.pointsToNextLife = (this.pointsToNextLife === undefined ? 10000 : this.pointsToNextLife)
      this.level = (this.level === undefined ? 1 : this.level + 1);
      this.score = (this.score === undefined ? 0 : this.score);
      this.lives = (this.lives === undefined ? 3 : this.lives);
      this.asteroids = [];
      this.bullets = [];
      this.particles = [];
      this.saucer = null;
      this.player = new Asteroids.Ship(
        [SIZE / 2 + 30, SIZE / 2 + 30],
        this
      );

      var howMany = 10 + this.level;
      this.addAsteroids(howMany > 20 ? 20 : howMany);
      var that = this;
      this.asteroids.forEach(function(asteroid) {
        asteroid.vel[0] += (that.level - 1)/50;
        asteroid.vel[1] += (that.level - 1)/50;
      });
      this.UICallbacks.preparation();
      this.player.cooldown = 5;
      this.step();
      window.setTimeout(function() {
        that.gameStarted = true;
        that.gameLoop = window.requestAnimationFrame(that.step.bind(that));
        that.UICallbacks.endPreparation();
      }, 2000);
    },

    checkCollisions: function() {
      var player = this.player;
      var saucer = this.saucer;
      var asteroids = this.asteroids;
      for(var i = 0; i < asteroids.length; i++) {
        var asteroid = asteroids[i];
        var collided = false;
        if (player !== null &&
          !player.inHyperSpace &&
          asteroid.isCollidedWith(player) &&
          this.invincibleTimer <= 0) {
          collided = true;
          this.killPlayer();
        }
        if(saucer !== null &&
          saucer.spawned &&
          saucer.isCollidedWith(asteroid)) {
          this.removeSaucer();
          collided = true;
        }
        if(collided) {
          this.removeAsteroid(i, asteroid);
          this.spawnParticles(asteroid.pos, asteroid.vel, asteroid.mass);
        }
      }
      if (saucer !== null &&
        saucer.spawned &&
        player !== null &&
        !player.inHyperSpace &&
        saucer.isCollidedWith(player) &&
        this.invincibleTimer <= 0) {
        this.removeSaucer();
        this.killPlayer();
      }
    },

    killPlayer: function() {
      this.spawnParticles(this.player.pos, this.player.vel, 2);
      this.player = null;
      this.lives = this.lives <= 0 ? 0 : this.lives - 1;
      if (this.lives <= 0) {
        this.lose();
      } else {
        this.spawnTimer = 120;
      }
    },

    removeAsteroid: function(index, bullet) {
      createjs.Sound.play("explode" + Math.abs(this.asteroids[index].mass - 4));
      if(bullet && bullet.type == "player") {
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
      }
      this.asteroids[index].spawn(this);
      this.asteroids.splice(index, 1);
    },

    removeSaucer: function(bullet) {
      if(this.saucer !== null) {
        if(this.saucer.type === "large") {
          createjs.Sound.play("explode1");
          this.saucer.sound.stop();
          if(bullet && bullet.type === "player") {
            this.score += 200;
            this.pointsToNextLife -= 200;
          }
        } else if (this.saucer.type === "small") {
          createjs.Sound.play("explode2");
          this.saucer.sound.stop();
          if(bullet && bullet.type === "player") {
            this.score += 1000;
            this.pointsToNextLife -= 1000;
          }
        }
      }
      this.saucer = null;
    },

    removeMovingObject: function(target) {
      if(this.bullets.indexOf(target) != -1) {
        this.bullets.splice(this.bullets.indexOf(target), 1);
      } else if (this.particles.indexOf(target) != -1) {
        this.particles.splice(this.particles.indexOf(target), 1);;
      } else if (this.saucer && this.saucer.killTime <= 0){
        this.saucer.sound.stop();
        this.saucer = null;
      }
    },

    playerInput: function() {
      var ctx = this.ctx;
      var player = this.player;
      if(player !== null && player.inHyperSpace == false) {
        if(key.isPressed('w')) {
          if(!player.isAtMaxVelocity()) {
            player.isThrusting = true;
            player.power(0.07);
            createjs.Sound.play("thrust");
          } else {
            player.isThrusting = true;
            player.maintainMaxSpeed();
            createjs.Sound.play("thrust");
          }
        }
        if(key.isPressed('a'))
          player.rotate("counterClockwise");
        if(key.isPressed('d'))
          player.rotate("clockwise");
        if(key.isPressed('space') &&
          player.canFire() &&
          this.numPlayerBullets() < 4 &&
          this.preventHold == false) {
          this.preventHold = true;
          this.player.fireBullet();
        }
        if(key.isPressed('shift')){
          player.hyperSpace();
        }
        if(!key.isPressed('space'))
          this.preventHold = false;
      }
    },

    spawnParticles: function(parentPos, parentVel, parentMass) {
      for(i = 0; i < (10 + Math.random() * 10) * parentMass; i++) {
        var newParticle = new Asteroids.Particle(parentPos, parentVel, this);
        this.particles.push(newParticle);
      }
    },

    numPlayerBullets: function() {
      var numBullets = 0;
      for(var i = 0; i < this.bullets.length; i++) {
        if(this.bullets[i].type == "player")
          numBullets++;
      }
      return numBullets;
    },

    spawnSaucer: function() {
      var odds = Math.random() * 4;
      odds += this.level / 50 + (this.elapsed - 600)/2400;
      var saucerType = Math.floor(odds) <= 2 ? "large" : "small";
      var saucer = Asteroids.Saucer.random(this, saucerType);

        var saucer = Asteroids.Saucer.random(this, saucerType);
        for(var i = 0; i < this.asteroids.length; i++) {
          if(saucer.isCollidedWith(this.asteroids[i]))
            break;
          if(i == this.asteroids.length - 1 && !saucer.isCollidedWith(this.asteroids[i])){
            if(this.player !== null && !saucer.isCollidedWith(this.player)){
              this.saucer = saucer.spawn();
            }
          }
        }
    },

    entities: function() {
      var entities = this.particles
        .concat(this.asteroids)
        .concat(this.bullets);
      
      entities.push(this.player);
      entities.push(this.saucer);

      return entities;
    },

    lose: function() {
      this.UICallbacks.beforeLoss();
      var that = this;
      window.setTimeout(function() {
        that.gameStarted = false;
        window.cancelAnimationFrame(that.gameLoop);
        that.UICallbacks.loss();
      }, 3000);
    },

    win: function() {
      this.gameStarted = false;
      window.cancelAnimationFrame(this.gameLoop);
      if(this.level < 50) {
        createjs.Sound.stop();
        this.start();
      } else {
        this.UICallbacks.win();
      }
    },

    checkWin: function() {
      if(this.particles.length == 0 &&
        this.asteroids.length == 0 &&
        this.saucer === null &&
        this.lives >= 1) {
        this.win();
      }
    },

    restart: function() {
      this.level = undefined;
      this.score = undefined;
      this.lives = undefined;
      this.pointsToNextLife = undefined;
      this.gameStarted = false;
      window.cancelAnimationFrame(this.gameLoop);
      this.start();
    }
  }
})(this);