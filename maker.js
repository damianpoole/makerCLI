#!/usr/bin/env node

const config = require('./lib/config');
const { createRequest } = require('./lib/maker');

const args = config.getArgs();

if (!args) {
    process.exitCode = 1;
} else {
    const form = {};

    if (args.value1) {
        form.value1 = args.value1;
    }

    if (args.value2) {
        form.value2 = args.value2;
    }

    if (args.value3) {
        form.value3 = args.value3;
    }

    createRequest(args.event, config.getKey(), form, (error, response) => {
        if (error) {
            console.log('Error:', error);
            process.exitCode = 1;
            return;
        }

        if (response.statusCode !== 200) {
            console.log('Invalid Status Code Returned:', response.statusCode);
            process.exitCode = 1;
            return;
        }

        console.log('Maker recipe request sent.');
    });
}
