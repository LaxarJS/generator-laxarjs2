<%- banner %>
import { Component, NgModule } from '@angular/core';
import { AxAngularModule } from 'laxar-angular2-adapter';

@Component( {
   templateUrl: 'ax-widget:template:angular2-hello-world-widget'
} )
export class Angular2HelloWorldWidget {

   message: string;

   constructor() {
      this.message = 'Hello World';
   }

}

@NgModule( {
   imports: [ AxAngularModule ],
   declarations: [ Angular2HelloWorldWidget ]
} )
export class Angular2HelloWorldWidgetModule {}
