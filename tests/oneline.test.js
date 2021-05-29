var rl = require('../index.js');

var testFilePath = './tests/file.txt';

describe('oneline()', function() {

  test('read first line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('AAAA');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, 1, callback);
  });

  test('read last line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('CCCC');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, 3, callback);
  });

  test('read line after last line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, 4, callback);
  });

  test('read line 0', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, 0, callback);
  });

  test('read line -1', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, -1, callback);
  });

  test('read unavailable line', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, 100, callback);
  });

  test('invalid line format (letter)', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, 'a', callback);
  });

  test('invalid line format (array)', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.oneline(testFilePath, ['a'], callback);
  });

  test('unavailable file', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual('');
      expect(err.message).toStrictEqual(expect.stringMatching(/^ENOENT: no such file or directory, open '.+unavailable.txt'$/));
      done();
    }
    rl.oneline('./tests/unavailable.txt', 1, callback);
  });

});
