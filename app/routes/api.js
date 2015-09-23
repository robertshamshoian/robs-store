var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Product    = require('../models/product');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to generate sample user
	apiRouter.post('/sample', function(req, res) {

		// look for the user named test
		User.findOne({ 'username': 'test' }, function(err, user) {

			// if there is no test user, create one
			if (!user) {
				var sampleUser = new User();

				sampleUser.name = 'TestUser';  
				sampleUser.username = 'test'; 
				sampleUser.password = 'test';

				sampleUser.save();
			} else {
				console.log(user);

				// if there is a test, update his password
				user.password = 'test';
				user.save();
			}

		});

	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      

	      if (err) {
	        res.status(403).send({ 
	        	success: false, 
	        	message: 'Failed to authenticate token.' 
	    	});  	   
	      } else { 
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	            
	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({ 
   	 		success: false, 
   	 		message: 'No token provided.' 
   	 	});
	    
	  }
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				console.log('User: ' + user);

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});
		
	apiRouter.route('/products')

		// create a product (accessed at POST http://localhost:8080/products)
		.post(function(req, res) {
			
			var product = new Product();		// create a new instance of the product model
			product.name = req.body.name;  // set the products name (comes from the request)
			product.description = req.body.description;  // set the products description (comes from the request)
			product.price = req.body.price;  // set the products price (comes from the request)
			product.thumbnail = req.body.thumbnail;  // set the products Image URL (comes from the request)
			product.image = req.body.image;  // set the products Thumbnail URL (comes from the request)
			product.brand = req.body.brand;  // set the products Image URL (comes from the request)



			product.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A product with that productname already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'Product created!' });
			});

		})

		// get all the products (accessed at GET http://localhost:8080/api/products)
		.get(function(req, res) {

			Product.find({}, function(err, products) {
				if (err) res.send(err);

				// return the products
				res.json(products);
			});
		});

	apiRouter.route('/products/:product_id')

		// get the product with that id
		.get(function(req, res) {
			Product.findById(req.params.product_id, function(err, product) {
				console.log('product: ' + product);
				if (err) res.send(err);

				// return that product
				res.json(product);
			});
		})

		// update the product with this id
		.put(function(req, res) {
			Product.findById(req.params.product_id, function(err, product) {

				console.log(req.body);
				console.log(product);

				if (err) res.send(err);
				//set the new product information if it exists in the request
				if (req.body) product.reviews.push(req.body);

				 // save the product
				 product.save(function(err) {
				 	if (err) res.send(err);

					// return a message
					res.json({ message: 'Product updated!' });
				 });

			});
		})

		// delete the product with this id
		.delete(function(req, res) {
			Product.remove({
				_id: req.params.product_id
			}, function(err, product) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});
	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});


	return apiRouter;
};