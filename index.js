var fs = require('fs');
var readline = require('readline');

var readl = {
  oneline: function(path, row, callback) {
    var i = 0;
    var content = '';
    var rs = fs.createReadStream(path, {
      encoding: 'utf8',
      autoClose: false
    }).on('error', function(err) {
      rs.destroy();
      callback(content, err)
    });
    path = null;
    try {
      readline.createInterface({
        input: rs,
        terminal: false
      }).on('line', function(line) {
        ++i;
        if (row == i) {
          try {
            content = line;
          } catch (e) {
            console.error(e);
          }
          this.close();
        }
      }).on('close', function() {
        rs.destroy();
        callback(content)
      }).on('error', function() {
        rs.destroy();
        callback(content)
      });
    } catch (err) {
      console.error(err);
      resolve(null);
    }
  }
}

// function readLines(path, row, callback) {
//   var i = 0;
//   var content = '';
//   var rs = fs.createReadStream(path, {
//     encoding: 'utf8',
//     autoClose: false
//   }).on('error', function(err) {
//     rs.destroy();
//     callback(content, err)
//   });
//   path = null;
//   try {
//     readline.createInterface({
//       input: rs,
//       terminal: false
//     }).on('line', function(line) {
//       ++i;
//       if (row == i) {
//         try {
//           content = line;
//         } catch (e) {
//           console.error(e);
//         }
//         this.close();
//       }
//     }).on('close', function() {
//       rs.destroy();
//       callback(content)
//     }).on('error', function() {
//       rs.destroy();
//       callback(content)
//     });
//   } catch (err) {
//     console.error(err);
//     resolve(null);
//   }
// }

module.exports = readl;