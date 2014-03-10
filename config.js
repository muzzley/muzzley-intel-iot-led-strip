module.exports = {

  muzzley: {
    token: ""
  },

  widgets:{
    wmcInterface: ""
  },

  ledStripe: {
    ledsNum: 97,
    spiDevice: '/dev/spidev1.0'
  },

  //Pins 4, 5, 6, 7, 8, 9
  pinout: [
    {pin: '4', gpio: '28'},
    {pin: '5', gpio: '17'},
    {pin: '6', gpio: '24'},
    {pin: '7', gpio: '27'},
    {pin: '8', gpio: '26'},
    {pin: '9', gpio: '19'},
    {pin: 'led', gpio: '3'}
  ]
};
