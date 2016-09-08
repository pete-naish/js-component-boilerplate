# Component-based JavaScript architecture

## Overview

This boilerplate outlines a component-based architecture for JavaScript that keeps code neatly organised and allows components to talk to each other.

It is designed to work with component-based design and development.

It removes the need for littering markup with JavaScript hooks, and makes it easy to pass CMS-editable variables into your component. Everything is neatly scoped, allowing for multiple instances to run on the same page without conflicts. Custom events can be fired in one component and listened to in another.

Using `if ($(element).length)` to check an element exists before your code executes is no longer necessary. By design, code will only run if the component is on the page.

## First things first

Everything is namespaced to avoid conflicts with plugins or anything else that might run on the page. There's a single global object, `{projectName}`, and all of our components sit under that: `projectName.componentName`, e.g. `projectName.gallery`. The default namespace is `projectName`, so you'll need to find and replace that with whatever your app is called. A nice short acronym is best.

Instances of `projectName` may be found here:
- `.jshintrc`
- `src/assets/js/jquery-start.js`
- `src/assets/js/app.js`
- `src/assets/js/functions/helpers/checkEmptyInput.js`
- `src/assets/js/functions/global/responsiveTables.js`
- `src/assets/js/functions/components/componentName.js`
- `src/assets/js/functions/components/componentName--with-comments.js`

## How it works

`src/assets/app.js` is the entry point into our app.

`checkEmptyInput.js`, `responsiveTables.js`, `componentName.js`, and `componentName--with-comments.js` are example files that show how this architecture can be used in different ways.

There are 3 types of component, all very similar, but with distinct use cases.

### Regular components
Regular components live inside `js/functions/components`. These are initialised from hooks in your HTML as shown below.

### Global components
Global components live inside `js/functions/global`. These are Immediately Invoked Function Expressions (IIFEs) that don't have explicit hooks in your HTML. `responsiveTables.js` is an example that adds wrappers around tables that may be inside CMS-editable regions, where adding hooks to the HTML is not possible.

### Helpers
Helpers live inside `js/functions/helpers`. These are useful snippets (IIFEs again) that are typically called from on or more other components. `checkEmptyInput.js` is an example that lets you check if a field is empty. It adds a temporary error class to the field if it is empty, or returns true if it's not empty.

## Creating a regular component

### The HTML

When creating an HTML component that requires JavaScript, add a `data-component` attribute to the hightest level container available. For example:

```html
<section class="gallery" data-component="gallery">
    <div class="gallery__slide"><img class="gallery__image" src=""></div>
    ...
</section>
```

#### Passing in options

It's possible to pass options into your component, making CMS-configurable settings painless. In your HTML, insert `<script type="text/data"></script>`, and add your options in valid JSON format:

```html
<section class="gallery" data-component="gallery">
    <script type="text/data">
        {
            "transitionSpeed": 1000
        }
    </script>
    <div class="gallery__slide"><img class="gallery__image" src=""></div>
    ...
</section>
```

### The JavaScript

On load, `app.js` will find all of the components in the DOM using the `data-component` attribute, and call the corresponding JavaScript based on the value provided. This value must match the value used in the component's JavaScript file, although the filename itself can be whatever you like (but you might as well make it the same). In the example above, the corresponding JavaScript component should start:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    ...
```

#### Options and defaults

Inside your component you can define a defaults object that may be overridden by any options you've passed in:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    var defaults = {
        transitionSpeed: 2000
    };

    options = $.extend({}, defaults, options);

    // usage
    $('.gallery').slick({
        transition: options.transitionSpeed   
    });

    ...
```

#### Initialisation

Once the component has been set up with any options, its `init(element)` method will be called, and the DOM node with the `data-component` attribute will be passed in, allowing you to neatly scope all of your jQuery selectors within this parent. This means that you can safely have multiple instances of your component on the same page (however, we'll see in a bit that you can limit this to only one instance):

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    var ui = {};
    
    function init(element) {
        ui.$el = $(element);
        ui.$slides = $('.gallery__slide', ui.$el); // Slides are scoped inside our parent selector. This is shorthand for ui.$el.find('.gallery__slide')

        ...
    }
    ...
```

#### The Revealing Module Pattern

If you do have multiple instances of a component on the page, each one will be added to an [array] at `projectName.app.instances.componentName`. Otherwise, `projectName.app.instances.componentName` will just point to the public API of the single instance.

Speaking of public API, each component is based on the [revealing module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). Each component returns any of its publicly-available functions and variables, which means they're accessible outside of the component:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    var ui = {};
    var singleton = false;

    var gallery = {
        init: init,
        destroy: destroy,
        singleton: singleton,
        ui: ui
    };

    function init(element) {
        ui.$el = $(element);
        ...
    }

    function destroy() {
        ...
    }

    function privateFunction() {
        ...
    }

    return gallery;
}
```

Only `init` and `singleton` are required for the component to work, but you can expose whichever functions etc that other components might want to access.

Scripts that aren't bound to a `data-component` attribute (like `checkEmptyInput.js`) aren't initialised via `app.js`; they're Immediately Invoked Function Expressions, and return their public API:

```js
// js/functions/helpers/checkEmptyInput.js

projectName.checkEmptyInput = (function() {
    function check(e, $input) {
        var searchTerm = $input.val();

        e.preventDefault();

        if (!searchTerm) {
            $input
                .focus()
                .addClass('has-error');

            setTimeout(function() {
                $input.removeClass('has-error');
            }, 400);
        } else {
            return true;
        }
    }

    return {
        check: check
    };
})();
```

As this is a helper, you can call `check` from any component by running `projectName.checkEmptyInput.check(event, element);`.

The way you call a function within a normal component is a bit more verbose:

```js
projectName.app.instances.gallery.destroy();
```

If you've got multiple galleries on the page, and want to destroy them all, you'd do something like this:

```js
$.each(projectName.app.instances.gallery, function(i, gallery) {
    gallery.destroy();
});
```


# Precedent Base | Panini - HandlebarsJs | Gulp build

It has a Gulp-powered build system with these features:

- Handlebars HTML templates with Panini
- Sass compilation and prefixing
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
