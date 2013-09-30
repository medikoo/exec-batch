'use strict';

var callable = require('es5-ext/object/valid-callable')
  , d        = require('d')
  , cmdOut   = require('cli-color').blackBright
  , exec     = require('child_process').exec

  , Batch;

module.exports = Batch = function (/* options */) {
	if (!(this instanceof Batch)) return new Batch(arguments[0]);
	this.options = Object(arguments[0]);
	if (this.options.cwd === undefined) this.options.cwd = process.cwd();
	if (this.options.env === undefined) this.options.env = process.env;
	if (this.options.out === undefined) this.options.out = process.stdout;
	if (this.options.err === undefined) this.options.err = process.stderr;
	this.stack = [];
};

Object.defineProperties(Batch.prototype, {
	inProgress: d(false),
	start: d(function (cb) {
		if (cb != null) this.cb = callable(cb);
		this.next();
	}),
	add: d(function (cmd, opts) { this.stack.push(arguments); }),
	next: d(function () {
		var data = this.stack.shift(), cmd, opts, child;
		if (!data) {
			this.inProgress = false;
			if (this.cb) this.cb();
			return;
		}
		cmd = data[0];
		opts = Object(data[1]);
		if (opts.cwd === undefined) opts.cwd = this.options.cwd;
		if (opts.env === undefined) opts.env = this.options.env;
		this.inProgress = true;
		if (this.options.out) this.options.out.write(cmdOut(cmd) + "\n");
		child = exec(cmd, opts, function (err) {
			if (err) {
				if (this.cb) this.cb(err);
				return;
			}
			this.next();
		}.bind(this));
		if (this.options.out) child.stdout.pipe(this.options.out);
		if (this.options.err) child.stderr.pipe(this.options.err);
	})
});
