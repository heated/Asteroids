(function (root) {
  Function.prototype.inherits = function (parent) {
    var Surrogate = function() {};
    Surrogate.prototype = parent.prototype;
    this.prototype = new Surrogate();
  };

  var Asteroids = root.Asteroids = (root.Asteroids || {});


  var Asteroid = Asteroids.Asteroid = function(pos, vel, rotSpd, mass) {
    var rotation = Math.random() * Math.PI * 2;
    var radius = mass * 10;
    this.mass = mass;
    Asteroids.MovingObject.call(this, pos, vel, rotation, rotSpd, radius, Asteroid.COLOR);
    this.poly = ((Math.random() * 4) | 0) + 5;
  };

  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.COLOR = "white";

  Asteroid.randomAsteroid = function(BOARDSIZE, pos, mass) {
    var x = Math.random() * BOARDSIZE[0];
    var y = Math.random() * BOARDSIZE[1];

    var angle = Math.random() * Math.PI * 2;
    var speed = 1.0;
    var xSpd = speed * Math.cos(angle);
    var ySpd = speed * Math.sin(angle);

    var pos = pos || [x, y];
    var vel = [xSpd, ySpd];
    var rotSpd = (Math.random() - 0.5) / 10;
    var mass = mass || (1 + (Math.random() * 3) | 0);

    return new Asteroid(pos, vel, rotSpd, mass);
  };

  Asteroid.spawn = function(pos, mass) {
    return Asteroid.randomAsteroid(Asteroids.BOARDSIZE, pos, mass);
  }

  Asteroid.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();

    for(var i = 0; i <= this.poly; i++) {
      new_angle = this.rotation + Math.PI * 2 * i / this.poly;
      new_x = this.pos[0] - 30 + this.radius * Math.cos(new_angle);
      new_y = this.pos[1] - 30 + this.radius * Math.sin(new_angle);

      if(i == 0) {
        ctx.moveTo(new_x, new_y);
      } else {
        ctx.lineTo(new_x, new_y);
      }
    }

    ctx.stroke();
  }

  Asteroid.prototype.spawn = function(game) {
    if(this.mass > 1) {
      for(var i = 0; i < 3; i++) {
        game.asteroids.push(Asteroid.spawn(this.pos.slice(0), this.mass - 1));
      }
    }
  }
})(this);