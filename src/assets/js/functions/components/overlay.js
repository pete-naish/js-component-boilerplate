projectName.overlay = function(options) {
    var ui = {};
    var singleton = true;

    var config = {
        animationSpeed: projectName.app.config.animationSpeed
    };

    var defaults = {};
    
    var overlay = {
        init: init,
        singleton: singleton,
        show: showOverlay,
        hide: hideOverlay
    };

    options = $.extend(true, {}, defaults, options);

    function init(element) {
        ui.$el = $(element);

        bindEvents();
    }

    function bindEvents() {
        ui.$el.on('click', function(e) {
            e.preventDefault();
            hideOverlay();
        });
    }

    function hideOverlay() {
        ui.$el.fadeOut(config.animationSpeed);

        $(overlay).trigger('overlay-hidden');
    }

    function showOverlay() {
        ui.$el.fadeIn(config.animationSpeed);

        $(overlay).trigger('overlay-shown');
    }

    return overlay;
};