var rl = require('../index.js');

test('read first line', done => {
  function callback(err, res) {
    if (err) {
      done(err);
      return;
    }
    expect(res).toBe('AAAA');
    done();
  }

  rl.oneline('./tests/file.txt', 1, callback);
});