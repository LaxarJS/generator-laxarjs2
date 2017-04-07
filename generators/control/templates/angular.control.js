<%- banner %>
var ng = require( 'angular' );

var directiveName = '<%= angularDirectiveName %>';
var directive = [ function() {
   return {
      link: function( scope, element, attrs ) {

         // TODO: add your implementation here

      }
   };
} ];

///////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.name = ng.module( directiveName, [] )
   .directive( directiveName, directive ).name;
