# readline-specific

Node.js module for read specific line from a file. You just need to define your files' path and line number to read (line started from 1).
Install it with `npm install readline-specific`
Just require `var rl = require('readline-specific')`

## How to use
`rl.readLine(path,row,callback)`
It will read specific line, if not exist it will emit empty string. You need to define your path, then define line that you want to read.
```
rl.oneline('./testfile', 1, function(res, err) {
  if (err) console.error(err)	//handling error
  console.log(res)	//print content
})
```
## Next Development
`rl.readLines(path,rows,callback)`
It will read specific lines, and emit an array, if not exist it will contain empty string value. You need to define your path, then define lines that you want to read in array (sorted or unsorted).
```
rl.multilines('./testfile', [1,4], function(res, err) {
  if (err) console.error(err)	//handling error
  console.log(res)	//print content
})
```