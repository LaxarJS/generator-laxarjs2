<%- banner %>
import { module } from 'angular';

Controller.$inject = [ '$scope' ];
function Controller( $scope ) {
   $scope.message = 'Hello World!';
}

export const name = module( 'angularHelloWorldWidget', [] )
   .controller( 'AngularHelloWorldWidgetController', Controller ).name;
