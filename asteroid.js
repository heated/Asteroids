(function (root) {
  Function.prototype.inherits = function (parent) {
    var Surrogate = function() {};
    Surrogate.prototype = parent.prototype;
    this.prototype = new Surrogate();
  };

  var Asteroids = root.Asteroids = (root.Asteroids || {});


  var Asteroid = Asteroids.Asteroid = function(pos, vel) {
    Asteroids.MovingObject.call(this, pos, vel, Asteroid.RADIUS, Asteroid.COLOR);
    this.rotation = Math.random() * Math.PI * 2;
    this.poly = ((Math.random() * 4) | 0) + 5;
  };

  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.COLOR = "white";
  Asteroid.RADIUS = 10;

  Asteroid.randomAsteroid = function(BOARDSIZE) {
    var x = Math.random() * BOARDSIZE[0];
    var y = Math.random() * BOARDSIZE[1];

    var angle = Math.random() * Math.PI * 2;
    var speed = 3.0;
    var xSpd = speed * Math.cos(angle);
    var ySpd = speed * Math.sin(angle);

    var pos = [x, y];
    var vel = [xSpd, ySpd];

    return new Asteroid(pos, vel);
  };

  Asteroid.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();


    for(var i = 0; i <= this.poly; i++) {
      new_angle = this.rotation + Math.PI * 2 * i / this.poly;
      new_x = this.pos[0] + this.radius * Math.cos(new_angle);
      new_y = this.pos[1] + this.radius * Math.sin(new_angle);
      if(i == 0) {
        ctx.moveTo(new_x, new_y);
      } else {
        ctx.lineTo(new_x, new_y);
      }
    }
    ctx.stroke();
  }
})(this);