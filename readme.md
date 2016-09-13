# Component-based JavaScript architecture

## Overview

This boilerplate outlines a component-based architecture for JavaScript that keeps code neatly organised and allows components to talk to each other.

It is designed to work with component-based design and development.

It removes the need for littering markup with JavaScript hooks (you'll only need one per component), and makes it easy to pass CMS-editable variables into your component. Everything is neatly scoped, allowing for multiple instances to run on the same page without conflicts. Custom events can be fired in one component and listened to in another.

Using `if ($(element).length)` to check an element exists before your code executes is no longer necessary. By design, code will only run if the component is on the page.

## First things first

Everything is namespaced to avoid conflicts with plugins or anything else that might run on the page. In this boilerplate, the namespace is `projectName`. You'll want to run the following to replace all instances with `yourProjectName` (a short acronym is best):

```bash
npm run namespace yourProjectName
```

Running `projectName` in the console will show you everything that's available on the current page. The default namespace is `projectName`, so you'll need to find and replace that with whatever your app is called. A nice short acronym is best.

Instances of `projectName` may be found here:
- `.jshintrc`
- `src/assets/js/jquery-start.js`
- `src/assets/js/app.js`
- `src/assets/js/functions/helpers/checkEmptyInput.js`
- `src/assets/js/functions/global/responsiveTables.js`
- `src/assets/js/functions/components/componentName.js`
- `src/assets/js/functions/components/componentName--with-comments.js`

`src/assets/app.js` is the entry point into our app.

`checkEmptyInput.js`, `responsiveTables.js`, `componentName.js`, and `componentName--with-comments.js` are example files that show how this architecture can be used in different ways.

## How it works

There are 3 types of component, all very similar, but with distinct use cases.

### Regular components
Regular components live inside `js/functions/components`. These are initialised from hooks in your HTML as shown below.

### Global components
Global components live inside `js/functions/global`. These are Immediately Invoked Function Expressions (IIFEs) that don't have explicit hooks in your HTML. `responsiveTables.js` is an example that adds wrappers around tables that may be inside CMS-editable regions, where adding hooks to the HTML is not possible.

### Helpers
Helpers live inside `js/functions/helpers`. These are useful snippets (IIFEs again) that are typically called from one or more other components. `checkEmptyInput.js` is an example that lets you check if a field is empty. It adds a temporary error class to the field if it is empty, or `returns true` if it's not empty.

## Creating a regular component

### The HTML

When creating an HTML component that requires JavaScript, add a `data-component` attribute to the hightest level container available. The value for this attribute must match the name you define in the corresponding JavaScript. For example:

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

On load, `app.js` will find all of the components in the DOM using the `data-component` attribute, and call the corresponding JavaScript based on the value provided. Again, this value must match the value used in the component's JavaScript file, although the filename itself can be whatever you like (but you might as well make it the same). In the example above, the corresponding JavaScript component should start:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    ...
```

#### Options and defaults

Inside your component you can define a `{defaults}` object that may be overridden by any options you've passed in:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    var defaults = {
        transitionSpeed: 2000
    };

    options = $.extend({}, defaults, options);

    ...

    // usage
    $('.gallery').slick({
        transition: options.transitionSpeed   
    });

    ...
```

#### Initialisation

Once the component has been set up with any options, its `init()` method will be called, and the DOM node with the `data-component` attribute will be passed in, allowing you to neatly scope all of your jQuery selectors within this parent. This means that you can safely have multiple instances of your component on the same page (however, we'll see in a bit that you can limit this to only one instance):

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

The `{ui}` object contains all of our cached jQuery collections. Make sure you populate your this on `init`, as above, as that's when the root element will be available.

#### The Revealing Module Pattern

Each component is based on the [revealing module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript), where you can define private and public functions and variables. Privates are only accessible within the component, and anything made public (exposed) is accessible from outside of the component.

`app.js` requires each Regular component to expose the `init` function and `singleton` variable. Global components call their `init` function automatically, so you can just expose any other functions or variables necessary. Helpers, on the other hand, don't necessarily need an `init` function, so you can just expose whichever functions or variables you like and invoke them on demand.

In most examples of the revealing module pattern, you will see the following as the final statement in a module (this is the key line which exposes our public bits): 

```js
...

return {
    start: publicFunction,
    increment: publicIncrement,
    count: publicGetCount
};
```

In this boilerplate, however, we define a variable (named whatever, but for ease I give it the same name as the component) and assign our exposed bits to it:

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

We then `return` our public object in our final statement.

#### Getting your components to talk to each other

Assigning our public bits to a variable allows us to wrap our object in jQuery and trigger custom events:

```js
// js/functions/components/gallery.js

projectName.gallery = function(options) {
    ...

    var gallery = {
        init: init,
        destroy: destroy,
        singleton: singleton,
        ui: ui
    };

    ...

    function handleClick() {
        $(gallery).trigger('clicked');

        ...
    }

    return gallery;
}
```

Inside another component, we can now listen for our custom event and run whatever function we like when it occurs:

```js
// js/functions/components/galleryLightbox.js

projectName.galleryLightbox = function(options) {
    ...

    function bindEvents() {
        $(projectName.app.instances.gallery).on('clicked', function() {
            console.log('This was triggered by our gallery component!');
        });
    }
    
    ...
}
```

You might be thinking that `projectName.app.instances.gallery` is pretty verbose, and you'd be right. You can cache a reference to our gallery component if you're going to be referencing it a lot in another component. `app.js` is set up to trigger a `ready` event once all Regular components on the page have been initialised. We can listen for this event and create our reference:

```js
// js/functions/components/galleryLightbox.js

projectName.galleryLightbox = function(options) {
    ...

    var config = {
        animationSpeed: projectName.app.config.animationSpeed 
    };
    
    function init(element) {
        $(projectName.app).on('ready', function() {
            config.gallery = projectName.app.instances.gallery;
        });

        ...
    }

    function bindEvents() {
        $(config.gallery).on('clicked', function() {
            console.log('This was triggered by our gallery component!');
        });
    }

    ...
```

#### Singletons and Instances

A user should be able to stick as many components like a gallery or map on the page as they like. However, there are some components, like a filter or the site's primary navigation, that should be limited to a single instance.

Inside each Regular component, you should declare and expose a `singleton` boolean which tells `app.js` whether to allow multiple instances. If you set `singleton` to `true` and more than one of the same component exists on the page, only the first will be initialised, and subsequent components will generate a console warning.

##### Accessing instances

Earlier, I talked about how you can access one component from another. The method varies slightly, depending on whether the component you're accessing is set up to be a singleton.

When `app.js` initialises the Regular components on the page, it will add singleton components to the `{projectName}` object at `projectName.app.instances.componentName`, allowing you to access the component's exposed bits as per the following example, where `gallery` is a singleton:

```js
// js/functions/components/galleryLightbox.js

projectName.galleryLightbox = function(options) {
    ...

    projectName.app.instances.gallery.destroy();

    ...
```

On the other hand, if your component is set up to allow multiple instances (`var singleton = false;` like our gallery below), `projectName.app.instances.componentName` will be an `[array]`. You can then loop through each instance in the array to access their exposed bits:

```js
// js/functions/components/galleryLightbox.js

projectName.galleryLightbox = function(options) {
    ...

    $.each(projectName.app.instances.gallery, function(i, gallery) {
        gallery.destroy();
    });

    ...
```

Helpers are available at `projectName.componentName`.

#### Other bits

`app.js` has an exposed a `{config}` object, which contains settings and variables that can be used throughout the application by typing `projectName.app.config.animationSpeed`, for example.

Each component has its own `{config}` object, which contains settings and variables that are used in that component. You can use this object to reference or override anything defined in `app.js`:

```js
// js/functions/components/galleryLightbox.js

projectName.galleryLightbox = function(options) {
    ...

    var config = {
        animationSpeed: projectName.app.config.animationSpeed 
    };

    ...
```

In each component there's also a `{state}` object, which I like to use to keep track of component state:

```js
// js/functions/components/galleryLightbox.js

projectName.galleryLightbox = function(options) {
    ...

    var state = {
        currentItem: null
    };

    ...

    function handleChange() {
        ...
        state.currentItem = $(this);
    }

    ...
```