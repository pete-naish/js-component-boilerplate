/**
* Component files can be named anything you like, but for consistency I use componentName.js
* projectName.componentName must match data-component="componentName" in the html for your component
*/

projectName.componentName = function(options) {
    var ui = {}; // {ui} Empty object that will cache all of our scoped jQuery objects. Populated on init()
    
    /**
    * singleton is a boolean value which defines whether to allow multiple instances of componentName on the same page.
    * If singleton = true, only the first instance of componentName that appears in the markup will work. The console will show a warning if more than one exists.
    */
    var singleton = false;
    
    /**
    * {config} Object containing variables and settings used throughout componentName
    */
    var config = {
        animationSpeed: projectName.app.config.animationSpeed 
    };

    /**
    * {defaults} Object containing variables and settings that may be overridden by {options} as componentName is called on page load
    */
    var defaults = {
        title: 'Default component title'
    };

    /**
    * {state} Object containing variables and settings that change during use of component
    */
    var state = {
        currentIndex: 0
    };

    /**
    * Any other variables should come before var componentName = {}
    */
    var whatever;

    /**
    * {componentName} Object containing componentName's publicly-accessible functions and variables
    * init and singleton are required, everything else is optional.
    * ui is useful for accessing componentName's jQuery objects from another component:
    * projectName.app.instances.componentName.ui.$button.remove();
    */
    var componentName = {
        init: init,
        singleton: singleton,
        ui: ui
    };

    /**
    * Merge {options} that are passed in when componentName is called on page load with {defaults}. Allows access via:
    * options.zoom
    */
    options = $.extend(true, {}, defaults, options);

    /**
    * initialise component js
    * @param {element} is passed in from app.js
    */
    function init(element) {
        ui.$el = $(element);

        /**
        * Ensure jQuery element selector is scoped to our parent component element. 
        * Shorthand for:
        * ui.$el.find('.componentName__button');
        * This means we can safely have multiple componentName's on the same page.
        */
        ui.$button = $('.componentName__button', ui.$el);

        /**
        * Once our app has finished initialising all components on the page, set up a local shorthand to access any other components you need
        */
        $(projectName.app).on('ready', function() {
            config.otherComponent = projectName.app.instances.otherComponent;
        });

        bindEvents();
    }

    function bindEvents() {
        /**
        * Bind all of our events here
        */
        ui.$button.on('click', function(e) {
            handleClick(e);
        });
    }

    function handleClick(e) {
        console.log(options.title);
        /**
        * Trigger custom events within componentName that can be listened to elsewhere in your app by using:
        * $(config.otherComponent).on('custom-event', function(){});
        */
        $(componentName).trigger('custom-event');
    }

    /**
    * Return our componentName object so that everything defined in our publicly-accessible object is available outside of our component. Everything else is privately scoped and inaccessible.
    */
    return componentName;
};