This boilerplate outlines a new and improved component-based architecture for JavaScript.

It is designed to work together with re-usable HTML and CSS components.

It removes the need for littering markup with JavaScript hooks, and makes it easy to pass CMS-editable variables into your code. Everything is neatly scoped, allowing for multiple instances to run on the same page without conflicts. Custom events can be fired in one component and listened to in another.

Doing `if ($(element).length)` to check an element exists before your code executes is no longer necessary. By design, code will only run if the component is on the page.

`src/assets/app.js` is the entry point into our app.

You'll need to change instances of the word `projectName` to whatever you choose to call your app. A nice short acronym is best.

Instances of 'projectName' may be found in:
- `.jshintrc`
- `src/assets/js/jquery-start.js`
- `src/assets/js/app.js`
- `src/assets/js/functions/helpers/checkEmptyInput.js`
- `src/assets/js/functions/global/responsiveTables.js`
- `src/assets/js/functions/components/componentName.js`
- `src/assets/js/functions/components/componentName--with-comments.js`

Just do a find & replace.

`checkEmptyInput.js`, `responsiveTables.js`, `componentName.js`, and `componentName--with-comments.js` are example files that show how this architecture can be used in different ways. Files inside `js/functions/components` are for components that have hooks in your HTML as shown below. Files inside `js/functions/global` are for functions (IIFEs) that run without hooks in your HTML. For example, `responsiveTables.js` adds wrappers around tables that may be inside CMS-editable content areas, so adding hooks is not possible. Files inside `js/functions/helpers` are little snippets (IIFEs again) that can be used elsewhere in your application. For example, `checkEmptyInput.js` lets you check if a field is empty, and adds a temporary error class to the field if it is empty.

When creating an HTML component that requires JavaScript, add a `data-component` attribute to the hightest level container available. For example:

```html
<section class="gallery" data-component="gallery">
    <div class="gallery__slide"><img class="gallery__image" src=""></div>
    ... rest of markup
</section>
```

On load, `app.js` will find all of the components in the DOM using the `data-component` attribute, and initialise the corresponding JavaScript based on the value provided. This value must match the value used in the component's JavaScript file, although the filename itself can be whatever you like (but you might as well make it the same). In the example above, the corresponding JavaScript file should start:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    ...
```

It's also possible to pass options into your component, making CMS-configurable settings painless. This is indicated by the options parameter in the snippet above. In your HTML, insert a `script` tag with `type="text/data"`, and add your options in valid JSON format:

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

Inside your component you can define a defaults object that may be overridden by these options:

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

Once the component has been set up with any options, its `init(element)` method will be called, and the DOM node with the `data-component` attribute will be passed in, allowing you to neatly scope all of your jQuery selectors within this parent. This means that you can safely have multiple instances of your component on the same page (however, we'll see in a bit that you can limit this to only one instance):

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    var ui = {};
    
    function init(element) {
        ui.$el = $(element);
        ui.$slides = $('.gallery__slide', ui.$el);

        ...
    }
    ...
```

If you do have multiple instances of a component on the page, each one will be added to an [array] at `projectName.app.instances.componentName`. Otherwise, `projectName.app.instances.componentName` will just point to the public API of the single instance.

Speaking of public API, each component is based on the [revealing module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). Each component returns any of its 'publicly' available functions and variables:

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

You can call `check` from any component by running `projectName.checkEmptyInput.check(event, element);`.

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
