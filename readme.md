This boilerplate outlines a new and improved component-based architecture for javascript.

It removes the need for littering markup with javascript hooks, and makes it easy to pass CMS-editable variables into your code. Everything is neatly scoped, allowing for multiple instances to run on the same page without conflicts. Custom events can be fired in one component and listened to in another.

Doing if ($(element).length) before your code executes is no longer necessary. By definition, code will only run if the component is on the page.

src/assets/app.js is the entry point into our app. This file contains the namespace for all of our custom project code.

You'll need to change instances of the word 'projectName' to whatever you choose to call your app. A nice short acronym is best.

Instances may be found in /.jshintrc, src/assets/js/app.js, src/assets/js/jquery-start.js, src/assets/js/functions/helpers/checkEmptyInput.js, 


# Precedent Base | Panini - HandlebarsJs | Gulp build

It has a Gulp-powered build system with these features:

- Handlebars HTML templates with Panini
- Sass compilation and prefixing
- Twitter Bootstrap framework
- JavaScript concatenation
- Built-in BrowserSync server
- For production builds:
  - CSS compression
  - JavaScript compression
  - Image compression

## Installation

To use this template, your computer needs:

- [NodeJS](https://nodejs.org/en/) (0.10 or greater)
- [Git](https://git-scm.com/)

- [Repo](Clone repo from stash)


Then open the folder in your command line, and install the needed dependencies:

```bash
cd projectname
npm install
bower install
```

Finally, run `npm start` to run Gulp. Your finished site will be created in a folder called `dist`, viewable at this URL:

```
http://localhost:8000
```

To create compressed, production-ready assets, run `npm run build`.
