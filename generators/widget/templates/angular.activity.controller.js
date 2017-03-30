<%- banner %>
var ng = require( 'angular' );

Controller.$inject = [ '$scope' ];
function Controller( $scope ) {

   // TODO: add your implementation here

}

exports.name = ng.module( '<%= angularModuleName %>', [] )
   .controller( '<%= angularControllerName %>', Controller ).name;
