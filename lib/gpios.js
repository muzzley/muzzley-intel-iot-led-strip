var exec = require('child_process').exec;
var async = require('async');
var config = require('../config');

//EventEmitter
var events = require('events');
var util = require('util');

// Light object
var Gpios = function(){
  this.gpios = {};
  this.readTimeout = null;
  events.EventEmitter.call(this);
};

util.inherits(Gpios, events.EventEmitter);


Gpios.prototype.getPins = function(){
	var pins = [];
	for(var i in this.gpios){
    pins.push({pin: i, value: this.gpios[i].value});
	}
  return pins;
};


Gpios.prototype.getPin = function(pin){
  if(this.gpios[pin]) return this.gpios[pin];
};


Gpios.prototype.exportAll = function(callback){
  var self = this;
  async.eachSeries(config.pinout, function(pin, cb){

    unexportGpio(pin.gpio, function(unexportErr){
      exportGpio(pin.gpio, function(exportErr){
        self.gpios[pin.pin] = {gpio: pin.gpio, value: '', direction: ''};
        if(exportErr) console.log("[error]","Failed to export GPIO"+pin.gpio, exportErr);
        if(!exportErr) console.log("[info]","GPIO"+pin.gpio+" exported");
        //setDriveConfig(pin.gpio, 'strong', function(err){
          return cb();
        //});
      });
    });
  }, function(err){
      callback();
  });
};


Gpios.prototype.startReading = function(){
  var self = this;

  function readGpiosLoop(){
    if(self.readTimeout) clearTimeout(self.readTimeout);
    async.eachSeries(config.pinout, function(pin, cb){

      readGpioStatus(pin.gpio, function(readErr, status){
        if(readErr) console.log("[error]","Failed to read GPIO"+pin.gpio, readErr);
        if(!status || !status.value || !status.direction) return cb();
        //console.log("pinstatus", pin, status.value, status.direction);
        if(self.gpios[pin.pin].value != status.value || self.gpios[pin.pin].direction != status.direction){
          self.gpios[pin.pin].value = status.value;
          self.gpios[pin.pin].direction = status.direction;
          console.log("[info]", "Pin "+pin.pin+" changed");
          self.emit("pinChanged", {pin: pin.pin, value: status.value, direction: status.direction});
        }
        cb();
      });
    }, function(err){
      self.readTimeout = setTimeout(readGpiosLoop, 6000);
    });
  }
  readGpiosLoop();
};


Gpios.prototype.stopReadingGpios = function(){
  if(this.readTimeout) clearTimeout(this.readTimeout);
};


Gpios.prototype.unexportAll = function(callback){
  async.eachSeries(config.pinout, function(pin, cb){
    unexportGpio(pin.gpio, function(err){
      return cb();
    });
  }, function(err){
    return callback();
  });
};


Gpios.prototype.readPinStatus = function(pin, cb){
	var gpio = this.gpios[pin].gpio;
  readGpioStatus(gpio, cb);
};


Gpios.prototype.setPinStatus = function(pin, direction, value, cb){
	var gpio = this.gpios[pin].gpio;
	setGpioDirection(gpio, direction, function(dirErr){
		console.log("[info]","Setting GPIO"+gpio+" direction "+direction);
    if(dirErr){
      console.log("[error]","Failed to write gpio direction", dirErr);
      return cb(new Error("Failed to write gpio status"));
    }
    if(direction === 'in') return cb();
    setGpioValue(gpio, value, function(valErr){
      if(valErr) console.log("[error]","Failed writting gpio value", valErr);
      console.log("[info]","Setting GPIO"+gpio+" value "+value);
      return cb();
    });
  });
};



function unexportGpio(gpio, cb){
  var cmd = 'echo -n ' + gpio + ' > /sys/class/gpio/unexport';
  exec(cmd, function(error, stdout, stderr){
    return cb(error);
  });
}



function exportGpio(gpio, cb){
  var cmd = 'echo -n ' + gpio + ' > /sys/class/gpio/export';
  exec(cmd, function(error, stdout, stderr){
    return cb(error);
  });
}


function readGpioStatus(gpio, cb){
  readGpioValue(gpio, function(valErr, value){
    if(valErr) console.log("[error]","Failed to read gpio value", valErr);
    readGpioDirection(gpio, function(dirErr, direction){
      if(dirErr){
        console.log("[error]","Failed to read gpio direction", dirErr);
        return cb(new Error("Failed to read gpio status"));
      }
      return cb(null, {value: value, direction: direction});
    });
  });
}

/**
- strong
- hiz
- pulldown
- pullup
*/
function setDriveConfig(gpio, config, cb){
  var cmd = 'echo -n "'+config+'" > /sys/class/gpio/gpio'+gpio+'/drive';
  exec(cmd, function(error, stdout, stderr){
    if(error) return cb(error);
    return cb();
  });
}


function readGpioValue(gpio, cb){
  var cmd = 'cat /sys/class/gpio/gpio'+gpio+'/value';
  exec(cmd, function(error, stdout, stderr){
    if(error) return cb(error);
    if(!stdout) return cb(new Error("No value outputed"));
    return cb(null, stdout.replace('\n',''));
  });
}


function readGpioDirection(gpio, cb){
  var cmd = 'cat /sys/class/gpio/gpio'+gpio+'/direction';
  exec(cmd, function(error, stdout, stderr){
    if(error) return cb(error);
    if(!stdout) return cb(new Error("No value outputed"));
    return cb(null, stdout.replace('\n',''));
  });
}


// Writing to GPIO Port
function setGpioValue(gpio, value, cb){
  var cmd = 'echo -n "'+value+'" > /sys/class/gpio/gpio'+gpio+'/value';
  exec(cmd, function(error, stdout, stderr){
    return cb(error);
  });
}


function setGpioDirection(gpio, direction, cb){
  var cmd = 'echo -n "'+direction+'" > /sys/class/gpio/gpio'+gpio+'/direction';
  exec(cmd, function(error, stdout, stderr){
    return cb(error);
  });
}


module.exports = new Gpios();