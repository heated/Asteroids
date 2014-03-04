(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function(pos, game) {
    var vel = [0, 0];
    this.maxSpeed = 10;

    this.inHyperSpace = false;
    this.hyperTime = 0;
    this.hyperCooldown = 0;

    this.miniFactor = 0.18461538461538461538461538461538;
    this.displayRadius = 10;

    Asteroids.MovingObject.call(this, pos, vel, Ship.RADIUS, game);
    this.cooldown = 0;
    this.isThrusting = false;
    this.thrustDisplayCooldown = 0;
  };

  Ship.RADIUS = 5;
  Ship.inherits(Asteroids.MovingObject);

  Ship.prototype.rotate = function(direction) {
    if(direction === "clockwise") {
      this.rotation += 1/10; //rads
    } else if(direction === "counterClockwise") {
      this.rotation -= 1/10;
    }
    this.rotation = this.rotation % (2 * Math.PI);
  };

  Ship.prototype.power = function(impulse) {
    this.vel[0] += impulse * Math.cos(this.rotation);
    this.vel[1] += impulse * Math.sin(this.rotation);
  };

  Ship.prototype.hyperSpace = function() {
    if(this.hyperCooldown <= 0) {
      this.hyperCooldown = 240;
      this.pos[0] = 50 + (Math.random() * 470);
      this.pos[1] = 50 + (Math.random() * 470);
      this.hyperTime = 60;
      this.inHyperSpace = true;
    }
  };

  Ship.prototype.decrement = function() {
    if(this.thrustDisplayCooldown && this.thrustDisplayCooldown > 0) 
      this.thrustDisplayCooldown--;
    if(this.cooldown && this.cooldown > 0) 
      this.cooldown--;
    if(this.hyperTime && this.hyperTime > 0)
      this.hyperTime--;
    if(this.hyperCooldown && this.hyperCooldown > 0)
      this.hyperCooldown--;
    if(this.hyperTime <= 0)
      this.inHyperSpace = 0;
  };

  Ship.prototype.decelerate = function(impulse) {
    var totalVelocity = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));

    var dX = totalVelocity !== 0 ? impulse * this.vel[0] / totalVelocity : 0;
    var dY = totalVelocity !== 0 ? impulse * this.vel[1] / totalVelocity : 0;

    this.vel[0] = Math.abs(dX) >= Math.abs(this.vel[0]) ? 0 : this.vel[0] - dX;
    this.vel[1] = Math.abs(dY) >= Math.abs(this.vel[1]) ? 0 : this.vel[1] - dY;
  };

  Ship.prototype.isAtMaxVelocity = function() {
    return (this.vel[0] * Math.cos(this.rotation) + this.vel[1] * Math.sin(this.rotation)) >= this.maxSpeed
  };

  Ship.prototype.maintainMaxSpeed = function() {
    this.vel[0] = this.maxSpeed * Math.cos(this.rotation);
    this.vel[1] = this.maxSpeed * Math.sin(this.rotation);
  };

  Ship.prototype.fireBullet = function() {
    createjs.Sound.play("fire");
    this.cooldown = 5;
    var bullet_speed = 6;
    var bullet_vel = [
      bullet_speed * Math.cos(this.rotation),
      bullet_speed * Math.sin(this.rotation)
    ];

    var newBullet = new Asteroids.Bullet(this.pos.slice(0), bullet_vel, this.game, "player");
    this.game.bullets.push(newBullet);
  };

  Ship.prototype.draw = function(ctx) {
    if(!this.inHyperSpace) {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      var centerX = this.pos[0] - 30;
      var centerY = this.pos[1] - 30;

      var points = [
        [1.2 * this.displayRadius / this.miniFactor, 0],
        [-55, 40],
        [-35, 20],
        [-35, -20],
        [-55, -40],
        [1.2 * this.displayRadius / this.miniFactor, 0]
      ];

      var that = this;
      points.forEach(function(point) {
        var firstX = point[0] * that.miniFactor;
        var firstY = point[1] * that.miniFactor;
        point[0] = firstX * Math.cos(that.rotation) - firstY * Math.sin(that.rotation);
        point[1] = firstX * Math.sin(that.rotation) + firstY * Math.cos(that.rotation);

        point[0] += centerX;
        point[1] += centerY;

        ctx.lineTo(point[0], point[1]);
      });

      points = [
        [50, 0],
        [20, 10],
        [10, 5],
        [10, -5],
        [20, -10],
        [50, 0]
      ];

      points.forEach(function(point) {
        var firstX = point[0] * that.miniFactor;
        var firstY = point[1] * that.miniFactor;
        point[0] = firstX * Math.cos(that.rotation) - firstY * Math.sin(that.rotation);
        point[1] = firstX * Math.sin(that.rotation) + firstY * Math.cos(that.rotation);

        point[0] += centerX;
        point[1] += centerY;

        ctx.lineTo(point[0], point[1]);
      });

      ctx.stroke();
      if(this.isThrusting && this.thrustDisplayCooldown <= 0) {
        this.thrustDisplay(ctx);
      }
    }
  };

  Ship.prototype.thrustDisplay = function(ctx) {
    this.isThrusting = false;
    this.thrustDisplayCooldown = 5;

    ctx.strokeStyle = "white";
    ctx.beginPath();

    var centerX = this.pos[0] - 30;
    var centerY = this.pos[1] - 30;

    var points = [];

    points.push(
      [-13.846153846153846153846153846153, 0],
      [-7.3846153846153846153846153846154, -3.6923076923076923076923076923077],
      [-7.3846153846153846153846153846154, 3.6923076923076923076923076923077],
      [-13.846153846153846153846153846153, 0]
    );

    var that = this;
    points.forEach(function(point) {
      var firstX = point[0];
      var firstY = point[1];
      point[0] = firstX * Math.cos(that.rotation) - firstY * Math.sin(that.rotation);
      point[1] = firstX * Math.sin(that.rotation) + firstY * Math.cos(that.rotation);

      point[0] += centerX;
      point[1] += centerY;

      ctx.lineTo(point[0], point[1]);
    });

    ctx.stroke();
  };

  Ship.prototype.canFire = function() {
    return this.cooldown <= 0;
  };
})(this);
