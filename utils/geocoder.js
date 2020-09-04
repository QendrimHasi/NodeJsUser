const NodeGeoCoder = require('node-geocoder');
//ndodhe nje bug dhe nga njehere geokoder nuk po i lexon te dhenat nga .env
const option = {
  provider: process.env.Ggprovider || 'mapquest',
  httpAdapter: 'https',
  apiKey: process.env.gkey || 'rXwdVmoUeyioOQSIa8SZNHA17Ro7p15Q',
  formatter: null,
};

const geo = NodeGeoCoder(option);

module.exports = geo;
