# LaxarJS 2 Yeoman Generator

> The *convenient* way to scaffold a new LaxarJS 2.x application, widget or control.

**Note:** This generator produces code that works with LaxarJS version 2.x.
If you need to create widgets or controls for an application running LaxarJS in version 1.x, you'll have to use [generator-laxarjs](https://laxarjs.org/docs/generator-laxarjs-latest) instead.


## Installation

Install the generator package (and optionally [yeoman](http://yeoman.io/)) globally via npm:

```sh
npm install -g yo generator-laxarjs2
```


## Generators

The Yeoman generator `laxarjs2` comes up with the main generator for scaffolding an application and three sub-generators for widgets, activities and controls.

Available generators:
- `laxarjs2`
- `laxarjs2:widget`
- `laxarjs2:activity`
- `laxarjs2:control`


### Application

To scaffold a new LaxarJS application, create a directory and run the generator:

```console
mkdir my-application
cd my-application
yo laxarjs2
```

After answering several questions, the generator creates the bare-bones application scaffolding for you.
Alternatively you can choose to let the generator create a set of very simple example widgets in the application.
When choosing this option, a widget is created for every selected integration technology.
Additionally, a widget written in plain JavaScript is added, since the according technology adapter is always part of LaxarJS.

Next, all dependencies can be installed by running `npm install` (or `yarn`), and after that is finished, the development web server can be started by running `npm start`.


#### Command Line Options

##### `--banner <banner-file.txt>`

By using this option, a text file containing a custom header for source files can be configured.
When the generator creates a new source file (`.js`, `.ts`, `.jsx` or `.vue`), this will be added as header just before the actual code starts.

This option will be saved in the Yeoman configuration file and will be used by sub-generators.


### Widget, Activity and Control

The scaffolding for a widget can be generated by running the following in the root directory of the application:

```console
yo laxarjs2:widget
```

The widget will be created in `<application-root>/application/widgets/$widgetName`.
If the generator is not run in the application's root directory but some other sub-directory, the widget will be created directly in that directory.

Keep in mind that the sub-generators expect to find a Yeoman configuration file (`.yo-rc.json`) in the root directory of your application.
So when calling the generator for the application first, this will already create the necessary configuration file.
In case you add widgets, activities or controls to an application that was created without Yeoman, simply create the file with an empty object as content.

```console
echo "{}" > .yo-rc.json
```

To create an activity or a control, use the appropriate sub-generator

```console
# create an activity
yo laxarjs2:activity
# create a control
yo laxarjs2:control
```

By default activities will be created in the same folder as widgets, while controls will be created in `<application-root>/application/controls/$controlName`.
Note that LaxarJS will not automatically find artifacts outside of the default folders (`<application-root>/application`).
You can change the defaults using the file `laxar.config.js`, or add additional resolutions to the loader configuration (`webpack.config.js`).

Also, for widgets and controls the previously selected integration technology will be pre-selected the next time one of these artifact types is generated.
However, for activities the pre-selected technology will always be `plain`.
This is because an activity isn't rendered in the DOM, and any view rendering technology would thus only add bloat.
A valid exception could be an activity that uses an AngularJS service, for instance.


#### Command Line Options

* `<artifact-name>`

  When asked for the artifact name, this will be prompted as default instead of the current directory.

* `--banner <banner-file.txt>`

  This is the same as explained above for the application generator.

* `--directory <artifacts-directory>`

The generator will create the widget, activity or control in a sub-directory of this directory.
The name of the artifact will be used as a sub-directory within this directory.

Example:

```console
my-app $ yo laxarjs2:widget hello-world-widget --directory stuff/my-widgets
```

This will create the widget in `my-app/stuff/my-widgets/hello-world-widget`.
