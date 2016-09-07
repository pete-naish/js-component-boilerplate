This boilerplate outlines a new and improved component-based architecture for JavaScript.

It is designed to work together with re-usable HTML and CSS components.

It removes the need for littering markup with JavaScript hooks, and makes it easy to pass CMS-editable variables into your code. Everything is neatly scoped, allowing for multiple instances to run on the same page without conflicts. Custom events can be fired in one component and listened to in another.

Doing `if ($(element).length)` to check an element exists before your code executes is no longer necessary. By design, code will only run if the component is on the page.

`src/assets/app.js` is the entry point into our app.

You'll need to change instances of the word `projectName` to whatever you choose to call your app. A nice short acronym is best.

Instances of 'projectName' may be found in `/.jshintrc`, `src/assets/js/jquery-start.js`, `src/assets/js/app.js`, `src/assets/js/functions/helpers/checkEmptyInput.js`, `src/assets/js/functions/global/responsiveTables.js`, `src/assets/js/functions/components/componentName.js`, and `src/assets/js/functions/components/componentName--with-comments.js`.

`checkEmptyInput`, `responsiveTables`, `componentName`, and `componentName--with-comments` are example files that show how this architecture can be used in different ways. Files inside `js/functions/components` are for components that have hooks in your HTML as shown below. Files inside `js/functions/global` are for functions (IIFEs) that run without hooks in your HTML. The `responsiveTables` example adds wrappers around tables that may be inside CMS-editable content areas, so adding hooks is not possible. Files inside `js/functions/helpers` are little snippets (IIFEs again) that can be used elsewhere in your application. The `checkEmptyInput` example simply lets you check if a field is empty, and adds a temporary class if it is.

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

It's also possible to pass options into your component, making CMS-configurable settings painless. This is indicated by the options parameter in the snippet above. In your HTML, add a `script` tag with the type `text/data`, and type your options in valid JSON format:

```html
<section class="gallery" data-component="gallery">
    <script type="text/data">
        {
            "transitionSpeed": 1000
        }
    </script>
    <div class="gallery__slide"><img class="gallery__image" src=""></div>
    ... rest of markup
</section>
```

Inside your component you can define defaults that may be overridden by these options:

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

Once the component has been set up with any options, its `init(element)` method will be called, and the DOM node with the `data-component` attached to it will be passed in, allowing you to neatly scope all of your jQuery selectors within this parent:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    
    function init(element) {
        ui.$el = $(element);
        ui.$slides = $('.gallery__slide', ui.$el);

        ...
    }
    ...
```


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
