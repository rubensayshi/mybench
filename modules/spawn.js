/**
 * This is a wrapper module around the native child_process.spawn method
 * it provides us with a shorter syntax and some default error and exit handling
 * 
 * it exports just the spawn() method so you can:
 * 	var spawn = require('./modules/spawn');
 *  spawn('ls', ['-l', '-a']);
 */

// required modules
var	child_process	= require('child_process');

// the new spawn method
var spawn = function(_cmd, _args, _options, _fn, _errorFn, _exitFn) {
	var cmd;
	var args;
	var options;
	var fn;
	var errorFn;
	var exitFn;

	var process;

	var init = function(_cmd, _args, _options, _fn, _errorFn, _exitFn) {
		cmd		= _cmd;
		args	= _args 	|| [];
		options = _options 	|| {};
		fn		= (_fn		!== null	? _fn		: defaultFn);
		errorFn	= (_errorFn !== null	? _errorFn 	: defaultErrorFn);
		exitFn	= (_exitFn	!== null	? _exitFn	: defaultExitFn);

		spawn();

		return {
			kill : kill
		};
	};
	
	var kill = function(signal) {
		process.kill(signal);
	}

	var spawn = function() {
		process = child_process.spawn(cmd, args);

		if(fn)
			process.stdout	.on('data', fn);
		if(errorFn)
			process.stderr	.on('data', errorFn);
		if(exitFn)
			process			.on('exit', exitFn);	
	};

	var defaultFn = function(data) {
		  console.log('STDOUT >> `'+cmd+' '+args.join(' ')+'` >> '+data);
	};

	var defaultErrorFn = function(data) {
		console.log('STDERR >> `'+cmd+' '+args.join(' ')+'` >> '+data);
	};

	var defaultExitFn = function(code) {
		if(code) {
			console.log('EXIT >> `'+cmd+' '+args.join(' ')+'` >> '+code);
		}
	};

	return init(_cmd, _args, _options, _fn, _errorFn, _exitFn);
};

// export our method
exports = module.exports = spawn;
