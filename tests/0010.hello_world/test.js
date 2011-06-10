// load vendor modules
var express 		= require('express'),
	app				= express.createServer();

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

app.get('/test', function(req, res){
	res.send('Hello World');
});

// listen
app.listen(LISTEN_ON_PORT);

console.log('ready');
