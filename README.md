# readline-specific

Node.js module for read specific line from a file. You just need to define your files' path and line number to read (line started from 1).
Install it with `npm install readline-specific`
Just require `var rl = require('readline-specific')`

## How to use
### Read one line
`rl.oneline(path,row,callback)`
It will read specific line, if not exist it will emit empty string. You need to define your path, then define line that you want to read.
```
rl.oneline('./testfile', 1, function(err, res) {
  if (err) console.error(err)	//handling error
  console.log(res)	//print content
})
```
### Read multi lines
`rl.multilines(path,rows,callback)`
It will read specific lines, and emit an array, if not exist it will contain empty object. You need to define your path, then define lines that you want to read in array (sorted or unsorted).
```
rl.multilines('./testfile', [1,4], function(err, res) {
  if (err) console.error(err)	//handling error
  console.log(res)	//print content
})
```
### Read all lines
`rl.alllines(path,callback)`
It will read all lines, and emit an object consists of all lines in single string and array of string in rows, if not exist it will contain empty object. You only need to define your path.
```
rl.alllines('./testfile', function(err, res) {
  if (err) console.error(err)	//handling error
  console.log(res)	//print content
})
```
## Next Development
Feel free to [fork](https://github.com/ans-4175/readline-specific) and develop by yourself, or [contact me](mailto:ans4175@gmail.com)