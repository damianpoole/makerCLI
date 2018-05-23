const config = require("./config");

const url = `https://maker.ifttt.com/trigger/${
  program.args[0]
}/with/key/${config.getKey()}`;

const createRequest = function() {};

module.exports = {
  createRequest: createRequest
};
