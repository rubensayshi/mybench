var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId,
	queue			= [];

/*
 * Category
 */
var Category = new Schema({
	title		: String
});

queue.push(function() { mongoose.model('Category', Category); });

/*
 * Flush the queue
 */
queue.forEach(function(fn) {
	fn(); 
});