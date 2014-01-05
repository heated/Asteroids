(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function(pos, game) {
    var vel = [0, 0];
    Asteroids.MovingObject.call(this, pos, vel, Ship.RADIUS, game);
    this.cooldown = 0;
  }

  Ship.RADIUS = 10;

  Ship.inherits(Asteroids.MovingObject);

  Ship.prototype.power = function(impulse) {
    this.vel[0] += impulse * Math.cos(this.rotation);
    this.vel[1] += impulse * Math.sin(this.rotation);
  }

  Ship.prototype.fireBullet = function() {
    this.cooldown = 15;
    var bullet_speed = 6;
    var bullet_vel = [bullet_speed * Math.cos(this.rotation),
                      bullet_speed * Math.sin(this.rotation)];

    return new Asteroids.Bullet(this.pos.slice(0), bullet_vel, this.game);
  }

  Ship.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.pos[0] - 30, this.pos[1] - 30);

    for(var i = 0; i <= 3; i++) {
      new_angle = this.rotation + Math.PI * 2 * i / 3;
      new_x = this.pos[0] - 30 + 1.2 * this.radius * Math.cos(new_angle);
      new_y = this.pos[1] - 30 + 1.2 * this.radius * Math.sin(new_angle);

      ctx.lineTo(new_x, new_y);
    }

    ctx.stroke();
  }

  Ship.prototype.canFire = function() {
    return this.cooldown <= 0;
  }
})(this);
