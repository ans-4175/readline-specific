var fs = require('fs');
var readline = require('readline');

var readl = {
  oneline: function(path, row, callback) {
    var i = 0;
    var content = '';
    if (!!!(callback && callback.constructor && callback.call && callback.apply)) {
      throw new TypeError('Callback must be supplied as function');
    }
    if (typeof row !== 'number' || !Number.isInteger(row)) {
      callback(new TypeError('Line index to read must be supplied as integer'), content);
      return;
    }
    if (row < 1) {
      callback(new RangeError('Line index to read must be greater than zero'), content);
      return;
    }
    var rs = fs.createReadStream(path, {
      encoding: 'utf8',
      autoClose: false
    }).on('error', function(err) {
      rs.destroy();
      callback(err, content)
    });
    path = null;
    try {
      readline.createInterface({
        input: rs,
        terminal: false
      }).on('line', function(line) {
        ++i;
        if (row == i) {
          // row is set to null, in order to track it was found
          row = null;
          try {
            content = line;
          } catch (e) {
            console.error(e);
          }
          this.close();
        }
      }).on('close', function() {
        rs.destroy();
        var err = null;
        if (row !== null) {
          err = new RangeError('Line index to read was not found');
        }
        callback(err, content)
      }).on('error', function(err) {
        rs.destroy();
        callback(err, content)
      });
    } catch (err) {
      console.error(err);
      callback(err, content)
    }
  },
  multilines: function(path, row, callback) {
    var i = 0;
    var content = {};
    if (!!!(callback && callback.constructor && callback.call && callback.apply)) {
      throw new TypeError('Callback must be supplied as function');
    }
    if (!Array.isArray(row) ||
        row.some(singleRow => typeof singleRow !== 'number' || !Number.isInteger(singleRow))) {
      callback(new TypeError('Line indexes to read must be supplied as array of integers'), content);
      return;
    }
    if (row.some(singleRow => singleRow < 1)) {
      callback(new RangeError('Line indexes to read must be greater than zero'), content);
      return;
    }
    var lastrow = Math.max.apply(null, row);
    var rs = fs.createReadStream(path, {
      encoding: 'utf8',
      autoClose: false
    }).on('error', function(err) {
      rs.destroy();
      callback(err, content)
    });
    path = null;
    try {
      readline.createInterface({
        input: rs,
        terminal: false
      }).on('line', function(line) {
        ++i;
        if (row.indexOf(i) > -1) {
          // found row is removed from array, in order to track it was found
          row = row.filter(singleRow => singleRow !== i);
          try {
            content[i] = line;
          } catch (e) {
            console.error(e);
          }
          if (i == lastrow) this.close();
        }
      }).on('close', function() {
        rs.destroy();
        var err = null;
        if (row.length > 0) {
          err = new RangeError('Some line indexes to read were not found: ' + row.join(', '));
        }
        callback(err, content)
      }).on('error', function(err) {
        rs.destroy();
        callback(err, content)
      });
    } catch (err) {
      console.error(err);
      callback(err, content)
    }
  },
  alllines: function(path, callback) {
    var i = 0;
    var content = {};
    content.all = "";
    content.row = {};
    if (!!!(callback && callback.constructor && callback.call && callback.apply)) {
      throw new TypeError('Callback must be supplied as function');
    }
    var rs = fs.createReadStream(path, {
      encoding: 'utf8',
      autoClose: false
    }).on('error', function(err) {
      rs.destroy();
      callback(err, content)
    });
    path = null;
    try {
      readline.createInterface({
        input: rs,
        terminal: false
      }).on('line', function(line) {
        ++i;
        try {
          content.row[i] = line;
          content.all += line + '\r\n';
        } catch (e) {
          console.error(e);
        }
      }).on('close', function() {
        rs.destroy();
        callback(null, content)
      }).on('error', function(err) {
        rs.destroy();
        callback(err, content)
      });
    } catch (err) {
      console.error(err);
      callback(err, content)
    }
  }
}

module.exports = readl;