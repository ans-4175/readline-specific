var fs = require('fs');
var readline = require('readline');

/**
 * Detect whether input variable is a function.
 *
 * @param {*} variable
 *
 * @returns {boolean}
 *
 * @see https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
 */
function isFunction(variable) {
  return !!(variable && variable.constructor && variable.call && variable.apply);
}

var readl = {
  oneline: function(path, row, callback) {
    if (!isFunction(callback)) {
      throw new TypeError('Callback must be supplied as function');
    }
    var i = 0;
    var content = '';
    if (!Number.isInteger(row)) {
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
    if (!isFunction(callback)) {
      throw new TypeError('Callback must be supplied as function');
    }
    var i = 0;
    var content = {};
    if (!Array.isArray(row) || !row.every(Number.isInteger)) {
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
    if (!isFunction(callback)) {
      throw new TypeError('Callback must be supplied as function');
    }
    var i = 0;
    var content = {};
    content.all = "";
    content.row = {};
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