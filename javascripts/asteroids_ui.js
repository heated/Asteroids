(function(root) {
  var AsteroidsUI = root.AsteroidsUI = (root.AsteroidsUI || {});
  var currentView = AsteroidsUI.currentView = null;
  var swapView = AsteroidsUI.swapView = function(view, showCallbacks, hideCallbacks) {
    AsteroidsUI.currentView && AsteroidsUI.currentView.hideView(hideCallbacks); // also unbinds event listeners
    AsteroidsUI.currentView = view;
    view.showView(showCallbacks);
  };

  AsteroidsUI.tabIndexForView = 0;
  AsteroidsUI.getTabIndex = function() {
    AsteroidsUI.tabIndexForView++;
    return AsteroidsUI.tabIndexForView - 1;
  };

  AsteroidsUI.initializeLoadingView = function() {
    var images = AsteroidsUI.imagesHash;
    var $gameContainer = AsteroidsUI.$gameContainer;

    var $loadingDiv = jQuery("<div/>", {
      class: "loading-background"
    });
    var loadingView = AsteroidsUI.loadingView = new CView($loadingDiv, $gameContainer, true);

    loadingView.$loadingTextImg = loadingView.loadElement(images.$loadingTextImg);

    loadingView.$ellipsisOne = loadingView.loadElement(jQuery("<div/>", {
      class: "loading-ellipsis ellipsis-one"
    }));
    loadingView.$ellipsisTwo = loadingView.loadElement(jQuery("<div/>", {
      class: "loading-ellipsis ellipsis-two"
    }));
    loadingView.$ellipsisThree = loadingView.loadElement(jQuery("<div/>", {
      class: "loading-ellipsis ellipsis-three"
    }));

    loadingView.ellipses = [
      loadingView.$ellipsisOne,
      loadingView.$ellipsisTwo,
      loadingView.$ellipsisThree,
    ];

    loadingView.animating = true;
    loadingView.animation = function() {
      if (loadingView.animating) {
        var wait = 500;
        loadingView.ellipses.forEach(function(ellipsis) {
          window.setTimeout(function() {
            ellipsis.css({
              opacity: 1
            });
          }, wait);
          wait += 500;
        });
        window.setTimeout(function() {
          loadingView.ellipses.forEach(function(ellipsis) {
            ellipsis.css({
              opacity: 0
            })
          });
          loadingView.animation();
        }, wait);
      }
    };

    loadingView.hideView = function() {
      CView.prototype.hideView.call(this, [function() { loadingView.animating = false }]);
    };

    loadingView.showView = function() {
      CView.prototype.showView.call(this, [function() { loadingView.animating = true }]);
    };

    loadingView.animation();
    AsteroidsUI.swapView(this.loadingView);
  };

  AsteroidsUI.initializeMainMenu = function() {
    if(AsteroidsUI.mainMenuView === undefined) {
      var images = AsteroidsUI.imagesHash;
      var $gameContainer = AsteroidsUI.$gameContainer;
      var $mainMenuDiv = AsteroidsUI.$mainMenuDiv = $("<div/>", {
        class: "main-menu-div",
        tabIndex: AsteroidsUI.getTabIndex()
      });
      $mainMenuDiv.css({position: "relative"});

      var mainMenuView = AsteroidsUI.mainMenuView = new CView($mainMenuDiv, $gameContainer, true);
      mainMenuView.$mainMenuImg = mainMenuView.loadElement(images.$mainMenuImg);

      mainMenuView.$newGameLink = mainMenuView.createLink("new-game");
      mainMenuView.$helpLink = mainMenuView.createLink("help");
      mainMenuView.$aboutLink = mainMenuView.createLink("about");
      mainMenuView.$highScoresLink = mainMenuView.createLink("high-scores");

      mainMenuView.$newGameLink.addClass("main-menu-link");
      mainMenuView.$helpLink.addClass("main-menu-link");
      mainMenuView.$aboutLink.addClass("main-menu-link");
      mainMenuView.$highScoresLink.addClass("main-menu-link");

      mainMenuView.linkHandlers = function() {
        mainMenuView.$newGameLink.click(function() {
          AsteroidsUI.startGame();
        });
        mainMenuView.$helpLink.click(function() {
          AsteroidsUI.initializeHelp();
        });
        mainMenuView.$aboutLink.click(function() {
          AsteroidsUI.initializeAbout();
        });
        mainMenuView.$highScoresLink.click(function() {
          AsteroidsUI.intializeHighScores();
        });

        $(".main-menu-link").hover(function(event) {
          $(event.target).addClass("selected");
          if ($(event.target).hasClass("selected")) {
            mainMenuView.onHoverAnimOn = setTimeout(function() {
              $(event.target).css({
                opacity: 1
              });
            }, 250);
            mainMenuView.onHoverAnimOff = setTimeout(function() {
              $(event.target).css({
                opacity: 0
              });
              mainMenuView.onHoverAnimOn = setTimeout(function() {
                $(event.target).trigger("mouseenter");
              }, 250);
            }, 750);
          }
        },
        function(event) {
          $(event.target).removeClass(".selected");
          window.clearInterval(mainMenuView.onHoverAnimOn);
          window.clearInterval(mainMenuView.onHoverAnimOff);
          $(event.target).css({opacity: 0});
        })
      };

      mainMenuView.hideView = function() {
        $(".main-menu-link").css({opacity: 0});
        CView.prototype.hideView.call(this);
      };
      Starfield.start(AsteroidsUI.mainMenuView.parent);
    }
    Starfield.attachTo(AsteroidsUI.mainMenuView.parent);
    AsteroidsUI.swapView(AsteroidsUI.mainMenuView, [
      AsteroidsUI.mainMenuView.linkHandlers
    ]);
  };

  AsteroidsUI.initializeAbout = function() {
    if(AsteroidsUI.aboutView === undefined) {
      var images = AsteroidsUI.imagesHash;
      var $gameContainer = AsteroidsUI.$gameContainer;

      var $aboutDiv = $("<div/>", {
        class: "about-div",
        tabIndex: AsteroidsUI.getTabIndex()
      });
      var aboutView = AsteroidsUI.aboutView = new CView($aboutDiv, $gameContainer, true);
      aboutView.$aboutImg = aboutView.loadElement(images.$aboutImg);

      aboutView.$heatedLink = aboutView.createLink("heated");
      aboutView.$polarisLink = aboutView.createLink("polaris");

      aboutView.$heatedLink.addClass("outbound-link");
      aboutView.$polarisLink.addClass("outbound-link");

      aboutView.$backLink = aboutView.createLink("about-back");
      aboutView.linkHandlers = function() {
        aboutView.$heatedLink.click(function() {
          window.open("https://github.com/heated");
        });
        aboutView.$polarisLink.click(function() {
          window.open("https://github.com/polaris");
        });

        aboutView.$backLink.click(function() {
          AsteroidsUI.initializeMainMenu();
        });
      };

      aboutView.keyHandlers = function() {
        AsteroidsUI.aboutView.parent.keydown(function(event) {
          event.preventDefault();
          event.stopPropagation();
          if(event.which == 27) {
            AsteroidsUI.initializeMainMenu();
          }
        });
      };
    }
    Starfield.attachTo(AsteroidsUI.aboutView.parent);
    AsteroidsUI.swapView(AsteroidsUI.aboutView, [
      AsteroidsUI.aboutView.linkHandlers,
      AsteroidsUI.aboutView.keyHandlers,
      function() {
        window.setTimeout(function() {
          AsteroidsUI.aboutView.$heatedLink.css({
            opacity: 1
          });
          AsteroidsUI.aboutView.$polarisLink.css({
            opacity: 1
          });
        }, 500);
        window.setTimeout(function() {
          AsteroidsUI.aboutView.$heatedLink.css({
            opacity: 0
          });
          AsteroidsUI.aboutView.$polarisLink.css({
            opacity: 0
          });
        }, 750);
        AsteroidsUI.aboutView.parent.focus();
      }
    ]);
  };

  AsteroidsUI.initializeHelp = function() {
    if(AsteroidsUI.helpView === undefined) {
      var images = AsteroidsUI.imagesHash;
      var $gameContainer = AsteroidsUI.$gameContainer;

      var $helpDiv = $("<div/>", {
        class: "help-div",
        tabIndex: AsteroidsUI.getTabIndex()
      });
      var helpView = AsteroidsUI.helpView = new CView($helpDiv, $gameContainer, true);
      helpView.$helpImg = helpView.loadElement(images.$helpImg);

      helpView.$backLink = helpView.createLink("help-back");
      helpView.linkHandlers = function() {
        helpView.$backLink.click(function() {
          AsteroidsUI.initializeMainMenu();
        });
      };

      helpView.keyHandlers = function() {
        AsteroidsUI.helpView.parent.keydown(function(event) {
          event.preventDefault();
          event.stopPropagation();
          if(event.which == 27) {
            AsteroidsUI.initializeMainMenu();
          }
        });
      };
    }
    Starfield.attachTo(AsteroidsUI.helpView.parent);
    AsteroidsUI.swapView(AsteroidsUI.helpView, [
      AsteroidsUI.helpView.linkHandlers,
      AsteroidsUI.helpView.keyHandlers,
      function() {
        AsteroidsUI.helpView.parent.focus();
      }
    ]);
  };

  AsteroidsUI.intializeHighScores = function() {
    if(AsteroidsUI.highScoresView === undefined) {
      var images = AsteroidsUI.imagesHash;
      var $gameContainer = AsteroidsUI.$gameContainer;

      var $highScoresDiv = $("<div/>", {
        class: "high-scores-div",
        tabIndex: AsteroidsUI.getTabIndex()
      });
      var highScoresView = AsteroidsUI.highScoresView = new CView($highScoresDiv, $gameContainer, true);
      highScoresView.$highScoresImg = highScoresView.loadElement(images.$highScoresImg);

      highScoresView.$backLink = highScoresView.createLink("high-scores-back");
      highScoresView.linkHandlers = function() {
        highScoresView.$backLink.click(function() {
          AsteroidsUI.initializeMainMenu();
        });
      };

      highScoresView.keyHandlers = function() {
        AsteroidsUI.highScoresView.parent.keydown(function(event) {
          event.preventDefault();
          event.stopPropagation();
          if(event.which == 27) {
            AsteroidsUI.initializeMainMenu();
          }
        });
      };
    }
    Starfield.attachTo(AsteroidsUI.highScoresView.parent);
    AsteroidsUI.swapView(AsteroidsUI.highScoresView, [
      AsteroidsUI.highScoresView.linkHandlers,
      AsteroidsUI.highScoresView.keyHandlers,
      function() {
        AsteroidsUI.highScoresView.parent.focus();
      }
    ]);
  };

  AsteroidsUI.playerHasHighScore = function() {
    return false;
  };

  AsteroidsUI.sendHighScore = function() {
  };

  AsteroidsUI.renderText = function(incString) {

  };

  Asteroids.checkIsHighScore = function(score) {

  };

  AsteroidsUI.UICallbacks = {
    preparation: function() {
      AsteroidsUI.gameView.$getReadyImg.css({opacity: 1});
    },
    endPreparation: function() {
      AsteroidsUI.gameView.$getReadyImg.css({opacity: 0});
    },
    update: function() {
      AsteroidsUI.gameView.$scoreHolder.text("Score " + AsteroidsUI.game.score);
      AsteroidsUI.gameView.$livesHolder.text("Lives " + AsteroidsUI.game.lives);
      AsteroidsUI.gameView.$levelHolder.text("Level " + AsteroidsUI.game.level)
    },
    beforeLoss: function() {
      AsteroidsUI.gameView.$gameOverImg.css({opacity: 1});
    },
    loss: function() {
      AsteroidsUI.gameView.$gameOverImg.css({opacity: 0});
      AsteroidsUI.initializeMainMenu();
      Starfield.start(AsteroidsUI.$gameContainer); 
    },
    win: function() {
      AsteroidsUI.gameView.$youWinImg.css({opacity: 1});
      var playerName = "";
      if(AsteroidsUI.playerHasHighScore()) {
        var notification = "Congratulations! You got a high score! Enter your name";
        notification += " (alphanumeric characters only) or leave blank to skip."
        prompt(notification, playerName);
      }
      if(playerName !== "") {
        AsteroidsUI.sendHighScore();
      }
      window.setTimeout(function() {
        AsteroidsUI.gameView.$youWinImg.css({opacity: 0});
        AsteroidsUI.initializeMainMenu();
        Starfield.start(AsteroidsUI.$gameContainer);
      }, 2000);
    }
  };

  AsteroidsUI.startGame = function() {
    if(AsteroidsUI.gameView === undefined) {
      var images = AsteroidsUI.imagesHash;
      var $gameContainer = AsteroidsUI.$gameContainer;
      var $canvasContainer = $("<div/>", {
        class: "asteroids-canvas-container"
      });
      var $canvasJQ = $('<canvas id="game">');
      $canvasJQ.appendTo($canvasContainer);
      var canvas = $canvasJQ[0] // Retrieve HTML object
      var gameView = AsteroidsUI.gameView = new CView($canvasContainer, $gameContainer, true);

      gameView.$scoreHolder = gameView.loadElement(jQuery("<div/>"));
      gameView.$livesHolder = gameView.loadElement(jQuery("<div/>"));
      gameView.$levelHolder = gameView.loadElement(jQuery("<div/>"));

      gameView.$scoreHolder.addClass("asteroids-score-holder game-holder");
      gameView.$livesHolder.addClass("asteroids-lives-holder game-holder");
      gameView.$levelHolder.addClass("asteroids-level-holder game-holder");

      gameView.$getReadyImg = gameView.loadElement(images.$getReadyImg);
      gameView.$gameOverImg = gameView.loadElement(images.$gameOverImg);
      gameView.$youWinImg = gameView.loadElement(images.$youWinImg);

      gameView = canvas.width = Asteroids.SIZE;
      gameView = canvas.height = Asteroids.SIZE;
    
      var ctx = canvas.getContext("2d");

      var game = AsteroidsUI.game = new Asteroids.Game(ctx, AsteroidsUI.UICallbacks);
    }
    Starfield.suspend();
    AsteroidsUI.swapView(AsteroidsUI.gameView);
    AsteroidsUI.game.restart();
  };
})(this);