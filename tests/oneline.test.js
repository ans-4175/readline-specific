var rl = require('../index.js');

test('read first line', function(done) {
  function callback(err, res) {
    expect(res).toBe('AAAA');
    expect(err).toBe(null);
    done();
  }

  rl.oneline('./tests/file.txt', 1, callback);
});

test('read last line', function(done) {
  function callback(err, res) {
    expect(res).toBe('CCCC');
    expect(err).toBe(null);
    done();
  }

  rl.oneline('./tests/file.txt', 3, callback);
});

test('read unavailable line', function(done) {
  function callback(err, res) {
    expect(res).toBe('');
    expect(err).toBe(null);
    done();
  }

  rl.oneline('./tests/file.txt', 100, callback);
});

test('invalid line format', function(done) {
  function callback(err, res) {
    expect(res).toBe('');
    expect(err).toBe(null);
    done();
  }

  rl.oneline('./tests/file.txt', 'a', callback);
});

test('unavailable file', function(done) {
  function callback(err, res) {
    expect(res).toBe('');
    expect(err.message).toBe('ENOENT: no such file or directory, open \'./tests/unavailable.txt\'');
    done();
  }

  rl.oneline('./tests/unavailable.txt', 1, callback);
});