$(document).ready(function() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  var $gameContainer = AsteroidsUI.$gameContainer = $("#asteroids-game");
  var s3AmazonBucket = AsteroidsUI.s3AmazonBucket;

  if ($gameContainer.attr("id") !== undefined) {
    AsteroidsUI.imagesHash = {
      // menu view
      $mainMenuImg: jQuery("<img/>", {
        class: "main-menu-image",
        src: s3AmazonBucket + "asteroids-main-menu.png"
      }),

      // about view
      $aboutImg: jQuery("<img/>",{
        class: "about-image",
        src: s3AmazonBucket + "asteroids-about-image.png"
      }),

      // help view
      $helpImg: jQuery("<img/>",{
        class: "help-image",
        src: s3AmazonBucket + "asteroids-help-image.png"
      }),

      // high scores view
      $highScoresImg: jQuery("<img/>",{
        class: "high-scores-image",
        src: s3AmazonBucket + "asteroids-high-scores.png"
      }),

      // enter high score view
      $highScoresEntryImg: jQuery("<img/>",{
        class: "high-scores-entry-image",
        src: s3AmazonBucket + "asteroids-enter-high-score.png"
      }),
    };

    // "abcdefghijklmnopqrstuvwxyz1234567890 ".split("").forEach(function(character) {
    //   var url_character = AsteroidsUI.specialCharacterString(character);
    //   AsteroidsUI.imagesHash["$" + url_character + "Img"] = jQuery("<img/>", {
    //     src: s3AmazonBucket + "characters/" + url_character + "-image.png"
    //   });
    // });

    // Another artifact from attempting to parse strings to a series of inline images

    AsteroidsUI.initializeLoadingView();

    if (!createjs.Sound.registerPlugins([createjs.WebAudioPlugin, 
      createjs.HTMLAudioPlugin])) {
      return;
    }
    var manifest = [
        {id:"lsaucer", src:"lsaucer.ogg", data: 4, volume:.5},
        {id:"ssaucer", src:"ssaucer.ogg", data: 4, volume:.5},
        {id:"explode1", src:"explode1.ogg", data: 4},
        {id:"explode2", src:"explode2.ogg", data: 4},
        {id:"explode3", src:"explode3.ogg", data: 4},
        {id:"life", src:"life.ogg", data: 4},
        {id:"fire", src:"fire.ogg", data: 4},
        {id:"sfire", src:"sfire.ogg", data: 4},
        {id:"thrust", src:"thrust.ogg", data: 99},
    ];
 
    var numSoundsLoaded = 0;

    function handleLoad(event) {
      numSoundsLoaded += 1;
    };

    createjs.Sound.alternateExtensions = ["wav"];

    createjs.Sound.addEventListener("fileload", handleLoad);
    createjs.Sound.registerManifest(manifest, s3AmazonBucket + "sound/");
     
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
      if(imagesLoaded() && numSoundsLoaded == 9) {
        AsteroidsUI.initializeMainMenu();
      } else {
        setTimeout(function() {
          tryLoad();
        }, 1000);
      }
    }
    tryLoad();
  }
});