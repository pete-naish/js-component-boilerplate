projectName.accordion = function(options) {
    var ui = {};
    var singleton = false;
    
    var config = {
        animationSpeed: projectName.app.config.animationSpeed
    };

    var defaults = {
        collapseOthers: true
    };

    var accordion = {
        init: init,
        singleton: singleton,
        ui: ui
    };

    options = $.extend(true, {}, defaults, options);

    function init(element) {
        ui.$el = $(element);
        ui.$accordionToggles = $('.accordion__title', ui.$el);
        ui.$accordionContent = $('.accordion__content', ui.$el);

        bindEvents();
    }

    function bindEvents() {
        ui.$accordionToggles.on('click', function(e) {
            var $this = $(this);
            var isActive = $this.hasClass('is-active');
            var $targetContent = $this.next('.accordion__content');
            var accordionToggles = options.collapseOthers ? ui.$accordionToggles : $this;
            var accordionContent = options.collapseOthers ? ui.$accordionContent : $targetContent;

            collapseAccordion(accordionToggles, accordionContent);
            
            if (!isActive) {
                expandAccordion($this, $targetContent);
            }
        });
    }

    function collapseAccordion(accordionToggles, accordionContent) {
        accordionToggles.removeClass('is-active');
        accordionContent.stop().slideUp(config.animationSpeed);
    }

    function expandAccordion($el, $content) {
        $el.addClass('is-active');
        $content.stop().slideDown(config.animationSpeed);
    }

    return accordion;
};