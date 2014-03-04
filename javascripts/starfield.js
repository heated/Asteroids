(function(root) {
  var Starfield = root.Starfield = (root.Starfield || {});
  Starfield.size = 500;
  Starfield.starnumber = 50;
  Starfield.$defaultEl = $("<div/>", {
    class: "starfield"
  });
  Starfield.$el = Starfield.$defaultEl;
  var starArray = Starfield.starArray = [];
  var center = Starfield.size/2 - 1;

  Starfield.starloop = function(jQelement) {
    var maxMoreStars = 4;
    var missingStars = this.starnumber - this.starArray.length;
    for(var i = 0; i < missingStars; i++) {
      if(maxMoreStars > 0) {
        var newStar = new Star(jQelement);
        this.starArray.push(newStar);
        maxMoreStars--;
      }
    }
    var starIndex = 0;
    starArray.forEach(function(star) {
      star.step();
      if(star.isOutOfBounds()){
        starArray.splice(starIndex, 1);
        star.removeSelf.call(star);
      }
      starIndex++;
    });
    var that = this;
    Starfield.loopTimeout = setTimeout(that.starloop.bind(that, jQelement), 30);
  };

  Starfield.start = function(jQelement) {
    if(jQelement !== undefined) {
      Starfield.$el = jQelement;
    } else {
      Starfield.$el.appendTo("body");
    }
    Starfield.starloop();
  }

  Starfield.stop = function() {
    window.clearInterval(Starfield.loopTimeout);
  };

  Starfield.suspend = function() {
    Starfield.stop();
    Starfield.starArray.forEach(function(star) {
      star.removeSelf();
    });
  };

  Starfield.hide = function() {
    Starfield.starArray.forEach(function(star) {
      star.css({opacity: 0});
    });
  };

  Starfield.show = function() {
    Starfield.starArray.forEach(function(star) {
      star.css({opacity: 1});
    });
  };

  Starfield.attachTo = function(jQelement) {
    Starfield.$el = jQelement;
    Starfield.starArray.forEach(function(star) {
      star.$el.appendTo(jQelement);
    });
  }

  root.Star = function Star(jQelement) {
    this.$el = jQuery("<div/>", {
      class: "starfield-star"
    });
    this.size = 1;
    var spawnLoc = [this.randomLocation(), this.randomLocation()];
    var direction = this.direction = [
      (spawnLoc[0] - center)/Starfield.size,
      (spawnLoc[1] - center)/Starfield.size
    ];
    var location = this.location = spawnLoc;
    this.speed = 7 + Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
    this.acceleration = 10;
    this.$el.css({
      left: (location[0] + 1),
      top: (location[1] + 1)
    });
    this.$el.appendTo(jQelement === undefined ? Starfield.$el : jQelement);
  };

  Star.prototype.randomLocation = function() {
    var size = Starfield.size;
    var randomNum = size/4 + Math.floor(Math.random() * size/2) - 1;
    return randomNum;
  };

  Star.prototype.checkToClear = function() {
    if(this.size > Starfield.size/100 + 2) {
      this.removeSelf();
    }
  };

  Star.prototype.step = function() {
    this.checkToClear();
    this.location[0] += this.speed * this.direction[0];
    this.location[1] += this.speed * this.direction[1];
    this.speed += this.acceleration;
    this.size *= 1.02;
    this.$el.css({
      left: this.location[0],
      top: this.location[1],
      height: this.size,
      width: this.size
    });
  };

  Star.prototype.isOutOfBounds = function() {
    return this.location[0] < 0 || this.location[1] < 0 || this.location[1] > 499 || this.location[1] > 499;
  };

  Star.prototype.removeSelf = function() {
    this.$el.remove();
  };
})(this);