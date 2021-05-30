var rl = require('../index.js');

var testFilePath = './tests/file.txt';
var testBinaryFilePath = './tests/file.zip';
var testUnavailableFilePath = './tests/unavailable.txt';

var emptyResult = {
  all: '',
  row: {}
};

describe('alllines()', function() {

  test('read all lines', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual({
        all: "AAAA\r\nBBBB\r\nCCCC\r\n",
        row: {
          "1": "AAAA",
          "2": "BBBB",
          "3": "CCCC"
        }
      });
      expect(err).toStrictEqual(null);
      done();
    }
    rl.alllines(testFilePath, callback);
  });

  test('binary file', function(done) {
    function callback(err, res) {
      expect(res).toHaveProperty('all');
      expect(res).toHaveProperty('row');
      expect(res.row).toHaveProperty('1');
      expect(res.row).toHaveProperty('2');
      expect(res.row).toHaveProperty('3');
      expect(res.row).toHaveProperty('4');
      expect(res.row).toHaveProperty('5');
      expect(res.row).toHaveProperty('6');
      expect(res.row).toHaveProperty('7');
      expect(Buffer.from(res.all).toString('base64')).toStrictEqual('UEsDBA0KAAAAAADvv71a77+9UnhALO+/vRIAAAASAAAACAAAAGZpbGUudHh0QUFBQQ0KQkJCQg0KQ0NDQw0KUEsBAj8ADQoAAAAAAO+/vVrvv71SeEAs77+9EgAAABIAAAAIACQAAAAAAAAAIAgAAAAAAABmaWxlLnR4dA0KACAAAAAAAAEAGAAi77+977+9cjVV77+9AVPvv73vv701U1Xvv70BIu+/ve+/vXI1Ve+/vQFQSwUGAAAAAAEAAQBaAAAAOAAAAAAADQo=');
      expect(Buffer.from(res.row['1']).toString('base64')).toStrictEqual('UEsDBA==');
      expect(Buffer.from(res.row['2']).toString('base64')).toStrictEqual('AAAAAADvv71a77+9UnhALO+/vRIAAAASAAAACAAAAGZpbGUudHh0QUFBQQ==');
      expect(Buffer.from(res.row['3']).toString('base64')).toStrictEqual('QkJCQg==');
      expect(Buffer.from(res.row['4']).toString('base64')).toStrictEqual('Q0NDQw==');
      expect(Buffer.from(res.row['5']).toString('base64')).toStrictEqual('UEsBAj8A');
      expect(Buffer.from(res.row['6']).toString('base64')).toStrictEqual('AAAAAADvv71a77+9UnhALO+/vRIAAAASAAAACAAkAAAAAAAAACAIAAAAAAAAZmlsZS50eHQ=');
      expect(Buffer.from(res.row['7']).toString('base64')).toStrictEqual('ACAAAAAAAAEAGAAi77+977+9cjVV77+9AVPvv73vv701U1Xvv70BIu+/ve+/vXI1Ve+/vQFQSwUGAAAAAAEAAQBaAAAAOAAAAAAA');
      expect(err).toStrictEqual(null);
      done();
    }
    rl.alllines(testBinaryFilePath, callback);
  });

  test('unavailable file', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err.message).toStrictEqual(expect.stringMatching(/^ENOENT: no such file or directory, open '.+unavailable.txt'$/));
      done();
    }
    rl.alllines(testUnavailableFilePath, callback);
  });

  test('folder instead of file', function(done) {
    function callback(err, res) {
      expect(res).toStrictEqual(emptyResult);
      expect(err.message).toStrictEqual('EISDIR: illegal operation on a directory, read');
      done();
    }
    rl.alllines('.', callback);
  });

  test('callback is not a function (number)', function() {
    expect.assertions(4);
    try {
      rl.alllines(testFilePath, 1);
    } catch (err) {
      expect(err).toHaveProperty('name');
      expect(err).toHaveProperty('message');
      expect(err.name).toStrictEqual('TypeError');
      expect(err.message).toStrictEqual('Callback must be supplied as function');
    }
  });

});
