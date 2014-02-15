Function.prototype.inherits = function(parent) {
  var Surrogate = function() {};
  Surrogate.prototype = parent.prototype;
  this.prototype = new Surrogate();
}

function MovingObject(x, y) {
  this.x = x;
  this.y = y;
};

MovingObject.prototype.update = function(modX, modY) {
  this.x += modX;
  this.y += modY;

}
function Ship(x, y) {
  MovingObject.call(this, x, y);
};

Ship.inherits(MovingObject);

Ship.prototype.update = function() {
  this.x += 10;
  this.y += 15;
}

function Asteroid(x, y) {
  MovingObject.call(this, x, y);
};

Asteroid.inherits(MovingObject);

var galactica = new Ship(20, 50);
galactica.update();
var epsilonSevenNiner = new Asteroid(50, 100);
epsilonSevenNiner.update(20, 20);

console.log(galactica.x);
console.log(epsilonSevenNiner.y);