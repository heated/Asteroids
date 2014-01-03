(function (root) {
  Function.prototype.inherits = function (parent) {
    var Surrogate = function() {};
    Surrogate.prototype = parent.prototype;
    this.prototype = new Surrogate();
  };

  var Asteroids = root.Asteroids = (root.Asteroids || {});


  var Asteroid = Asteroids.Asteroid = function(pos, vel) {
    Asteroids.MovingObject.call(this, pos, vel, Asteroid.RADIUS, Asteroid.COLOR);
  };

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

  Asteroid.inherits(Asteroids.MovingObject);

})(this);