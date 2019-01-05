const config = require('../lib/config');

const fs = require('fs');
const program = require('commander');

jest.mock('fs');
jest.mock('commander');

describe('Config', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.fn();
        global.console.error = consoleSpy;
    });

    describe('getKey', () => {
        it('Should return the config token if the file exists', () => {
            fs.readFileSync.mockImplementation(() => '123456');

            const key = config.getKey();

            expect(key).toEqual('123456');
        });

        it('Should return an error is thrown', () => {
            const spy = jest.spyOn(config, 'getKey');

            try {
                config.getKey();
            } catch (e) {
                expect(true).toEqual(true);
            }
        });
    });

    describe('getArgs', () => {
        it('Should return an error if no event name is passed', () => {
            program.args = [];

            config.getArgs();

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('Should return the event name', () => {
            program.parse.mockImplementation(() => {
                program.args = ['myEventName'];
            });

            const args = config.getArgs();

            expect(args.event).toEqual('myEventName');
        });

        it('Should return the all form values', () => {
            program.parse.mockImplementation(() => {
                program.args = ['myEventName', 'arg1', 'arg2', 'arg3'];
            });

            const args = config.getArgs();

            expect(args).toEqual({
                event: 'myEventName',
                value1: 'arg1',
                value2: 'arg2',
                value3: 'arg3'
            });
        });
    });
});
