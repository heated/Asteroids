(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Saucer = Asteroids.Saucer = function(game, type, pos) {
    this.type = type;
    this.changeDirectionCooldown = 120;
    this.cooldown = 0;
    this.spawned = false;

    switch(this.type) {
      case "large":
        this.sound = createjs.Sound.createInstance("lsaucer");
        this.radius = 9;
        this.xCentricity = 2;
        this.yCentricity = 1.4;
        break;
      case "small":
        this.radius = 5;
        this.sound = createjs.Sound.createInstance("ssaucer");
        this.xCentricity = 2;
        this.yCentricity = 1.4;
        break;
    }

    var xSpd = pos[0] > 30 ? -2 : 2;
    var ySpd = 0;

    var pos = pos;
    var vel = [xSpd, ySpd];
    this.killTime = (Asteroids.SIZE + 30)/Math.abs(xSpd) * 2;

    Asteroids.MovingObject.call(this, pos, vel, this.radius, game);
  };

  Saucer.inherits(Asteroids.MovingObject);
  Saucer.MINIFACTOR = 0.18461538461538461538461538461538;

  Saucer.random = function(game, type) {
    var x = 30 + Math.floor(Math.random() * 2) * (Asteroids.SIZE + 30); // Spawn at 30 or 560
    var y = 30 + Math.random() * (Asteroids.SIZE); // Spawn at any visible y

    var pos = [x, y];
    return new Saucer(game, type, pos);
  };

  Saucer.prototype.spawn = function() {
    this.spawned = true;
    this.playSound();
    return this;
  };

  Saucer.prototype.playSound = function() {
    this.sound.play({loop: -1})
  };

  Saucer.prototype.decrement = function() {
    Asteroids.MovingObject.prototype.decrement.call(this);
    this.cooldown > 0 ? this.cooldown-- : null;
    this.changeDirectionCooldown > 0 ? this.changeDirectionCooldown-- : null;
    if(this.changeDirectionCooldown <= 0)
      this.changeVertical();
    if(this.cooldown <= 0 &&
      this.game.player !== null &&
      !this.game.player.inHyperSpace &&
      this.game.invincibleTimer <= 0)
      this.fireBullet();
  };

  Saucer.prototype.changeVertical = function() {
    this.changeDirectionCooldown = 120;
    var original = this.vel[1];
    var chooser = Math.floor(Math.random() * 4);
    chooser = chooser == 4 ? 3 : chooser;
    this.vel[1] = chooser > 1 ? 0 : (chooser == 0 ? -2 : 2);
    if(this.vel[1] !== original)
      this.changeDirectionCooldown = 60;
  };

  Saucer.prototype.fireBullet = function() {
    this.cooldown = 48;

    var player = this.game.player;

    var bullet_speed = 6;
    var bullet_direction;
    var bullet_vel;

    // The shot is primed to be random. If the UFO is small,
    // the shot will be aimed. The aim may be led, or it will
    // be directly at the player's present location regardless
    // of speed.

    // If the shot is meant to be led, but the player will not
    // be within firing range, then it will be reconfigured as
    // random.

    bullet_direction = Math.random() * 2 * Math.PI;
    bullet_vel = [
      bullet_speed * Math.cos(bullet_direction),
      bullet_speed * Math.sin(bullet_direction)
    ];

    // Above is random shot.

    if (this.type == "small") {
      var pVX = player.vel[0];
      var pVY = player.vel[1];
      var seeking = (pVX == 0 && pVY == 0) ? 0 : Math.floor(Math.random() * 2);
      // 0 = Do not add player velocity
      // 1 = Add player velocity

      var x1 = this.pos[0];
      var y1 = this.pos[1];
      var x2 = player.pos[0];
      var y2 = player.pos[1];

      var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

      var level = this.game.level;
      var offset = Math.PI / 5 * (1 - level * .025) * Math.random();
      offset *= Math.floor(Math.random() * 2) >= 1 ? 1 : -1;
      var angle;

      if(seeking == 0) {
        bullet_direction = [
          (x2 - x1)/distance,
          (y2 - y1)/distance
        ];

        // The bullet will fire within a range of the player's static position
        // with a random variance from that position of up to 20% in either the x
        // or y direction

        // The degree of this deviation decreases with level, with no deviation
        // starting at level 40

      } else {

        // The saucer will fire at the player's anticipated location.

        // The percent offset applies to these "leading" shots as well.

        // The way this works is by calculating the soonest time the player
        // will be at a point that is the same as the distance travelled
        // by the bullet. If it is calculated that this distance never comes
        // up by the time the bullet should die, then the shot remains completely random.

        for(var i = 1; i < 61; i++) {
          var newX = x2 + pVX * i - x1;
          var newY = y2 + pVY * i - y1;
          var newDistance = Math.sqrt(Math.pow(newX, 2) + Math.pow(newY, 2));

          if(newDistance <= i * bullet_speed) {
            var newAngle = Math.atan2(newY, newX);
            bullet_direction = [
              newX,
              newY
            ];
          }
        }
      }
      angle = Math.atan2(bullet_direction[1], bullet_direction[0]);
      angle += offset;
      bullet_vel = [
        bullet_speed * Math.cos(angle),
        bullet_speed * Math.sin(angle)
      ];
    }

    createjs.Sound.play("sfire");
    var newBullet = new Asteroids.Bullet(this.pos.slice(0), bullet_vel, this.game, "enemy");
    this.game.bullets.push(newBullet);
  };

  Saucer.prototype.isCollidedWith = function(obj) {
    var x1 = this.pos[0];
    var y1 = this.pos[1];
    var x2 = obj.pos[0];
    var y2 = obj.pos[1];
    return Math.pow(this.radius + obj.radius, 2) >=
           Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  }

  Saucer.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;

    var centerX = this.pos[0] - 30;
    var centerY = this.pos[1] - 30;
    var mini = Saucer.MINIFACTOR;
    var smallXFactor = 1.8;
    var smallYFactor = 1.88;

    var points = [
      [-102.5, 17.5], // moveTo
      [-47.5, 65],
      [47.5, 65],
      [102.5, 17.5],
      [-102.5, 17.5],
      [-42.5, -22.5],
      [42.5, -22.5],
      [102.5, 17.5],
      [42.5, -22.5], // moveTo
      [22.5, -65],
      [-22.5, -65],
      [-42.5, -22.5]
    ];

    for(var i = 0; i < points.length; i++) {
      var newX = points[i][0];
      var newY = points[i][1];

      newX = newX * mini / (this.type === "small" ? smallXFactor : 1) + centerX;
      newY = newY * mini / (this.type === "small" ? smallYFactor : 1) + centerY;

      switch(i){
        case 0:
          ctx.moveTo(newX, newY);
          break;
        case 8:
          ctx.moveTo(newX, newY);
          break;
        default:
          ctx.lineTo(newX, newY);
          break;
      }
    }

    ctx.stroke();
    // ctx.save();
    // ctx.fillStyle = "rgba(0,0,255,.5)";
    // ctx.translate(0, this.type === "large" ? 4 : 2);
    // ctx.scale(this.xCentricity, 1);
    // ctx.beginPath();
    // ctx.arc(centerX / this.xCentricity, centerY / 1, this.radius, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();

    // ctx.save();
    // ctx.fillStyle = "rgba(255,0,0,.5)";
    // ctx.translate(0, 0);
    // ctx.scale(1, this.yCentricity);
    // ctx.beginPath();
    // ctx.arc(centerX, centerY / this.yCentricity, this.radius, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();
  };

  Saucer.prototype.isCollidedWith = function(obj) {
    // Check for x alignment with completely bounding line
    var offset = this.type === "large" ? 4 : 2

    var x1 = this.pos[0];
    var x2 = obj.pos[0];

    var minX1 = x1 - this.radius * this.xCentricity;
    var maxX1 = x1 + this.radius * this.xCentricity;

    var minX2 = x2 - obj.radius;
    var maxX2 = x2 + obj.radius;

    if(minX2 <= maxX1 && maxX2 >= minX1 ||
      maxX2 >= minX1 && maxX2 <= maxX1) {
      // Check for y alignment if x-aligned - Covers from bottom of saucer
      // to top of cockpit

      var y1 = this.pos[1] + offset;
      var y2 = obj.pos[1];

      var minY1 = y1 - this.radius * this.yCentricity - 4;
      var maxY1 = y1 + this.radius;

      var minY2 = y2 - obj.radius;
      var maxY2 = y2 + obj.radius;

        if(minY2 <= maxY1 && maxY2 >= minY1 ||
          maxY2 >= minY1 && maxY2 <= maxY1) {
          // First pass - Check an oval that covers the lower half of the saucer
          // yCentricity is not used to generate this hit oval

          var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
          var saucerRadiusDirection = [
            (x1 - x2)/distance,
            (y1 - y2)/distance
          ];
          var criticalRadius = Math.sqrt(
            Math.pow(saucerRadiusDirection[0] * this.radius * this.xCentricity, 2) +
            Math.pow(saucerRadiusDirection[1] * this.radius, 2)
          );

          var collided = criticalRadius + obj.radius >= distance;
          if(collided) {
            return collided;
          } else {
            // Second pass - Check an oval that covers the saucer "cockpit"

            y1 -= offset;
            maxY1 = y1 + this.radius * this.yCentricity;
            distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            saucerRadiusDirection = [
              (x1 - x2)/distance,
              (y1 - y2)/distance
            ];
            var criticalRadius = Math.sqrt(
              Math.pow(saucerRadiusDirection[0] * this.radius, 2) +
              Math.pow(saucerRadiusDirection[1] * this.radius * this.yCentricity, 2)
            );

            var collided = criticalRadius + obj.radius >= distance;
            if(collided) {
              return collided;
            }
          }
        }
    }
    return false;
  };
})(this);