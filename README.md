# exec-batch
## Batch execution of shell commands

### Installation

	$ npm install exec-batch

### Usage exaple

```javascript
var ExecBatch = require('exec-batch');

// Clean github repo
batch = new ExecBatch(options);

batch.add('git reset');
batch.add('git checkout .');
batch.add('git clean -df');

batch.start(function (err) {
  if (err) throw err;
  console.log("Done!");
});
```
