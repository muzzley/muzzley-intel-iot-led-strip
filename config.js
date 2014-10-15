var boards = require('./boards.js');

module.exports = {
  board: boards.EDISON,  // Available boards: boards.GALILEO, boards.GALILEO_GEN2, boards.EDISON
  muzzley: {
    token: '' // Get it on www.muzzley.com, create an account, then create app to get an app token
  },

  widgets:{
    // Feel free to use this interface
    wmcInterface: 'f0705f5a-2c06-4bdc-8bf1-5b69365188b6'
  },

  ledStripe: {
    ledsNum: 30
  },

  //Pins 4, 5, 6, 7, 8, 9 for Galileo
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
