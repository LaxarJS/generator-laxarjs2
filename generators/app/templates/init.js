<%- banner %>
import { create } from 'laxar';
import artifacts from 'laxar-loader/artifacts?flow=main&theme=default';
<%- adapterIncludes %>

const config = {
   name: '<%= name %>',
   router: {
      query: {
         enabled: true
      },
      navigo: {
         useHash: true
      }
   },
   logging: {
      threshold: 'TRACE'
   },
   theme: 'default',
   tooling: {
      enabled: true
   }
};

create( <%- adapterModules %>, artifacts, config )
// Uncomment to use the LaxarJS developer tools (https://chrome.google.com/webstore/search/LaxarJS):
// .tooling( require( 'laxar-loader/debug-info?flow=main&theme=default' ) )
   .flow( 'main', document.querySelector( '[data-ax-page]' ) )
   .bootstrap();
