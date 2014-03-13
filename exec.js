'use strict';

var normalizeOpts = require('es5-ext/object/normalize-options')
  , deferred      = require('deferred')
  , cmdOut        = require('cli-color').blackBright
  , exec          = require('child_process').exec;

module.exports = function (cmd/*, options*/) {
	var options = normalizeOpts(Object(arguments[1])), child, def;

	if (options.cwd === undefined) options.cwd = process.cwd();
	if (options.env === undefined) options.env = process.env;
	if (options.out === undefined) options.out = process.stdout;
	if (options.err === undefined) options.err = process.stderr;
	if (options.out) options.out.write(cmdOut(cmd) + "\n");

	child = exec(cmd, options, function (err, stdout, stderr) {
		if (err) {
			def.reject(err);
			return;
		}
		def.resolve({ out: stdout, err: stderr });
	});
	if (options.out) child.stdout.pipe(options.out);
	if (options.err) child.stderr.pipe(options.err);

	def = deferred();
	def.promise.process = child;
	return def.promise;
};
