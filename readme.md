# Component-based boilerplate

It has a Gulp-powered build system with these features:

Handlebars HTML templates
Sass compilation and prefixing
JavaScript concatenation
Built-in BrowserSync server with live reloading html css and js

For production builds:
CSS compression
JavaScript compression
Image compression

Installation
To use this template, your computer needs:

NodeJS (0.10 or greater)
Git
[Repo](Clone repo from stash)

Then open the folder in your command line, and install the needed dependencies:

cd projectname
npm install
bower install

Important
You'll need to update the version of Handlebars that gulp-handlebars uses. To do this, run:

npm install core-util-is inherits xtend
Then cd to node_modules/gulp-handlebars/node_modules/ and back up handlebars and through2.

Now unzip Source/CFA.Frontend/Update Handlebars.zip into node_modules/gulp-handlebars/node_modules/.

Finally, run npm start to run Gulp. Your finished site will be created in a folder called dist, viewable at this URL:

http://localhost:8000
To create compressed, production-ready assets, run npm run build.

[Read more about the JavaScript architecture](src/assets/js)

[Read more about the CSS architecture](src/assets/scss)