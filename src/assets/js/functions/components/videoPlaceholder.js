projectName.videoPlaceholder = function(options) {
    var ui = {};
    var singleton = false;

    var defaults = {};
    
    var videoElements = {
        sitecore: function(url) {
           return $('<video></video>', {
                'class': 'responsive-video__object',
                'autoplay': true,
                'controls': true
            }).append($('<source></source>', {
                'src': url,
                'type': 'video/mp4'
            }));
        },
        youtube: function(url)  {
            return $('<iframe></iframe>', {
                'class': 'responsive-video__object',
                'type': 'text/html',
                'src': 'https://www.youtube.com/embed/' + url + '?autoplay=1&origin=https://YOURWEBSITE.CO.UK',
                'frameborder': 0,
                'allowfullscreen': 'allowfullscreen'
            });
        },
        error: function() {
            ui.$el.addClass('has-error');

            return $('<p></p>', {
                'class': 'responsive-video__error',
                'text': 'Sorry, there was an error loading this video'
            });
        }
    };

    var videoPlaceholder = {
        init: init,
        singleton: singleton,
        ui: ui
    };

    options = $.extend(true, {}, defaults, options);

    function init(element) {
        ui.$el = $(element);

        bindEvents();
    }

    function bindEvents() {
        ui.$el.on('click.loadVideo', function(e) {
            var videoType = ui.$el.data('video-type');
            var url = ui.$el.data('url');

            var responsiveVideo = $('<div></div>', {
                'class': 'responsive-video'
            }).append(getVideoElement(videoType, url));
            
            e.preventDefault();

            ui.$el
                .append(responsiveVideo)
                .addClass('has-loaded')
                .off('click.loadVideo');
        });
    }

    function getVideoElement(videoType, url) {
        return videoElements[videoType] ? videoElements[videoType](url) : videoElements.error;
    }

    return videoPlaceholder;
};