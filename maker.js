#!/usr/bin/env node

var fs = require('fs'),
    request = require('request'),
    program = require('commander'),
    osenv = require('osenv'),
    home = osenv.home(),
    url,
    value1,
    value2,
    value3,
    form = {},
    key;

program
    .parse(process.argv);

key = fs.readFileSync(home + '/.maker', 'utf8');

// Construct the url
url = 'https://maker.ifttt.com/trigger/' + program.args[0] + '/with/key/' + key;

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
