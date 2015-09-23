angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})
		
		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})
		
		.when('/products', {
			templateUrl: 'app/views/pages/products/all.html',
			controller: 'productController',
			controllerAs: 'product'
		})
		// same view as edit page
		.when('/products/create', {
			templateUrl: 'app/views/pages/products/create.html',
			controller: 'productCreateController',
			controllerAs: 'product'
		})
		// page to edit a product
		.when('/products/:product_id', {
			templateUrl: 'app/views/pages/products/single.html',
			controller: 'productViewController',
			controllerAs: 'product'
		});


	$locationProvider.html5Mode(true);

});
