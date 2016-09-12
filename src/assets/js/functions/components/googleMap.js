projectName.googleMap = function(options) {
    var ui = {};
    var singleton = false;
    var map;

    var config = {};

    var defaults = {
        center: {
            'lat': 51.5115543,
            'lng': -0.0816882
        },
        scrollwheel: false,
        zoom: 15,
        markerTitle: 'Default marker title'
    };

    var googleMap = {
        init: init,
        singleton: singleton,
        ui: ui
    };

    options = $.extend(true, {}, defaults, options);

    function init(element) {
        ui.$el = $(element);
        ui.$mapContainer = $('.map__container', ui.$el)[0];

        loadMap();
    }

    function loadMap() {
        var marker;

        map = new google.maps.Map(ui.$mapContainer, {
            center: options.center,
            zoom: options.zoom,
            scrollwheel: options.scrollwheel
        });

        marker = new google.maps.Marker({
            position: options.center,
            map: map,
            title: options.markerTitle
        });

        bindEvents();
    }

    function bindEvents() {
        google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter();

            google.maps.event.trigger(map, 'resize');
            map.setCenter(center); 
        });
    }

    return googleMap;
};