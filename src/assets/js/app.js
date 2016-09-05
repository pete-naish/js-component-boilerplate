projectName.app = (function() {
    /**
    * ui.$components jQuery object containing every javascript component on the page
    */
    var ui = {
        $components: $('[data-component]')
    };

    /**
    * {config} Object containing variables and settings used throughout our project
    */
    var config = {
        animationSpeed: 200,
        mobileBreakpoint: '(max-width: 640px)'
    };

    /**
    * {instance} Empty object which will contain all of our initialised component instances. If a component is not a singleton, it will be added to an array of the same components.
    */
    var instances = {};

    function init() {
        /**
        * For every ui.$component on the page, grab the optional data object, then work out if it's a singleton or not. If it's a singleton, add the component to
        * projectName.app.instances.componentName, then initialise the component by passing in the element itself and any options.
        * If the component is not a singleton, add the component to an array of the same components, and initialise in the same way (projectName.app.instances.componentName[i].init())
        */
        $.each(ui.$components, function(i, el) {
            var component = $(el).data('component');
            var instance = projectName[component](initOptions(el));
            var isSingleton = instance.singleton;
            var instanceExists = instances.hasOwnProperty(component);

            if (isSingleton) { // only allow one instance
                if (instanceExists) {
                    console.warn('only one instance of ' + component + ' allowed');
                    return;
                } else {
                    instances[component] = instance;
                }
            } else { // or add to array of same components
                if (!instanceExists) {
                    instances[component] = [];
                }

                instances[component].push(instance);
            }

            instance.init(el);
        });
    }

    /**
    * Find optional data object and parse as JSON
    */
    function initOptions(el) {
        var dataScriptElement = $("script[type='text/data']", $(el));
        var jsonString;
        var options;

        if (dataScriptElement.length) {
            jsonString = $.trim(dataScriptElement.html());

            try {
                options = $.parseJSON(jsonString.replace(/\s+/g, ' '));
            } catch (err) {
                console.error(jsonString);
                throw(err);
            }
        }

        return options;
    }

    $(function() {
        init();
    });    

    return {
        config: config,
        instances: instances
    }
})();