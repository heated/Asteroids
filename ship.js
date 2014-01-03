(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function(pos, vel) {
    Asteroids.MovingObject.call(this, pos, vel, Ship.RADIUS, Ship.COLOR);
  }

  Ship.RADIUS = 5;
  Ship.COLOR = "blue";

  Ship.inherits(Asteroids.MovingObject);

  Ship.prototype.power = function(impulse) {
    for(var i = 0; i < 2; i++) {
      this.vel[i] += impulse[i];
    }
  }

  Ship.prototype.fireBullet = function() {
    var speed = this.speed();

    var bullet_speed = 8;
    var bullet_vel = [bullet_speed * this.vel[0] / speed,
                      bullet_speed * this.vel[1] / speed];

    return new Asteroids.Bullet(this.pos.slice(0), bullet_vel);
  }

  Ship.prototype.speed = function() {
    return Math.sqrt(Math.pow(this.vel[0], 2) +
      Math.pow(this.vel[1], 2));
  }

})(this);
