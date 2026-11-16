const https = require('https');
const querystring = require('querystring');

const createRequest = (event, key, form, callback) => {
    const url = `https://maker.ifttt.com/trigger/${encodeURIComponent(
        event
    )}/with/key/${encodeURIComponent(key)}`;
    const body = querystring.stringify(form);
    let completed = false;

    const finish = (error, response) => {
        if (completed) {
            return;
        }

        completed = true;
        callback(error, response);
    };

    const request = https.request(
        url,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(body)
            }
        },
        response => {
            response.on('error', error => finish(error));
            response.on('end', () => finish(null, response));
            response.resume();
        }
    );

    request.on('error', error => finish(error));
    request.end(body);
    return request;
};

module.exports = {
    createRequest
};
