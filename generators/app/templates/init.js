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
   .flow( 'main', document.querySelector( '[data-ax-page]' ) )
   .bootstrap();
