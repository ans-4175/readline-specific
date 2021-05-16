var rl = require('../index.js');

test('read all lines', function(done) {
  function callback(err, res) {
    expect(res).toBe({
      all: "AAAA\r\nBBBB\r\nCCCC\r\n",
      row: {"1": "AAAA", "2": "BBBB", "3": "CCCC"}
    });
    expect(err).toBe(null);
    done();
  }

  rl.alllines('./tests/file.txt', callback);
});

test('unavailable file', function(done) {
  function callback(err, res) {
    expect(res).toBe({
      all: '',
      row: {}
    });
    expect(err.message).toBe('ENOENT: no such file or directory, open \'./tests/unavailable.txt\'');
    done();
  }

  rl.alllines('./tests/unavailable.txt', callback);
});