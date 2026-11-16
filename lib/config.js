const fs = require('fs');
const os = require('os');
const path = require('path');
const program = require('commander');

const getKey = () => fs.readFileSync(path.join(os.homedir(), '.maker'), 'utf8');

const getArgs = () => {
    program.parse(process.argv);

    if (!program.args[0]) {
        return console.error('An Event name is required.');
    }

    return {
        event: program.args[0],
        value1: program.args[1],
        value2: program.args[2],
        value3: program.args[3]
    };
};

module.exports = {
    getArgs: getArgs,
    getKey: getKey
};
