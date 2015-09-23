angular.module('productCtrl', ['productService'])

.controller('productController', function(Product) {

  var vm = this;
  // set a processing variable to show loading things
  vm.processing = true;

  // grab all the products at page load
  Product.all()
    .success(function(data) {

      // when all the products come back, remove the processing variable
      vm.processing = false;

      // bind the products that come back to vm.products
      vm.products = data;
    });

  // function to delete a product
  vm.deleteProduct = function(id) {
    vm.processing = true;

    Product.delete(id)
      .success(function(data) {

        // get all products to update the table
        // you can also set up your api 
        // to return the list of products with the delete call
        Product.all()
          .success(function(data) {
            vm.processing = false;
            vm.products = data;
          });

      });
  };

})

// controller applied to product creation page
.controller('productCreateController', function(Product) {
  
  var vm = this;

  // function to create a product
  vm.saveProduct = function() {
    vm.processing = true;
    vm.message = '';

    // use the create function in the productService
    Product.create(vm.productData)
      .success(function(data) {
        vm.processing = false;
        vm.productData = {};
        vm.message = data.message;
      });
      
  };  

})


.controller('productViewController', function($routeParams, Product) {

  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages

  // get the product data for the product you want to edit
  // $routeParams is the way we grab data from the URL
  Product.get($routeParams.product_id)
    .success(function(data) {
      vm.productData = data;
      vm.reviews = vm.productData.reviews;
    });


  
  // information that comes from our form
  vm.reviewData = {};


  vm.saveReview = function(user) {
    vm.processing = true;
    vm.message = '';
    vm.reviewData.author = user;
    vm.reviewData.date = Date.now();

    // call the userService function to update 
    Product.update($routeParams.product_id, vm.reviewData)
      .success(function(data) {
        vm.processing = false;
        vm.reviews.push(vm.reviewData);
        // clear the form
        vm.reviewData = {};

        // bind the message from our API to vm.message
        vm.message = data.message;
      });
  };
});
