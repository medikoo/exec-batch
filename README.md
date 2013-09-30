# exec-batch
## Batch execution of shell commands

### Installation

	$ npm install exec-batch

### Usage example

```javascript
var ExecBatch = require('exec-batch');

batch = new ExecBatch(options);

// By example clean current git repository from any changes:
batch.add('git reset');
batch.add('git checkout .');
batch.add('git clean -df');

batch.start(function (err) {
  if (err) throw err;
  console.log("Done!");
});
```
