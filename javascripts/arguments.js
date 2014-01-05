function sum() {
  var args = Array.prototype.slice.call(arguments);
  var result = 0;
  for(var i = 0; i < args.length; i++) {
    result += args[i];
  }
  return result;
}

Function.prototype.myBind = function(obj) {
  var that = this;
  return function() {
    that.apply(obj, arguments);
  }
}

function add(a) {
  this.result += a;
}

var what = {
  result: 0
};

add.myBind(what)(5);

// what == { result = 5; }

var curriedSum = function(numArgs) {
  var numbers = [];
  var _curriedSum = function (num) {
    numbers.push(num);
    if (numbers.length === numArgs) {
      return sum.apply(this, numbers);
    } else {
      return _curriedSum;
    }
  }
  return _curriedSum;
}

var sumthing = curriedSum(4);
console.log(sumthing(5)(30)(20)(1)); // => 56

Function.prototype.curry = function(numArgs) {
  var that = this;
  var _args = [];
  var _curry = function (obj) {
    _args.push(obj);
    if (_args.length === numArgs) {
      return that.apply(this, _args);
    } else {
      return _curry;
    }
  }
  return _curry;
}

function sumThree(num1, num2, num3) {
  return num1 + num2 + num3;
}

sumThree(4, 20, 3); // == 27

// you'll write `Function#curry`!
var f1 = sumThree.curry(3);
var f2 = f1(4);
var f3 = f2(20);
var result = f3(3); // = 27

// or more briefly:
console.log(sumThree.curry(3)(4)(20)(3)); // == 27