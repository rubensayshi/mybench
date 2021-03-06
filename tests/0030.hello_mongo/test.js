// load vendor modules
var express 		= require('express'),
	mongoose		= require('mongoose'),
	app				= express.createServer(),
    template_system = require('../../node_modules/djangode/template/template'),
    template_loader = require('../../node_modules/djangode/template/loader');

args 			= process.argv.splice(2);
LISTEN_ON_PORT	= null;
portkey 		= args.indexOf('--port');

if(portkey != -1 && args[(portkey+1)] != undefined) {
	LISTEN_ON_PORT = args[(portkey+1)];
}

if(!LISTEN_ON_PORT) {
	console.log('You should specify a port for a test ...');
	process.exit();
}

// setup express app
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'very secret secret'}));

mongoose.connect('mongodb://localhost/timerime-reloaded');

// set tpl dir
template_loader.set_path('tpl');

app.get('/test', function(req, res){
	template_loader.load_and_render('hello_tpl.html', {who : 'World', list : [1,2,3,4,5,6,7,8,9,10]}, function(error, result) {
		res.send(result);
	});
});

// listen
app.listen(LISTEN_ON_PORT);

console.log('ready');
