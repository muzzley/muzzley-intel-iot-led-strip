Intel® Galileo Muzzley Demos
========================

### Latest updates

The ledstrip demo is now supported on the following boards:
  - Intel® Galileo
  - Intel® Galileo Gen2
  - Intel® Edison

If using Edison, it i required to install the git package:
  - Ensure that you have enabled and established Wi-Fi connection on Edison - explained here.
  - Run command: wget http://iotdk.intel.com/repos/1.1/iotdk/i586/git_1.9.0-r0_i586.ipk
  - Then run: opkg install git_1.9.0-r0_i586.ipk

To run:
  - Clone this project using `git clone https://github.com/muzzley/muzzley-intel-iot-led-strip.git`
  - Check if the board date is updated with the command `date`, if required, adjust it with the command `date -s "16 OCT 2014 12:00:00"`
  - Enter the project folder and run `npm install`
  - Edit `config.js` file:
      - Select the current board from the options: *boards.GALILEO*, *boards.GALILEO_GEN2* or *boards.EDISON*
      - Insert the Muzzley App token, you can get one in www.muzzley.com  > apps > create new app
  - To start the app run `node index.js`
  - The application QR code and the Activity ID will appear on the console. Scan QR code or insert ID in a mobile device using the Muzzley app




### Project description

Control a led strip with your mobile device (iOS and Android) using the Intel® boards: Galileo, Galileo Gen2 and Edison.

This demos use [Muzzley](http://www.muzzley.com) for the Mobile <-> Intel boards signaling and mobile views development.

To try the demo you can git clone this repository or download the ready to run app package (links at the botttom of the page). This demo runs with the Intel® IoT Devkit image which supports Nodejs.

### About the demos

Two demos are available:
  - Galileo Pin Debugger

  This demo allows the user to read and write to the galileo board pins. Allowed values are 0 and 1 and the allowed directions are In and Out. Beware that you can only change a value if the direction is set to Out.
  By default the galileo pins 4, 5, 6, 7, 8, 9 and the on-board LED were made available (GPIOs 28, 17, 24, 27, 26, 19, 3).
  Clicking on a pin will show you a popup which will allow you to do such operations. You can try for instance connecting a LED to a specific pin and use the mobile device to turn it on and off setting the direction to out and switching between values 0 and 1

[![Demo preview](http://img.youtube.com/vi/jFUH83UqZxQ/0.jpg)](http://www.youtube.com/watch?v=jFUH83UqZxQ)

[http://www.youtube.com/watch?v=jFUH83UqZxQ](http://www.youtube.com/watch?v=jFUH83UqZxQ)

  - Digital RGB Ledstrip Control

  This one allows the user to control a LED strip. You can fill it with colors or play some colorful animations. Picking the color, selecting an effect or adjusting brightness will trigger the animation with the selected parameters. The color palette is available on clicking the custom color button, you can try slowly dragging your finger in the color palette and watch the LED strip changing colors in real time.

[![Demo preview](http://img.youtube.com/vi/O7mNqinRV5s/0.jpg)](http://www.youtube.com/watch?v=O7mNqinRV5s)

[http://www.youtube.com/watch?v=O7mNqinRV5s](http://www.youtube.com/watch?v=O7mNqinRV5s)

### Hardware Requirements

In order to run those demos it's required:
  - Intel Galileo / Intel Galileo Gen2 / Intel Edison
  - Micro SD card (Galileo boards only)
  - Digital RGB Led Strip
  - External power supply for the led strip (If the ledstrip is long and require more amperes)

[Wiring diagram 1](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/docs/wiring_diagram.png)

[Wiring diagram 2](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/docs/another_wiring_diagram.png)


### Other Requirements

It is also required:
  - Latest Intel® IoT Devkit image in the SD card (Galileo boards only)
  - Muzzley account


### Documentation

Download the Installation/usage guide here:

[Project manual](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/docs/manual_v1.3.pdf)


### Image File (Galileo 1)

If you already have the [IoT Devkit](http://software.intel.com/en-us/iotdevkit) or other image, a ready to run app with all the dependencies is availble for download [here](http://cdn.muzzley.com/intel/MuzzleyGalileoDemos_Devkit1.0.tar.gz)

In order to use it you just need to type "wget http://cdn.muzzley.com/intel/MuzzleyGalileoDemos_Devkit1.0.tar.gz -O -| tar -zxvf -
" in the galileo shell, since the image doesn't contain the git package and it will be a struggle to npm install without it.

Edit the config.js file, check how to configure it in the manual.
To start the app type "node galileo.js"


### Screenshots

[Ledstrip view](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/Screenshots/ledstrip_control.png)

[Pin debugger view](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/Screenshots/pin_debugger.png)
