(function(root) {
  var AsteroidsUI = root.AsteroidsUI = (root.AsteroidsUI || {});
  var currentView = AsteroidsUI.currentView = null;
  var swapView = AsteroidsUI.swapView = function(view, showCallbacks, hideCallbacks) {
    AsteroidsUI.currentView && AsteroidsUI.currentView.hideView(hideCallbacks); // also unbinds event listeners
    AsteroidsUI.currentView = view;
    view.showView(showCallbacks);
  };

  AsteroidsUI.s3AmazonBucket = "https://s3-us-west-2.amazonaws.com/polaris-asteroids-main/"
  AsteroidsUI.highScoresHost = "http://polaris-portfolio.herokuapp.com/scores/"

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
    var loadingView = AsteroidsUI.loadingView = new CView({
      parent: $loadingDiv,
      target: $gameContainer,
      visible: true,
      transitionTime: 0
    });

    loadingView.$loadingTextDiv = loadingView.loadElement(jQuery("<div/>", {
      class: "loading-text-div"
    }));

    loadingView.$loadingTextDiv.text("Loading");

    loadingView.animating = true;
    loadingView.animation = function() {
      if (loadingView.animating) {
        var wait = 500;
        for(var i = 0; i < 3; i++) {
          window.setTimeout(function() {
            var div = loadingView.$loadingTextDiv;
            div.text(div.text() + ".");
          }, wait);
          wait += 500;
        }
        window.setTimeout(function() {
          loadingView.$loadingTextDiv.text("Loading");
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

      var mainMenuView = AsteroidsUI.mainMenuView = new CView({
        parent: $mainMenuDiv,
        target: $gameContainer,
        visible: true,
        transitionTime: 0
      });
      mainMenuView.$mainMenuImg = mainMenuView.loadElement(images.$mainMenuImg);

      var $newGameLink = mainMenuView.$newGameLink = mainMenuView.createLink("new-game");
      var $helpLink = mainMenuView.$helpLink = mainMenuView.createLink("help");
      var $aboutLink = mainMenuView.$aboutLink = mainMenuView.createLink("about");
      var $highScoresLink  = mainMenuView.$highScoresLink = mainMenuView.createLink("high-scores");

      var elements = [$newGameLink, $helpLink, $aboutLink, $highScoresLink];
      elements.forEach(function(element) {
        element.addClass("main-menu-link");
      });

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
          AsteroidsUI.initializeHighScores();
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
      var aboutView = AsteroidsUI.aboutView = new CView({
        parent: $aboutDiv,
        target: $gameContainer,
        visible: true,
        transitionTime: 0
      });
      aboutView.$aboutImg = aboutView.loadElement(images.$aboutImg);

      aboutView.$heatedLink = aboutView.createLink("heated");
      aboutView.$polarisLink = aboutView.createLink("polaris");

      aboutView.$heatedLink.addClass("outbound-link");
      aboutView.$polarisLink.addClass("outbound-link");

      aboutView.$backLink = aboutView.createLink("back-link about-back");
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
      var helpView = AsteroidsUI.helpView = new CView({
        parent: $helpDiv,
        target: $gameContainer,
        visible: true,
        transitionTime: 0
      });
      helpView.$helpImg = helpView.loadElement(images.$helpImg);

      helpView.$backLink = helpView.createLink("back-link help-back");
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

  AsteroidsUI.highScoresArray = [];

  AsteroidsUI.getHighScores = function(callbacks) {
    $.ajax({
      type: "GET",
      url: AsteroidsUI.highScoresHost + "2.js",
      crossDomain: true,
      dataType: "jsonp",
      success: function(scoresArray) {
        AsteroidsUI.highScoresArray = scoresArray;
        callbacks.success && callbacks.success();
        return scoresArray;
      },
      error: function() {
        callbacks.error && callbacks.error();
        return false;
      },
      timeout: 8000
    });
  };

  // AsteroidsUI.specialCharacterString = function(character) {
  //     switch(character) {
  //       case " ":
  //         return "space";
  //         break;
  //     }
  //     return character.toLowerCase();
  // }

  // AsteroidsUI.convertTextToImage = function(incString, size) {
  //   var imagesArray = [];
  //   incString.split("").forEach(function(character) {
  //     var url_character = AsteroidsUI.specialCharacterString(character);
  //     var currentDiv = $("<div/>", {
  //       class: "letter-container" + "-" + (size === undefined ? "small" : size)
  //     });
  //     currentDiv.append(AsteroidsUI.imagesHash["$" + url_character + "Img"].clone())
  //     imagesArray.push(currentDiv);
  //   });
  //   return imagesArray;
  // };

  /* The functions above were part of an attempt to create custom font text by 
   * using rasterized versions of font characters. The logic worked, but the
   * feature presented poorly due to resize sampling. There was also a better 
   * alternative by using CSS @font-face, which is now employed in the app. */

  AsteroidsUI.initializeHighScores = function() {
    if(AsteroidsUI.highScoresView === undefined) {
      var images = AsteroidsUI.imagesHash;
      var $gameContainer = AsteroidsUI.$gameContainer;

      var $highScoresDiv = $("<div/>", {
        class: "high-scores-div",
        tabIndex: AsteroidsUI.getTabIndex()
      });
      var highScoresView = AsteroidsUI.highScoresView = new CView({
        parent: $highScoresDiv,
        target: $gameContainer,
        visible: true,
        transitionTime: 0
      });

      var $nameDiv = jQuery("<div/>", {
        class: "high-score-name high-score"
      });
      var $valueDiv = jQuery("<div/>", {
        class: "high-score-value high-score"
      });
      var $levelDiv = jQuery("<div/>", {
        class: "high-score-level high-score"
      });

      $nameDiv.text("Player");
      $valueDiv.text("Score");
      $levelDiv.text("Level");

      [$nameDiv, $valueDiv, $levelDiv].forEach(function(element) {
        highScoresView.loadElement(element);
        element.css({top: "19.5%"});
      });

      highScoresView.$highScoresImg = highScoresView.loadElement(images.$highScoresImg);

      AsteroidsUI.populateHighScores(0, 10);

      highScoresView.$backLink = highScoresView.createLink("back-link high-scores-back");
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

      highScoresView.page = 1;

      highScoresView.startLoop = function() {
        highScoresView.loop = window.setTimeout(function() {
          var page = AsteroidsUI.highScoresView.page;
          AsteroidsUI.highScoresView.page = page == 1 ? 2 : 1;
          page = page == 1 ? 2 : 1;
          var start = page == 1 ? 0 : 10;
          var finish = page == 1 ? 10 : 20;
          AsteroidsUI.reviseHighScoreDivs(start, finish);
          highScoresView.startLoop();
        }, 8000);
      }

      highScoresView.hideView = function() {
        highScoresView.page = 1;
        window.clearTimeout(highScoresView.loop);
        AsteroidsUI.reviseHighScoreDivs(0, 10);
        CView.prototype.hideView.call(this);
      };
    } else {
      AsteroidsUI.reviseHighScoreDivs(0, 10);
    }
    Starfield.attachTo(AsteroidsUI.highScoresView.parent);
    AsteroidsUI.swapView(AsteroidsUI.highScoresView, [
      AsteroidsUI.highScoresView.linkHandlers,
      AsteroidsUI.highScoresView.keyHandlers,
      AsteroidsUI.highScoresView.startLoop,
      function() {
        AsteroidsUI.highScoresView.parent.focus();
      }
    ]);
  };

  AsteroidsUI.populateHighScores = function() {
    AsteroidsUI.getHighScores({
      success: function() {
        AsteroidsUI.highScoresArray.slice(0, 10).forEach(function(score, index) {
          var $currentRank = AsteroidsUI.highScoresView["$rank" + index] = jQuery("<div/>", {
            class: "high-score-rank high-score"
          });
          var $currentName = AsteroidsUI.highScoresView["$name" + index] = jQuery("<div/>", {
            class: "high-score-name high-score"
          });
          var $currentValue = AsteroidsUI.highScoresView["$value" + index] = jQuery("<div/>", {
            class: "high-score-value high-score"
          });
          var $currentLevel = AsteroidsUI.highScoresView["$level" + index] = jQuery("<div/>", {
            class: "high-score-level high-score"
          });
          
          var currentElements = [$currentRank, $currentName, $currentValue, $currentLevel];

          $currentRank.text(index + 1);
          $currentName.text(score.player.slice(0, 10));
          $currentValue.text(score.value);
          $currentLevel.text(score.level);

          currentElements.forEach(function($element) {
            $element.css({top: 28 + index * 6 + "%"});
            AsteroidsUI.highScoresView.loadElement($element);
          });
        });
      }
    });
  };

  AsteroidsUI.reviseHighScoreDivs = function(start, finish) {
    AsteroidsUI.getHighScores({
      success: function() {
        AsteroidsUI.highScoresArray.slice(start, finish).forEach(function(score, index) {
          var $currentRank = AsteroidsUI.highScoresView["$rank" + index];
          var $currentName = AsteroidsUI.highScoresView["$name" + index];
          var $currentValue = AsteroidsUI.highScoresView["$value" + index];
          var $currentLevel = AsteroidsUI.highScoresView["$level" + index];

          var currentElements = [$currentName, $currentValue, $currentLevel];

          $currentRank.text(index + start + 1);
          $currentName.text(score.player.slice(0, 10));
          $currentValue.text(score.value);
          $currentLevel.text(score.level);
        });
      }
    });
  };

  AsteroidsUI.initializeHighScoresEntry = function(scoreObject) {
    if(AsteroidsUI.highScoresEntryView === undefined) {
      var images = AsteroidsUI.imagesHash;
      var $gameContainer = AsteroidsUI.$gameContainer;

      var $highScoresEntryDiv = jQuery("<div/>", {
        class: "high-scores-entry-div",
        tabIndex: this.getTabIndex
      });

      var highScoresEntryView = AsteroidsUI.highScoresEntryView = new CView({
        parent: $highScoresEntryDiv,
        target: $gameContainer,
        visible: true,
        transitionTime: 0
      });

      var $highScoresEntryImg = highScoresEntryView.loadElement(images.$highScoresEntryImg);

      highScoresEntryView.entryString = "";
      var $entryBox = highScoresEntryView.$entryBox = highScoresEntryView.loadElement(jQuery("<div/>", {
        class: "high-scores-name-entry"
      }));
      $entryBox.text("__________");

      highScoresEntryView.$backLink = highScoresEntryView.createLink("back-link hsev-back");
      highScoresEntryView.linkHandlers = function() {
        this.$backLink.click(function() {
          AsteroidsUI.initializeMainMenu();
        });
      };

      highScoresEntryView.keyHandlers = function() {
        var that = this;
        this.parent.keydown(function(event) {
          event.preventDefault();
          event.stopPropagation();
          if(event.which == 27) {
            AsteroidsUI.initializeMainMenu();
          } else if ((event.which >= 33 && event.which <= 126)
            && that.entryString.length < 10) {
            that.entryString += String.fromCharCode(event.which);
            that.$entryBox.text((that.entryString + "__________").slice(0, 10));
          } else if (event.which == 8) {
            that.entryString = that.entryString.substr(0, that.entryString.length - 1);
            that.$entryBox.text((that.entryString + "__________").slice(0, 10));
          } else if (event.which == 13) {
            if(that.entryString !== "") {
              that.submitting = true;
              that.scoreObject.score.player = that.entryString;
              that.submitScore(that.scoreObject);
            } else {
              AsteroidsUI.initializeMainMenu();
            }
          }
        });
      };

      highScoresEntryView.submitScore = function() {
        var that = this;
        $.ajax({
          type: "POST",
          url: AsteroidsUI.highScoresHost,
          data: that.scoreObject,
          crossDomain: true,
          dataType: "json",
          success: function(a, b, c) {
            alert("Congrobulations! Score sent.");
            AsteroidsUI.initializeHighScores();
          },
          error: function(a, b, c) {
            alert("Could not send score :(");
            var fillerScore = that.scoreObject;
            AsteroidsUI.initializeHighScoresEntry(fillerScore);
          },
          complete: function() {
            that.submitting = false;
          }
        });
      };

      highScoresEntryView.clearInput = function(scoreObject) {
        this.scoreObject = scoreObject || null;
        this.entryString = "";
        this.$entryBox.text("__________");
      };

      highScoresEntryView.hideView = function(scoreObject) {
        this.clearInput(scoreObject);
        CView.prototype.hideView.call(this);
      };
    }
    var view = AsteroidsUI.highScoresEntryView;
    view.scoreObject = scoreObject;
    Starfield.attachTo(view.parent);
    AsteroidsUI.swapView(view, [
      function() {
        view.linkHandlers.call(view);
        view.keyHandlers.call(view);
        view.parent.focus();
      }
    ]);
  };

  AsteroidsUI.UICallbacks = {
    checkHighScore: function() {
      var game = AsteroidsUI.game;
      var score = game.score;
      var level = game.level;
      var elapsed = game.totalElapsed;
      var lives = game.lives;

      if(score % 10 !== 0 ||
        (lives > 0 && level !== 50) ||
        level * 300 > elapsed ||
        level > 50 ||
        lives > elapsed) {
        alert("Nope ;)");
        AsteroidsUI.initializeMainMenu();
        Starfield.start(AsteroidsUI.$gameContainer);
      }
      score += game.lives * 1000;
      score *= 1 + level/100;
      var scoreObject;
      var callback = function() {
        scoreObject = {
          score: {
            "game_id": 2,
            "player": "",
            "value": score,
            "level": level
          }
        };
      };
      AsteroidsUI.getHighScores({
        success: function() {
          var hiScores = AsteroidsUI.highScoresArray;
          if(score > hiScores[hiScores.length - 1].value) {
            callback();
            AsteroidsUI.initializeHighScoresEntry(scoreObject);
            Starfield.start(AsteroidsUI.$gameContainer);
          } else {
            AsteroidsUI.initializeMainMenu();
            Starfield.start(AsteroidsUI.$gameContainer);
          }
        },
        error: function() {
          alert("Could not reach high scores server");
          AsteroidsUI.initializeMainMenu();
          Starfield.start(AsteroidsUI.$gameContainer);
        }
      });
    },
    preparation: function() {
      AsteroidsUI.gameView.$getReadyDiv.css({opacity: 1});
    },
    endPreparation: function() {
      AsteroidsUI.gameView.$getReadyDiv.css({opacity: 0});
    },
    update: function() {
      AsteroidsUI.gameView.$scoreHolder.text("Score " + AsteroidsUI.game.score);
      AsteroidsUI.gameView.$livesHolder.text("Lives " + AsteroidsUI.game.lives);
      AsteroidsUI.gameView.$levelHolder.text("Level " + AsteroidsUI.game.level)
    },
    beforeLoss: function() {
      AsteroidsUI.gameView.$gameOverDiv.css({opacity: 1});
    },
    loss: function() {
      AsteroidsUI.gameView.$gameOverDiv.css({opacity: 0});
      this.checkHighScore();
      createjs.Sound.stop();
    },
    win: function() {
      AsteroidsUI.gameView.$youWinDiv.css({opacity: 1});
      var that = this;
      window.setTimeout(function() {
        AsteroidsUI.gameView.$youWinDiv.css({opacity: 0});
        that.checkHighScore();
        createjs.Sound.stop();
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
      var gameView = AsteroidsUI.gameView = new CView({
        parent: $canvasContainer,
        target: $gameContainer,
        visible: true,
        transitionTime: 0
      });

      gameView.$scoreHolder = gameView.loadElement(jQuery("<div/>"));
      gameView.$livesHolder = gameView.loadElement(jQuery("<div/>"));
      gameView.$levelHolder = gameView.loadElement(jQuery("<div/>"));

      gameView.$scoreHolder.addClass("asteroids-score-holder game-holder");
      gameView.$livesHolder.addClass("asteroids-lives-holder game-holder");
      gameView.$levelHolder.addClass("asteroids-level-holder game-holder");

      gameView.$getReadyDiv = gameView.loadElement($("<div/>", {
        class: "get-ready-div game-text"
      }));
      gameView.$getReadyDiv.text("get ready");
      gameView.$gameOverDiv = gameView.loadElement($("<div/>", {
        class: "game-over-div game-text"
      }));
      gameView.$gameOverDiv.text("game over");
      gameView.$youWinDiv = gameView.loadElement($("<div/>", {
        class: "you-win-div game-text"
      }));
      gameView.$youWinDiv.text("you win");

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