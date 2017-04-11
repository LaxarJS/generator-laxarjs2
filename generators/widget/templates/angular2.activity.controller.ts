<%- banner %>
import { Component, NgModule } from '@angular/core';
import { AxAngularModule } from 'laxar-angular2-adapter';

@Component( { template: '' } )
export class <%= angular2ComponentName %> {

   constructor() {

      // TODO: add your implementation here

   }

}

@NgModule( {
   imports: [ AxAngularModule ],
   declarations: [ <%= angular2ComponentName %> ]
} )
export class <%= angular2ModuleName %> {}
