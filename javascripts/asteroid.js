(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Asteroid = Asteroids.Asteroid = function(pos, vel, rotSpd, mass, game) {
    var rotation = Math.random() * Math.PI * 2;
    var radius = mass * 10;
    this.mass = mass;
    Asteroids.MovingObject.call(this, pos, vel, radius, game, rotation, rotSpd);
    this.poly = ((Math.random() * 4) | 0) + 5;
  };

  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.random = function(game, pos, mass, setSpeed) {
    var SIZE = Asteroids.SIZE;
    var x = Math.random() * SIZE;
    var y = Math.random() * SIZE;

    var angle = Math.random() * Math.PI * 2;
    var speed = Math.floor(Math.random() * 2) + 1.0;
    speed == 3 ? 2 : speed
    speed = setSpeed !== undefined ? setSpeed : 1;
    var xSpd = speed * Math.cos(angle);
    var ySpd = speed * Math.sin(angle);

    var pos = pos || [x, y];
    var vel = [xSpd, ySpd];
    var rotSpd = (Math.random() - 0.5) / 10;
    var mass = mass || (1 + (Math.random() * 3) | 0);

    return new Asteroid(pos, vel, rotSpd, mass, game);
  };

  Asteroid.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();

    for(var i = 0; i <= this.poly; i++) {
      new_angle = this.rotation + Math.PI * 2 * i / this.poly;
      new_x = this.pos[0] - 30 + 1.1 * this.radius * Math.cos(new_angle);
      new_y = this.pos[1] - 30 + 1.1 * this.radius * Math.sin(new_angle);

      if(i == 0) {
        ctx.moveTo(new_x, new_y);
      } else {
        ctx.lineTo(new_x, new_y);
      }
    }

    ctx.stroke();
  }

  Asteroid.prototype.spawn = function() {
    if(this.mass > 1) {
      for(var i = 0; i < 2; i++) {
        var momentum = this.mass / (this.mass - 1 ) * Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2))
        newAsteroid = Asteroid.random(this.game,
                                      this.pos.slice(0),
                                      this.mass - 1,
                                      momentum);
        this.game.asteroids.push(newAsteroid);
      }
    }
  }
})(this);