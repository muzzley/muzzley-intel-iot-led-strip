var Color = require("color");
var LPD8806 = require('lpd8806-async');
var config = require("../config");
var async = require("async");

var leds = new LPD8806(config.ledStripe.ledsNum, '/dev/spidev1.0');
leds.fillRGB(0, 0, 0);

//var animation = new Animation(config.ledStripe.ledsNum);
var animationRunning = false;
var stopAnimationRequest = false;

//LPD8806.updateBrightness(0.3); //Value must Between 0.0 and 1.0
//LPD8806.update(); //To write the new Buffer
//LPD8806.fillRGB(255, 120, 140); //ROT, GREEN, BLUE
//LPD8806.fillHSV(0.0, 100.0, 100.0); //HSV Values
//LPD8806.allOFF();
//LPD8806.setPixel(new Color({r: 0, g: 0, b: 255}));
//LPD8806.setPixelRGB(0, 0, 255); //RED, GREEN, BLUE
//LPD8806.setPixelHSV(0.0, 100.0, 100.0) //HSV Values
//LPD8806.setPixelOff(pixelNumber);

function switchAnimation(cb){
  if(!animationRunning){
    return startAnimation(cb);
  }

  stopAnimationRequest = true;

  if(animationRunning){
    setTimeout(function(){
      switchAnimation(cb);
    }, 100);
  }else{
    startAnimation(cb);
  }
}

function startAnimation(cb){
  console.log("Starting animation..");
  stopAnimationRequest = false;
  animationRunning = true;
  return cb();
}

function stopAnimation(){
  console.log("Animation stopped..");
  animationRunning = false;
  //leds.allOFF();
  return;
}

module.exports.lightsOff = function(){
  switchAnimation(function(){
    console.log("[info]", "Setting Leds Off");
    leds.allOFF();
    stopAnimation();
  });
};


module.exports.setBrightness = function(brightness){
  if(brightness) leds.setMasterBrightness(brightness);
    console.log("[info]", "Setting brightness", brightness);
};


module.exports.setColor = function(r, g, b, brightness){
  switchAnimation(function(){
    console.log("[info]", "Filling leds with",r,g,b,brightness);
    if(brightness) leds.setMasterBrightness(brightness);
    leds.fillRGB(r,g,b);
    stopAnimation();
  });
};

module.exports.displayIntro = function(brightness){
	switchAnimation(function(){
    var ledCount = config.ledStripe.ledsNum;
    if(ledCount %2 !== 0) --ledCount;
    brightness = brightness || 1.0;
    leds.setMasterBrightness(brightness);
    console.log("[info]", "Playing muzzley intel animation",brightness);

    function performStep(){
      if (stopAnimationRequest){
        stopAnimation();
        return;
      }
      leds.allOFF();
      var j = 0;
      async.whilst(function(){
          return (j < ledCount && !stopAnimationRequest);
        },function (callback) {
          setTimeout(function(){
            if(j < ledCount/2){
              leds.setPixelRGB(j, 255, 0, 0);
              if(j>0) leds.setPixelRGB(j-1, 0, 0, 0);
              leds.setPixelRGB(ledCount-j-1, 0, 0, 255);
              if(j>0) leds.setPixelRGB(ledCount-j, 0, 0, 0);
              if(j==ledCount){
                leds.setPixelRGB(ledCount, 0, 0, 0);
                leds.setPixelRGB(0, 0, 0, 0);
              }
            }
            if(j > ledCount/2){
              leds.setPixelRGB(ledCount-j, 255, 0, 0);
              leds.setPixelRGB(j, 0, 0, 255);
            }
            leds.update();
            j++;
            callback();
          }, 60);
        }, function (err){
          process.nextTick(performStep);
        });
    }
    performStep();
  });
};



module.exports.joinEffect = function(r, g, b, brightness){
	switchAnimation(function(){
    console.log("[info]", "Playing join animation",r,g,b,brightness);
    var ledCount = config.ledStripe.ledsNum;
    if(ledCount %2 !== 0) --ledCount;
    brightness = brightness || 1.0;
    leds.setMasterBrightness(brightness);

    function performStep(){
      if (stopAnimationRequest){
        stopAnimation();
        return;
      }
      var j = 0;
      leds.allOFF();
      async.whilst(function(){
        return (j < ledCount && !stopAnimationRequest);
      },function (callback) {
        setTimeout(function(){
          if(j < ledCount/2){
            leds.setPixelRGB(j, r, g, b);
            if(j>0) leds.setPixelRGB(j-1, 0, 0, 0);
            leds.setPixelRGB(ledCount-j-1, r, g, b);
            if(j>0) leds.setPixelRGB(ledCount-j, 0, 0, 0);
            if(j==ledCount){
              leds.setPixelRGB(ledCount, 0, 0, 0);
              leds.setPixelRGB(0, 0, 0, 0);
            }
            leds.update();
          }
          j++;
          callback();
        }, 40);
      }, function (err) {
        process.nextTick(performStep);
      });
    }
    performStep();
  });
};




module.exports.flow = function(r, g, b, brightness){
  switchAnimation(function(){
    console.log("[info]", "Playing knight rider animation",r,g,b,brightness);
    var ledCount = config.ledStripe.ledsNum;
    brightness = brightness || 1.0;
    leds.setMasterBrightness(brightness);

    function performStep(){
      if (stopAnimationRequest){
        stopAnimation();
        return;
      }
      leds.allOFF();
      var j = 0;
      async.whilst(function(){
        return (j < ledCount && !stopAnimationRequest);
      },function (callback) {
        
        setTimeout(function(){
          leds.setPixelRGB(j, r, g, b);
          if(j>0) leds.setPixelRGB(j-1, 0, 0, 0);
          leds.update();
          j++;
          callback();
        }, 4);
      }, function (err) {
        if (stopAnimationRequest){
          stopAnimation();
          return;
        }
        process.nextTick(function(){
          var i = 0;
          async.whilst(function(){
              return (i < ledCount && !stopAnimationRequest);
            },function (callback) {
              setTimeout(function(){
                leds.setPixelRGB(ledCount-i-1, r, g, b);
                if(i>0) leds.setPixelRGB(ledCount-i, 0, 0, 0);
                leds.update();
                i++;
                callback();
              }, 7);
            }, function (err) {
              process.nextTick(performStep);
            });
        });
      });
    }
    performStep();
  });
};

module.exports.flashColor = function(r, g, b){
	switchAnimation(function(){
    console.log("[info]", "Flashing color",r,g,b);
    flashEffect(r, g, b, 0.09);
  });
};

module.exports.fadeColor = function(r, g, b){
  switchAnimation(function(){
    console.log("[info]", "Fading color",r,g,b);
    flashEffect(r, g, b, 0.01);
  });
};

module.exports.rainbow = function(brightness){
  switchAnimation(function(){
    console.log("[info]", "Playing rainbow animation",brightness);
		var ledCount = config.ledStripe.ledsNum;
		var _step = 0;
    var start = 0;
    leds.allOFF();
    brightness = brightness || 1.0;
    leds.setMasterBrightness(brightness);
    var i = 0;

    function performStep() {
      if (stopAnimationRequest){
        stopAnimation();
        return;
      }
      var amt = 1;
      for(var p = 0; p < ledCount; p++){
        var color = (p + _step) % 384;
        leds.setPixel(start + p, leds.wheel_color(color));
      }
      leds.update();
      _step += amt;
      var overflow = _step - 384;
      if(overflow >= 0){
        _step = overflow;
      }

      if (++i >= 384) {
        i = 0;
      }
      setTimeout(performStep, 80);
    }
    performStep();
	});
};



function flashEffect(r, g, b, speed){
  var i = 0;
  var step = speed;

  function performStep(){
    if (stopAnimationRequest){
      stopAnimation();
      return;
    }
    var level = 0.01,
    dir = step;
      
    async.whilst(function(){
      return (level >= 0.0 && !stopAnimationRequest);
    },function (callback) {
      setTimeout(function(){
        leds.setMasterBrightness(level);
        leds.fill(new Color({r: r, g: g, b: b}));
        if(level >= 0.99){
          dir =- step;
        }
        level += dir;
        callback();
      },4);
    }, function (err) {
      process.nextTick(performStep);
    });
  }
  performStep();
}