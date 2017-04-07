<%- banner %>
import { Directive, NgModule } from '@angular/core';

@Directive( {
   selector: '<%- angular2DirectiveSelector %>'
} )
class <%- angular2DirectiveName %> {
   constructor() {

      // TODO: add your implementation here

   }
}

@NgModule( {
   declarations: [ <%- angular2DirectiveName %> ],
   exports: [ <%- angular2DirectiveName %> ]
} )
export class <%- angular2DirectiveModuleName %> {}
