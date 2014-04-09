Intel® Galileo Muzzley Demos
========================

Control a led strip with your mobile device (iOS and Android) using an [Intel® Galileo Board](http://arduino.cc/en/ArduinoCertified/IntelGalileo)

This demos use [Muzzley](http://www.muzzley.com) for the Mobile <-> Galileo signaling and mobile views development.

To try the demo you can git clone this repository, download the full ready to run image or download the ready to run app package (links at the botttom of the page)

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
  - Intel Galileo Board
  - Micro SD card
  - Digital RGB Led Strip
  - External power supply for the led strip (If the ledstrip is long)

[Wiring diagram 1](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/docs/wiring_diagram.png)

[Wiring diagram 2](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/docs/another_wiring_diagram.png)


### Software Requirements

It is required:
  - Linux image in the SD card
  - Muzzley account
  - Node.js
  - Npm and its dependencies
  - Git


### Documentation

Download the Installation/usage guide here:

[Project manual](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/docs/manual.pdf)


### Image File

If you prefer you can download our ready to run image. This image contains linux with the essencials to run the demos, demos included, no need for extra compiling.

[Download the demo image file](https://cdn.muzzley.com/intel/muzzley_galileo_1.4.1.gz)

MD5 Sum
31ddbd53dfd214ed2722fb5b6e8e0cb6  muzzley_galileo_1.4.1.gz

See the documentation for the installation/usage guide.


If you wish to try this demos in the [IoT Devkit](http://software.intel.com/en-us/iotdevkit) or other image, a ready to run app with all the dependencies is availble for download [here](http://cdn.muzzley.com/intel/MuzzleyGalileoDemos_Devkit1.0.tar.gz)

In order to use it you just need to type "wget http://cdn.muzzley.com/intel/MuzzleyGalileoDemos_Devkit1.0.tar.gz -O -| tar -zxvf -
" in the galileo shell.

Edit the config.js file, check how to configure it in the manual.


### Screenshots

[Ledstrip view](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/Screenshots/ledstrip_control.png)

[Pin debugger view](https://raw.github.com/v0od0oChild/MuzzleyGalileoDemos/master/Screenshots/pin_debugger.png)
