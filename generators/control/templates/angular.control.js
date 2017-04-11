<%- banner %>
import { module } from 'angular';

const directiveName = '<%= angularDirectiveName %>';
const directive = [ () => {
   return {
      link( scope, element, attrs ) {

         // TODO: add your implementation here

      }
   };
} ];

///////////////////////////////////////////////////////////////////////////////////////////////////////////

export const name = module( directiveName, [] )
   .directive( directiveName, directive ).name;
