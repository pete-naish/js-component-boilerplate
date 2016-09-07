projectName.componentName = function(options) {
    var ui = {};
    var singleton = false;

    var config = {
        animationSpeed: projectName.app.config.animationSpeed 
    };

    var defaults = {
        title: 'Default component title'
    };

    var state = {
        currentIndex: 0
    };

    var whatever;

    var componentName = {
        init: init,
        singleton: singleton,
        ui: ui
    };

    options = $.extend({}, defaults, options);

    function init(element) {
        ui.$el = $(element);
        ui.$button = $('.componentName__button', ui.$el);

        $(projectName.app).on('ready', function() {
            config.otherComponent = projectName.app.instances.otherComponent;
        });

        bindEvents();
    }

    function bindEvents() {
        ui.$button.on('click', function(e) {
            handleClick(e);
        });
    }

    function handleClick(e) {
        console.log(options.title);
        $(componentName).trigger('custom-event');
    }

    return componentName;
};