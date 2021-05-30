var rl = require('../index.js');

var testFilePath = './tests/file.txt';
var testBinaryFilePath = './tests/file.zip';
var testUnavailableFilePath = './tests/unavailable.txt';

var emptyResult = {};

describe('multilines()', function() {

  test('read first line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual({"1": "AAAA"});
      expect(err).toStrictEqual(null);
      done();
    }
    rl.multilines(testFilePath, [1], callback);
  });

  test('read last line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual({"3": "CCCC"});
      expect(err).toStrictEqual(null);
      done();
    }
    rl.multilines(testFilePath, [3], callback);
  });

  test('read first and last line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual({
        "1": "AAAA",
        "3": "CCCC"
      });
      expect(err).toStrictEqual(null);
      done();
    }
    rl.multilines(testFilePath, [1, 3], callback);
  });

  test('read last and first line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual({
        "1": "AAAA",
        "3": "CCCC"
      });
      expect(err).toStrictEqual(null);
      done();
    }
    rl.multilines(testFilePath, [3, 1], callback);
  });

  test('read unavailable line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err).toHaveProperty('name');
      expect(err).toHaveProperty('message');
      expect(err.name).toStrictEqual('RangeError');
      expect(err.message).toStrictEqual('Some line indexes to read were not found: 100');
      done();
    }
    rl.multilines(testFilePath, [100], callback);
  });

  test('read available line and unavailable line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual({"1": "AAAA"});
      expect(err).toHaveProperty('name');
      expect(err).toHaveProperty('message');
      expect(err.name).toStrictEqual('RangeError');
      expect(err.message).toStrictEqual('Some line indexes to read were not found: 100');
      done();
    }
    rl.multilines(testFilePath, [1, 100], callback);
  });

  test('invalid line format (letter)', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err).toHaveProperty('name');
      expect(err).toHaveProperty('message');
      expect(err.name).toStrictEqual('TypeError');
      expect(err.message).toStrictEqual('Line indexes to read must be supplied as array of integers');
      done();
    }
    rl.multilines(testFilePath, ['a'], callback);
  });

  test('invalid line array format (number)', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err).toHaveProperty('name');
      expect(err).toHaveProperty('message');
      expect(err.name).toStrictEqual('TypeError');
      expect(err.message).toStrictEqual('Line indexes to read must be supplied as array of integers');
      done();
    }
    rl.multilines(testFilePath, 1, callback);
  });

  test('invalid line format (array)', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err).toHaveProperty('name');
      expect(err).toHaveProperty('message');
      expect(err.name).toStrictEqual('TypeError');
      expect(err.message).toStrictEqual('Line indexes to read must be supplied as array of integers');
      done();
    }
    rl.multilines(testFilePath, [[]], callback);
  });

  test('binary file', function(done) {
    function callback(err, res) {
      expect(res).toHaveProperty('1');
      expect(Buffer.from(res['1']).toString('base64')).toStrictEqual('UEsDBA==');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.multilines(testBinaryFilePath, [1], callback);
  });

  test('unavailable file', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err.message).toStrictEqual(expect.stringMatching(/^ENOENT: no such file or directory, open '.+unavailable.txt'$/));
      done();
    }
    rl.multilines(testUnavailableFilePath, [1], callback);
  });

  test('folder instead of file', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err.message).toStrictEqual('EISDIR: illegal operation on a directory, read');
      done();
    }
    rl.multilines('.', [1], callback);
  });

  test('callback is not a function (number)', function() {
    expect.assertions(4);
    try {
      rl.multilines(testFilePath, [1], 1);
    } catch (err) {
      expect(err).toHaveProperty('name');
      expect(err).toHaveProperty('message');
      expect(err.name).toStrictEqual('TypeError');
      expect(err.message).toStrictEqual('Callback must be supplied as function');
    }
  });

});
