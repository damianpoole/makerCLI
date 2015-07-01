#!/usr/bin/env node

var request = require('request'),
    program = require('commander'),
    url,
    value1,
    value2,
    value3,
    form = {};

program
    .parse(process.argv);

// Construct the url
url = 'https://maker.ifttt.com/trigger/' + program.args[0] + '/with/key/c0CYQqUu-Py-rmAaew-Y3N'

if (program.args[1]) {
    form['value1'] = program.args[1];
}

if (program.args[2]) {
    form['value2'] = program.args[2];
}

if (program.args[3]) {
    form['value3'] = program.args[3];
}

request({url: url, form: form}, function (error, response, body) {
    if (error) {
        return console.log('Error:', errror);
    }

    if (response.statusCode !== 200) {
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }

    console.log('Maker recipe has run.');
});
