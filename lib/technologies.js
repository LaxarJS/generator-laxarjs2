/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
const { camelCase, upperFirst } = require( 'lodash' );
const { verbatimFileObject } = require( './utils' );

module.exports = [
   {
      name: 'Plain',
      integrationTechnology: 'plain',
      sourceFileExtensions: [ '.js' ],
      isBuiltIn: true,
      widget: {},
      app: {}
   },
   {
      name: 'AngularJS 1.x',
      integrationTechnology: 'angular',
      sourceFileExtensions: [ '.js' ],
      peerDependencies: {
         'laxar-angular-adapter': '^2.0.0',

         'angular': '^1.5.7'
      },
      devDependencies: {
         'laxar-angular-adapter': '^2.0.0',

         'angular': '^1.5.7',
         'angular-mocks': '^1.5.7'
      },
      addAdditionalWidgetVars( vars ) {
         vars.angularModuleName = camelCase( vars.name );
         vars.angularControllerName = `${upperFirst( vars.angularModuleName )}Controller`;
      },
      addAdditionalControlVars( vars ) {
         vars.angularDirectiveName = camelCase( vars.name );
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
         'reflect-metadata': '~0.1.8',
         'rxjs': '~5.0.3',
         'zone.js': '~0.7.5',
         'ts-loader': '^1.3.3',
         'typescript': '^2.1.4'
      },
      addAdditionalWidgetVars( vars ) {
         vars.angular2ComponentName = upperFirst( camelCase( vars.name ) );
         vars.angular2ModuleName = `${vars.angular2ComponentName}Module`;
      },
      addAdditionalControlVars( vars ) {
         vars.angular2DirectiveSelector = `[${camelCase( vars.name )}]`;
         vars.angular2DirectiveName = upperFirst( camelCase( vars.name ) );
         vars.angular2DirectiveModuleName = `${vars.angular2DirectiveName}Module`;
      },
      additionalWidgetFilesToCopy( /* vars */ ) {
         return verbatimFileObject( [ 'tsconfig.json' ] );
      },
      additionalControlFilesToCopy( /* vars */ ) {
         return verbatimFileObject( [ 'tsconfig.json' ] );
      },
      /* eslint-disable no-useless-escape */
      webpackModuleRules: [ `{
               test: /\.tsx?$/,
               loader: 'ts-loader'
            }` ]
      /* eslint-enable no-useless-escape */
   },
   {
      name: 'React',
      babelPlugins: [ 'transform-react-jsx' ],
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
         'react-dom': '^15.3.0',
         'babel-plugin-transform-react-jsx': '^6.8.0'
      },
      addAdditionalControlVars( vars ) {
         vars.reactClassName = `${upperFirst( camelCase( vars.name ) )}`;
      },
      webpackModuleRules: [ `{
               test: /.jsx$/,
               exclude: /node_modules/,
               loader: 'babel-loader'
            }` ]
   },
   {
      name: 'Vue.js',
      integrationTechnology: 'vue',
      hasExternalTemplate: false,
      sourceFileExtensions: [ '.vue', '.js' ],
      peerDependencies: {
         'laxar-vue-adapter': '^2.0.0',

         'vue': '^2.0.3'
      },
      devDependencies: {
         'laxar-vue-adapter': '^2.0.0',

         'vue': '^2.0.3',
         'vue-loader': '^11.1.4',
         'vue-template-compiler': '^2.2.1'
      },
      webpackModuleRules: [ `{
               test: /.vue$/,
               loader: 'vue-loader'
            }` ]
   }
];
