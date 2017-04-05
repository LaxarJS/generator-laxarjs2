<%- banner %>
var ng = require( 'angular' );

Controller.$inject = [ '$scope' ];
function Controller( $scope ) {
   $scope.message = 'Hello World!';
}

exports.name = ng.module( 'angularHelloWorldWidget', [] )
   .controller( 'AngularHelloWorldWidgetController', Controller ).name;
