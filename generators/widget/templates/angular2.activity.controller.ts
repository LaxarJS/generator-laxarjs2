<%- banner %>
import { Component, NgModule } from '@angular/core';
import { AxAngularModule } from 'laxar-angular2-adapter';

@Component( {
   templateUrl: 'ax-widget:template:<%= name %>'
} )
export class <%= angularWidgetName %> {

   constructor() {

      // TODO: add your implementation here

   }

}

@NgModule( {
   imports: [ AxAngularModule ],
   declarations: [ <%= angularWidgetName %> ]
} )
export class <%= angularModuleName %> {}
