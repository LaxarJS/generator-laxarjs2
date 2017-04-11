<%- banner %>
import { module } from 'angular';

Controller.$inject = [ '$scope' ];
function Controller( $scope ) {

   // TODO: add your implementation here

}

export const name = module( '<%= angularModuleName %>', [] )
   .controller( '<%= angularControllerName %>', Controller ).name;
