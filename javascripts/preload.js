$(document).ready(function() {
  var $gameContainer = AsteroidsUI.$gameContainer = $("#asteroids-game");

  AsteroidsUI.imagesHash = {
    // loading view
    $loadingTextImg: jQuery("<img/>", {
      class: "loading-text-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/loading-image.png"
    }),

    // menu view
    $mainMenuImg: jQuery("<img/>", {
      class: "main-menu-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/asteroids-main-menu.png"
    }),

    // about view
    $aboutImg: jQuery("<img/>",{
      class: "about-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/asteroids-about-image.png"
    }),

    // help view
    $helpImg: jQuery("<img/>",{
      class: "help-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/asteroids-help-image.png"
    }),

    // high scores view
    $highScoresImg: jQuery("<img/>",{
      class: "high-scores-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/asteroids-high-scores.png"
    }),

    // game view
    $getReadyImg: jQuery("<img/>",{
      class: "get-ready-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/get-ready.png"
    }),

    $gameOverImg: jQuery("<img/>",{
      class: "game-over-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/game-over.png"
    }),

    $youWinImg: jQuery("<img/>",{
      class: "you-win-image",
      src: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/you-win.png"
    })
  };

  AsteroidsUI.initializeLoadingView();

  AsteroidsUI.soundsArray = new Array;
  soundManager.setup({
    url: "https://s3-us-west-1.amazonaws.com/polaris-pillar-main/soundmanager2.swf",
    flashVersion: 8,
    onready: function() {

      soundManager.createSound({
        id: "explode1",
        url: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/explode1.wav",
        autoLoad: true,
        autoPlay: false,
        stream: false,
        onload: function() {
          AsteroidsUI.soundsArray.push(this);
        },
        volume: 100
      });

      soundManager.createSound({
        id: "life",
        url: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/life.wav",
        autoLoad: true,
        autoPlay: false,
        stream: false,
        onload: function() {
          AsteroidsUI.soundsArray.push(this);
        },
        volume: 100
      });

      soundManager.createSound({
        id: "explode2",
        url: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/explode2.wav",
        autoLoad: true,
        autoPlay: false,
        stream: false,
        onload: function() {
          AsteroidsUI.soundsArray.push(this);
        },
        volume: 100
      });

      soundManager.createSound({
        id: "explode3",
        url: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/explode3.wav",
        autoLoad: true,
        autoPlay: false,
        stream: false,
        onload: function() {
          AsteroidsUI.soundsArray.push(this);
        },
        volume: 100
      });

      soundManager.createSound({
        id: "fire",
        url: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/fire.wav",
        autoLoad: true,
        autoPlay: false,
        stream: false,
        onload: function() {
          AsteroidsUI.soundsArray.push(this);
        },
        volume: 100
      });

      soundManager.createSound({
        id: "thrust",
        url: "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/thrust.wav",
        autoLoad: true,
        autoPlay: false,
        stream: false,
        onload: function() {
          AsteroidsUI.soundsArray.push(this);
        },
        volume: 100
      });
    }
  });

  var tryLoad = function() {
    var imagesLoaded = function() {
      var loaded = true;
      $.each(AsteroidsUI.imagesHash, function(index,value) {
        if(!value.get()[0].complete) {
          loaded = false;
          return;
        }
      });
      return loaded;
    } 
    if(imagesLoaded() && AsteroidsUI.soundsArray.length == 6) {
      AsteroidsUI.initializeMainMenu();
    } else {
      setTimeout(function() {
        tryLoad();
      }, 1000);
    }
  }
  tryLoad();
});