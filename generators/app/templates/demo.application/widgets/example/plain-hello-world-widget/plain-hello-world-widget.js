<%- banner %>
export const injections = [ 'axWithDom' ];
export function create( axWithDom ) {
   return {
      onDomAvailable() {
         axWithDom( element => {
            element.querySelector( 'h1' ).innerText = 'Hello World!';
         } );
      }
   };
}
