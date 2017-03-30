const { camelCase, upperFirst } = require( 'lodash' );

module.exports = [
   {
      name: 'Plain',
      integrationTechnology: 'plain',
      isBuiltIn: true,
      widget: {},
      app: {}
   },
   {
      name: 'AngularJS 1.x',
      integrationTechnology: 'angular',
      peerDependencies: {
         'laxar-angular-adapter': '^2.0.0',

         'angular': '^1.5.7',
         'angular-sanitize': '^1.5.7' // TODO remove when https://github.com/LaxarJS/laxar-angular-adapter/issues/41
      },
      devDependencies: {
         'laxar-angular-adapter': '^2.0.0',

         'angular': '^1.5.7',
         'angular-sanitize': '^1.5.7', // TODO remove when https://github.com/LaxarJS/laxar-angular-adapter/issues/41
         'angular-mock': '^1.5.7'
      },
      addAdditionalVars( vars ) {
         vars.angularModuleName = camelCase( vars.name );
         vars.angularControllerName = `${upperFirst( vars.angularModuleName )}Controller`;
      }
   },
   {
      name: 'Angular 2.x/4.x',
      integrationTechnology: 'angular2',
      sourceFileExtensions: [ '.ts' ],
      peerDependencies: {
         'laxar-angular2-adapter': '^2.0.0',

         '@angular/common': '~2.4.1',
         '@angular/compiler': '~2.4.1',
         '@angular/core': '~2.4.1',
         '@angular/platform-browser': '~2.4.1',
         '@angular/platform-browser-dynamic': '~2.4.1',
         '@types/jasmine': '~2.5.40',
         'core-js': '~2.4.1',
         'laxar': '^2.0.0-alpha.14',
         'reflect-metadata': '~0.1.8',
         'rxjs': '~5.0.3',
         'zone.js': '~0.7.5'
      },
      devDependencies: {
         'laxar-angular2-adapter': '^2.0.0',

         '@angular/common': '~2.4.1',
         '@angular/compiler': '~2.4.1',
         '@angular/core': '~2.4.1',
         '@angular/platform-browser': '~2.4.1',
         '@angular/platform-browser-dynamic': '~2.4.1',
         '@types/jasmine': '~2.5.40',
         'core-js': '~2.4.1',
         'laxar': '^2.0.0-alpha.14',
         'reflect-metadata': '~0.1.8',
         'rxjs': '~5.0.3',
         'zone.js': '~0.7.5',
         'ts-loader': '^1.3.3',
         'typescript': '^2.1.4'
      },
      addAdditionalVars( vars ) {
         vars.angular2ComponentName = upperFirst( camelCase( vars.name ) );
         vars.angular2ModuleName = `${vars.angular2ComponentName}Module`;
      }
   },
   {
      name: 'React',
      integrationTechnology: 'react',
      hasExternalTemplate: false,
      sourceFileExtensions: [ '.jsx' ],
      peerDependencies: {
         'laxar-react-adapter': '^2.0.0',

         'react': '^15.3.0',
         'react-dom': '^15.3.0'
      },
      devDependencies: {
         'laxar-react-adapter': '^2.0.0',

         'react': '^15.3.0',
         'react-dom': '^15.3.0'
      }
   },
   {
      name: 'Vue.js',
      integrationTechnology: 'vue',
      sourceFileExtensions: [ '.js', '.vue' ],
      peerDependencies: {
         'laxar-vue-adapter': '^2.0.0',

         'vue': '^2.0.3'
      },
      devDependencies: {
         'laxar-vue-adapter': '^2.0.0',

         'vue': '^2.0.3'

      }
   }
];
