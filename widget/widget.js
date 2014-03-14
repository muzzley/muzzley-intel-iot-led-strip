var muzzley = muzzley || new function() { this.on=function(){}; this.send = function(){};};
var windowHeight;
var windowWidth;
var oldRgbValue;
var rgbValue = {r: 255, g: 255, b:255};
var msgTimeout;
var effect="fill";
var firstTime=true;
var delay = 10;
var brightness= 0.5;

muzzley.ready( function(params){
    muzzley.send("webview-ready");
});


$(document).ready(function() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    
    //378*268
    var newWidth = windowWidth/1.2;
    var newHeight = 0;
    if(newWidth > 220){
        newWidth = windowWidth/1.2; newHeight = (newWidth*247)/378;
    }else{
        newWidth = 220; newHeight = (newWidth*247)/378;
    }
    
    $("#galileo-img").width(newWidth);
    $("#galileo-img").height(newHeight);
    $("#galileo-img").css("padding-top", 10+"px");
    $("#galileo-img").css("padding-left", 10+"px");
    $("#inside-box").width(newWidth-20);
    $("#inside-box").height(newHeight-20);
    
    var contentView = $("#muzzley-view").height();
    var margin = windowHeight -contentView - 60; margin = margin/2;
    console.log(margin);
    $("#muzzley-view").css("margin-top", margin+"px");
    
    $("#v-slider1").slider({
        value: 50,
        change: function(){
           if(effect !== "fade" && effect !== "flash" && effect !== "ledsoff"){
                msgTimeout = msgTimeout || setTimeout(function(){
                    clearTimeout(msgTimeout);
                    msgTimeout = null;
                    brightness = $("#v-slider1").slider("value");
                    brightness = brightness/100;
                    console.log(brightness);
                    if(effect === "fill"){
                        sendColorValues();
                    }else{
                        console.log("send brightness "+brightness);
                        muzzley.send("setBrightness", {brightness:brightness});
                    }
                }, 50);
            }
        }
    });
    
    $('.demo').each( function() {
        $(this).minicolors({
            control: $(this).attr('data-control') || 'hue',
            defaultValue: $(this).attr('data-defaultValue') || '',
            inline: $(this).attr('data-inline') === 'true',
            letterCase: $(this).attr('data-letterCase') || 'lowercase',
            position: $(this).attr('data-position') || 'bottom left',
            change: function(hex, opacity) {
                if( !hex ) return;
                try {
                    oldRgbValue = rgbValue;
                    rgbValue = hexToRgb(hex);
                    colorPicker();
                } catch(e) {}
            },
            theme: 'bootstrap',
            changeDelay: delay,
            show: function(){ 
                console.log("show");
                firstTime = true;
            }
        });
        
    });

    $("#pin-map-view").show(); $("#led-stripe-view").hide();
    $("#pin-map-btn").css("color", "#00AEEF"); $("#led-stripe-btn").css("color", "#000");
});

function colorPicker(){
    $('.lightcolor').css('border', 'none');
    sendColorValues();
}


$("#send-color-btn").on("click", function(){
    $("#send-color-btn").css({"background-color": "#00AEEF", "border": "solid 2px #00AEEF"});
    firstTime = true;
    setTimeout(function(){
        $("#send-color-btn").css({"background-color": "#333333", "border": "solid 2px #333333"});
    }, 1000);
    sendColorValues();
});

function sendColorValues(){
    brightness = $( "#v-slider1" ).slider("option", "value"); 
    brightness = brightness/100;
    console.log("send rgb: "+rgbValue.r+ " " +rgbValue.g+ " " +rgbValue.b+ " " + brightness + " " + effect);
    muzzley.send("setColor", {r:rgbValue.r, g: rgbValue.g, b: rgbValue.b, brightness: brightness, effect: effect}, 
            function(err, data){ }
    );
}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

$("#pin-map-btn").on("click", function(){
    muzzley.send("participantView", {view: 'pinMap'}); firstTime=true;
    $("#pin-map-view").show(); $("#led-stripe-view").hide();
    $("#pin-map-btn").css("color", "#00AEEF"); $("#led-stripe-btn").css("color", "#000");
});
$("#led-stripe-btn").on("click", function(){
    muzzley.send("participantView", {view: 'ledStripe'}); firstTime=true;
    if(effect === "fill"){
        delay = 10;
    }else{
        delay = 1000;
    }
    $("#pin-map-view").hide(); $("#led-stripe-view").show();
    $("#pin-map-btn").css("color", "#000"); $("#led-stripe-btn").css("color", "#00AEEF");
    rgbValue = {r: 255, g: 255, b:255};
    $("#slider" ).slider("option", "value", 50); 
    $("#input-1").attr('checked', true);
});

muzzley.on('pinValues', function(data){
  for(var i=0; i<data.length; ++i){
      var pin = data[i].pin;
      $('#pin-'+data[i].pin+" .value").text(data[i].value);
  }
});

var pinSelected ="";
$(".pin-button").on("click", function(){
    var pin = $(this).data("target-pin");
    pinSelected = pin; firstTime = true;
    
    muzzley.send('getPinData', {pin: pin}, function(err, data){ 
        if(data){
            $("#inside-box").show();
            setPinData(data.value, pin, data.direction);
        }
    });
});

function setPinData(value, pin, direction){
    $("#input-value").val(value);
    $("#pin-name").text("Pin "+pin);
    $('#pin-'+pin+" .value").text(value);
    if(direction === "in"){
        $("#input-on").attr('checked', true);
        $("#pin-value").hide();
    }else if(direction === "out"){
        $("#input-out").attr('checked', true);
        $("#pin-value").show();
    }
}

$('input[type=radio]').click(function(){
    if($('#input-on').is(':checked')){
      $("#pin-value").hide();
    }else if($('#input-out').is(':checked')){
        $("#pin-value").show();
    }
});


$("#send-btn").on("click", function(){
    var message = $('#input-value').val();
    var direction ="";
    if($('#input-on').is(':checked')){
        direction = "in";
    }else if($('#input-out').is(':checked')){
        direction = "out";
    }
    
    muzzley.send("setPinData", {pin:pinSelected, direction: direction, value: message},  function(err, data){
        //$('#pin-'+pinSelected+" .value").text(message);
        if(data){
            setPinData(data.value, data.pin, data.direction);
        }
    });
    $("#inside-box").hide();
});

$('.colorpoint').on('click', function(){
     var object = $(this).attr('id');
     $('.lightcolor').css('border', 'none'); 
     $(this).children('#lightcolor').css('border', '5px solid #c3c3c3');

     switch(parseInt(object)){
        case 1: rgbValue = {r: 102, g: 204, b:255}; break;
        case 2: rgbValue = {r: 51, g: 102, b: 204}; break;
        case 3: rgbValue = {r: 51, g: 204, b: 102}; break;
        case 4: rgbValue = {r: 146, g: 248, b: 95}; break;
        case 5: rgbValue = {r: 252, g: 250, b: 77}; break;
        case 6: rgbValue = {r: 255, g: 153, b: 51}; break;
        case 7: rgbValue = {r: 255, g: 51, b: 51}; break;
        case 8: rgbValue = {r: 255, g: 153, b: 255}; break;
        case 9: rgbValue = {r: 158, g: 102, b: 255}; break;
     }
     sendColorValues();
});

$(".dropdown-menu li").on("click", function(event){
    var target = $(event.currentTarget);
    $("#dropdown-select").text(target.text());
    var data =  $(this).data("target-effect");
    effect = data;
    if(effect === "fill"){ delay = 10;
    }else{ delay = 1000; }
    if(effect === "rainbow" || effect === "muzzleyintel" || effect === "ledsoff"){
        $("#palete-title").hide(); $(".light-screen").hide();
        $("#custom-title").hide(); $(".minicolors").hide();
        sendColorValues();
    }else{
        $("#palete-title").show(); $(".light-screen").show();
        $("#custom-title").show(); $(".minicolors").show();
        if(effect === "fade" || effect === "flash"){
            $("#brightness-title").hide(); $("#brightness-slider").hide();
        }else{
            $("#brightness-title").show(); $("#brightness-slider").show();
        }
        if(oldRgbValue !== rgbValue){
            sendColorValues();
        }
    }
});


