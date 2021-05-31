var rl = require('../index.js');

var testFilePath = './tests/file.txt';
var testBinaryFilePath = './tests/file.zip';
var testUnavailableFilePath = './tests/unavailable.txt';

var emptyResult = '';

describe('oneline() - OK', function () {

    test('read first line', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual('AAAA');
            expect(err).toStrictEqual(null);
            done();
        }

        rl.oneline(testFilePath, 1, callback);
    });

    test('read last line', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual('CCCC');
            expect(err).toStrictEqual(null);
            done();
        }

        rl.oneline(testFilePath, 3, callback);
    });

    test('binary file', function (done) {
        function callback(err, res) {
            expect(Buffer.from(res).toString('base64')).toStrictEqual('UEsDBA==');
            expect(err).toStrictEqual(null);
            done();
        }

        rl.oneline(testBinaryFilePath, 1, callback);
    });

});

describe('oneline() - Invalid path parameter', function () {

    test('unavailable file', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err.message).toStrictEqual(expect.stringMatching(/^ENOENT: no such file or directory, open '.+unavailable.txt'$/));
            done();
        }

        rl.oneline(testUnavailableFilePath, 1, callback);
    });

    test('file path as number', function (done) {
        expect.assertions(4);

        function callback() {
            done();
        }

        try {
            rl.oneline(1, 1, callback);
        } catch (err) {
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('TypeError');
            expect(err.message).toStrictEqual(expect.stringMatching(/must be (a|of type) string or/));
            done();
        }
    });

    test('folder instead of file', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err.message).toStrictEqual('EISDIR: illegal operation on a directory, read');
            done();
        }

        rl.oneline('.', 1, callback);
    });

});

describe('oneline() - Invalid row parameter', function () {

    test('read line after last line', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('RangeError');
            expect(err.message).toStrictEqual('Line index to read was not found');
            done();
        }

        rl.oneline(testFilePath, 4, callback);
    });

    test('read line 0', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('RangeError');
            expect(err.message).toStrictEqual('Line index to read must be greater than zero');
            done();
        }

        rl.oneline(testFilePath, 0, callback);
    });

    test('read line -1', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('RangeError');
            expect(err.message).toStrictEqual('Line index to read must be greater than zero');
            done();
        }

        rl.oneline(testFilePath, -1, callback);
    });

    test('read unavailable line', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('RangeError');
            expect(err.message).toStrictEqual('Line index to read was not found');
            done();
        }

        rl.oneline(testFilePath, 100, callback);
    });

    test('invalid line format (letter)', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('TypeError');
            expect(err.message).toStrictEqual('Line index to read must be supplied as integer');
            done();
        }

        rl.oneline(testFilePath, 'a', callback);
    });

    test('invalid line format (float)', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('TypeError');
            expect(err.message).toStrictEqual('Line index to read must be supplied as integer');
            done();
        }

        rl.oneline(testFilePath, 1.1, callback);
    });

    test('invalid line format (array)', function (done) {
        function callback(err, res) {
            expect(res).toStrictEqual(emptyResult);
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('TypeError');
            expect(err.message).toStrictEqual('Line index to read must be supplied as integer');
            done();
        }

        rl.oneline(testFilePath, ['a'], callback);
    });

});

describe('oneline() - Invalid callback parameter', function () {

    test('callback is not a function (number)', function () {
        expect.assertions(4);
        try {
            rl.oneline(testFilePath, 1, 1);
        } catch (err) {
            expect(err).toHaveProperty('name');
            expect(err).toHaveProperty('message');
            expect(err.name).toStrictEqual('TypeError');
            expect(err.message).toStrictEqual('Callback must be supplied as function');
        }
    });

});
