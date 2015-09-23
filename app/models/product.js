var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// user schema 
var ProductSchema   = new Schema({
	name: String,
	description: String,
	price: Number,
	thumbnail: String,
	image: String,
	brand: String,
	reviews: []

});

module.exports = mongoose.model('Product', ProductSchema);