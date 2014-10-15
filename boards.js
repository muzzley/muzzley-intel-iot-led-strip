module.exports = {
  GALILEO: {
    setup: './board_config/galileo',
    spi: '/dev/spidev1.0'
  },
  GALILEO_GEN2: {
    setup: './board_config/galileo_gen2',
    spi: '/dev/spidev1.0'
  },
  EDISON: {
    setup: './board_config/edison',
    spi: '/dev/spidev5.1'
  }
};
