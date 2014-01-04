(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function(pos, vel) {
    Asteroids.MovingObject.call(this, pos, vel, 0, 0, Ship.RADIUS, Ship.COLOR);
  }

  Ship.RADIUS = 10;
  Ship.COLOR = "white";

  Ship.inherits(Asteroids.MovingObject);

  Ship.prototype.power = function(impulse) {
    this.vel[0] += Math.cos(this.rotation);
    this.vel[1] += Math.sin(this.rotation);
  }

  Ship.prototype.fireBullet = function() {
    var bullet_speed = 8;
    var bullet_vel = [bullet_speed * Math.cos(this.rotation),
                      bullet_speed * Math.sin(this.rotation)];

    return new Asteroids.Bullet(this.pos.slice(0), bullet_vel);
  }

  Ship.prototype.draw = function() {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.pos[0] - 30, this.pos[1] - 30);

    for(var i = 0; i <= 3; i++) {
      new_angle = this.rotation + Math.PI * 2 * i / 3;
      new_x = this.pos[0] - 30 + this.radius * Math.cos(new_angle);
      new_y = this.pos[1] - 30 + this.radius * Math.sin(new_angle);

      ctx.lineTo(new_x, new_y);
    }

    ctx.stroke();
  }
})(this);
