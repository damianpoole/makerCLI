const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const program = require('commander');
const config = require('./config');

test('getKey reads the configured token from ~/.maker', t => {
    const originalReadFileSync = fs.readFileSync;
    const originalHome = os.homedir;
    let requestedPath;

    os.homedir = () => '/test/home';
    fs.readFileSync = filePath => {
        requestedPath = filePath;
        return '123456';
    };
    t.after(() => {
        fs.readFileSync = originalReadFileSync;
        os.homedir = originalHome;
    });

    assert.equal(config.getKey(), '123456');
    assert.equal(requestedPath, path.join('/test/home', '.maker'));
});

test('getKey propagates file read errors', t => {
    const originalReadFileSync = fs.readFileSync;
    fs.readFileSync = () => {
        throw new Error('config file missing');
    };
    t.after(() => {
        fs.readFileSync = originalReadFileSync;
    });

    assert.throws(() => config.getKey(), /config file missing/);
});

test('getArgs reports a missing event name', t => {
    const originalParse = program.parse;
    const originalArgs = program.args;
    const originalConsoleError = console.error;
    const errors = [];

    program.parse = () => {
        program.args = [];
    };
    console.error = message => {
        errors.push(message);
    };
    t.after(() => {
        program.parse = originalParse;
        program.args = originalArgs;
        console.error = originalConsoleError;
    });

    assert.equal(config.getArgs(), undefined);
    assert.deepEqual(errors, ['An Event name is required.']);
});

test('getArgs returns the event name', t => {
    const originalParse = program.parse;
    const originalArgs = program.args;
    program.parse = () => {
        program.args = ['myEventName'];
    };
    t.after(() => {
        program.parse = originalParse;
        program.args = originalArgs;
    });

    assert.deepEqual(config.getArgs(), {
        event: 'myEventName',
        value1: undefined,
        value2: undefined,
        value3: undefined
    });
});

test('getArgs returns all form values', t => {
    const originalParse = program.parse;
    const originalArgs = program.args;
    program.parse = () => {
        program.args = ['myEventName', 'arg1', 'arg2', 'arg3'];
    };
    t.after(() => {
        program.parse = originalParse;
        program.args = originalArgs;
    });

    assert.deepEqual(config.getArgs(), {
        event: 'myEventName',
        value1: 'arg1',
        value2: 'arg2',
        value3: 'arg3'
    });
});
