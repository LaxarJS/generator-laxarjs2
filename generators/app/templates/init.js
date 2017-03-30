<%- banner %>
var laxar = require( 'laxar' );
var artifacts = require( 'laxar-loader/artifacts?flow=main&theme=default' );

var config = {
   name: '<%= name %>',
   router: {
      query: {
         enabled: true
      },
      navigo: {
         useHash: true
      }
   },
   flow: {
      name: 'main'
   },
   logging: {
      threshold: 'TRACE'
   },
   theme: 'default',
   tooling: {
      enabled: true
   }
};

laxar.create( [], artifacts, config )
   .flow( 'main', document.querySelector( '[data-ax-page]' ) )
   .bootstrap();