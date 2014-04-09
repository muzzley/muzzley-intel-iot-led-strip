console.log("------- MUZZLEY INTEL GALILEO DEMOS -------------");

var muzzley = require("muzzley-client");
var config = require("./config");
var gpios = require("./lib/gpios");
var ledStripe = require("./lib/ledStripe");
var exec=require('child_process').exec;


var participants = {};

gpios.exportAll(function(){
  exec('./gpio_setup',function(err,stdout,stderr){
    console.log(stdout);
    startMuzzley();
  });
});


function startMuzzley(){
  console.log("[info]", "Starting Muzzley");
  var muzzleyTimer = setTimeout(function(){
    muzzleyTimer.timedOut = true;
    startMuzzley();
  }, 30000);

  // Muzzley participants
  muzzley.connectApp(config.muzzley, function(err, activity){
    if(muzzleyTimer.timedOut === true) return;
    if(err){
      console.log("[error]", "createActivity ", err);
      console.log("info", "Retrying in 5s..");
      clearTimeout(muzzleyTimer);
      setTimeout(startMuzzley, 5000);
      return;
    }

    if(activity.activityId.length > 0) clearTimeout(muzzleyTimer);
    if(!activity.activityId) return;

    console.log("[info]", "Connected. activityId:", activity.activityId);

    gpios.startReading();
    ledStripe.displayIntro();

    activity.on('participantJoin', function(participant) {
      console.log("[info]", participant.name + " joins");
      participants[participant.deviceId] = participant;

      participant.changeWidget('webview', {uuid: config.widgets.wmcInterface, orientation: 'portrait'}, function(err) {
        if (err) return console.log("[error]", "changeWidget", err );

        participant.on('signalingMessage', function(type, message, cb) {
console.log("Received", message);
         if(type === "webview-ready"){
           var pins = gpios.getPins();
           participant.sendSignal('pinValues', pins);
           console.log("Webview ready, updating pins status");
         }

         if(type === "setColor"){
            console.log(message);

            if(message && message.effect === "fill"){
              ledStripe.setColor(message.r, message.g, message.b, message.brightness);
            }
            if(message && message.effect === "flash"){
              ledStripe.flashColor(message.r, message.g, message.b);
            }
            if(message && message.effect === "knight-rider"){
              ledStripe.flow(message.r, message.g, message.b, message.brightness);
            }
            if(message && message.effect === "rainbow"){
              ledStripe.rainbow();
            }
            if(message && message.effect === "fade"){
              ledStripe.fadeColor(message.r, message.g, message.b);
            }
            if(message && message.effect === "muzzleyintel"){
              ledStripe.displayIntro(message.brightness);
            }
            if(message && message.effect === "ledsoff"){
              ledStripe.lightsOff();
            }
            if(message && message.effect === "joineffect"){
              ledStripe.joinEffect(message.r, message.g, message.b, message.brightness);
            }
          }
          if(type === "setBrightness"){
            ledStripe.setBrightness(message.brightness);
          }

          if(type === "getPinData"){
            console.log("Getting Pin data..");
            gpios.readPinStatus(message.pin, function(err, pinData){
              pinData.pin = message.pin;
              cb(true, '', pinData);
            });
          }
          if(type === "setPinData"){
            console.log("Set Pin data..");
            gpios.setPinStatus(message.pin, message.direction, message.value, function(err){
              gpios.readPinStatus(message.pin, function(err, pinValues){
                pinValues.pin = message.pin;
                cb(true, '', pinValues);
              });
            });
          }
        });
      });


      participant.on('quit', function() {
        console.log('[info]', participant.name + " quits");
        if(participant.updateInterval) clearTimeout(participant.updateInterval);
        if(participant.deviceId) delete participants[participant.deviceId];
      });

    });

  });
}


gpios.on('pinChanged', function(pinData){
  for(var participant in participants){
    participants[participant].sendSignal('pinValues', [pinData]);
  }
});


process.on('SIGINT', function() {
  console.log("Shutting down..");
  console.log("Unexporting pins..");
  console.log("Shutting leds down..\n");
  gpios.stopReadingGpios();
  ledStripe.lightsOff();
  gpios.unexportAll(function(){
    process.exit();
  });
});