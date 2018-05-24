#!/usr/bin/env node

const request = require('request'),
  config = require('./lib/config'),
  form = {};

const key = config.getKey();

// Construct the url
const url = `https://maker.ifttt.com/trigger/${
  program.args[0]
}/with/key/${key}`;

if (program.args[1]) {
  form['value1'] = program.args[1];
}

if (program.args[2]) {
  form['value2'] = program.args[2];
}

if (program.args[3]) {
  form['value3'] = program.args[3];
}

request({ url, form }, (error, response, body) => {
  if (error) {
    return console.log('Error:', errror);
  }

  if (response.statusCode !== 200) {
    return console.log('Invalid Status Code Returned:', response.statusCode);
  }

  console.log('Maker recipe request sent.');
});
