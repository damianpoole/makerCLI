const assert = require('node:assert/strict');
const { EventEmitter } = require('events');
const test = require('node:test');
const https = require('https');
const { createRequest } = require('./maker');

test('createRequest posts URL-encoded values to the IFTTT Maker endpoint', t => {
    const originalRequest = https.request;
    const clientRequest = new EventEmitter();
    const body = 'value1=hello%20world&value3=x%26y';
    let requestArgs;
    let responseHandler;

    clientRequest.end = bodyValue => {
        assert.equal(bodyValue, body);
    };
    https.request = (url, options, onResponse) => {
        requestArgs = { url, options };
        responseHandler = onResponse;
        return clientRequest;
    };
    t.after(() => {
        https.request = originalRequest;
    });

    const calls = [];
    const callback = (...args) => calls.push(args);
    createRequest(
        'my event',
        'secret/key',
        { value1: 'hello world', value3: 'x&y' },
        callback
    );

    assert.deepEqual(requestArgs, {
        url: 'https://maker.ifttt.com/trigger/my%20event/with/key/secret%2Fkey',
        options: {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(body)
            }
        }
    });

    const response = new EventEmitter();
    response.statusCode = 200;
    response.resume = () => response.emit('end');
    responseHandler(response);
    assert.deepEqual(calls, [[null, response]]);
});

test('createRequest passes HTTPS request errors to the callback', t => {
    const originalRequest = https.request;
    const clientRequest = new EventEmitter();
    clientRequest.end = () => {};
    const error = new Error('connection failed');
    https.request = () => clientRequest;
    t.after(() => {
        https.request = originalRequest;
    });

    const calls = [];
    createRequest('event', 'secret', {}, (...args) => calls.push(args));
    clientRequest.emit('error', error);

    assert.deepEqual(calls, [[error, undefined]]);
});
