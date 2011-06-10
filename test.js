var	fs				= require('fs'),
	path			= require('path'),
	async			= require('async'),
	spawn			= require('./modules/spawn');

/*
 * define help
 */
function usage(msg) {
	if(msg)
		console.log(msg);
	
	console.log('bla');
	process.exit();
}

/*
* find out who and where we are
*/
var me			= process.argv[1],
	root		= path.dirname(me),
	testsdir	= root + '/tests';

/*
* set default CLI args
*/
var force	= false,
	debug	= false;

/*
 * config
 */
var creqs		= 500;
var nreqs		= 5000;
var prevport 	= 3000;

/*
* handle CLI args
*/
process.argv.splice(2).forEach(function (arg) {
	switch (arg) {
		// debug
		case '--help':
		case '-h':
			usage();
		break;
		
		// force
		case '--force':
		case '-f':
			force = true;
		break;
		
		// debug
		case '-d':
			debug = true;
		break;
		
		default:
			usage('wtf default triggered ... ['+arg+']');
		break;
	}
});

/*
 * 
 */
var summary = [];

fs.readdir(testsdir, function(error, tests) {
	tests.sort();
	async.forEachSeries(tests, function(test, next) {
	if(! /^[0-9]{4}\./.test(test)) {
		next();
	} else {
			testdir = testsdir + '/' + test;
			
			async.waterfall([
	 			function(callback) {
					path.exists(testdir + '/' + 'pre.js', function(exists) {
						if(!exists) {
							callback(null);						
						} else {
							// execute?
							callback(null);
						}
					});	
				},
				function(callback){
					var wakeup = function() {
						if(sleep-- <= 0) {
							callback();
						} else {
							setTimeout(wakeup, 1000);
						}					
					};
					
					var sleep = 5;
					console.log('SLEEP >> '+sleep+' seconds');				
					wakeup();
					
				},
				function(callback) {
					path.exists(testdir + '/' + 'test.js', function(exists) {		
						if(!exists) {
							return callback(new Error('no `test.js` file found'));
						} else {	
							var testport	= ++prevport;
							var testurl		= 'http://127.0.0.1:' + testport + '/test';
							var testapp 	= testdir + '/' + 'test.js';				
							var results 	= [];
		
							var node		= spawn('node', [testapp, '--port', testport], {cwd : testdir}, function(data) {
								if(data.toString().trim() == 'ready')
									callback(null, node, testurl);
							}, false, false);
						}
					});
				},
				function(node, testurl, callback) {		
					var results 	= [];
					var ab			= spawn('ab', ['-c'+creqs, '-n'+nreqs, testurl], null, function(data) {
						results.push(data);						
					}, null, function(code) {
						error = (code ? new Error('ab failed with code ['+code+']') : null);
						node.kill(0);
						callback(error, results);
					});	
				}, 
				function(results, callback) {
					var tmp 	= results,
						results = [],
						pattern	= /^Requests per second:.*?(\d+\.\d+)/gm;
					
					tmp.forEach(function(str) {
						if (line = str.toString().match(pattern)) {
							if (requests = line[0].toString().match(/(\d+\.\d+)/)) {
								results.push(requests[0].toString() + " requests per seconds");
							}
						}
					});
					
					callback(null, results.join("\n"));
				},
				function(results, callback) {
					path.exists(testdir + '/' + 'post.js', function(exists) {
						if (!exists) {
							callback(null, results);						
						} else {
							// execute?
							callback(null, results);
						}
					});	
				},            
			], function(error, results) {
				if (error) {
					msg = 'ERROR >> ['+test+'] >> ' + error.message;
					
				} else {
					msg = 'DONE >> ['+test+'] >> ' + results;
				}
				
				summary.push(msg);
				console.log(msg);
				
				next();
			});
		}
	}, function() {		
		console.log("\n\n\n" + '>> ALL TESTS DONE <<');	
		summary.forEach(function(msg) {
			console.log(msg);
		});
	});
});

