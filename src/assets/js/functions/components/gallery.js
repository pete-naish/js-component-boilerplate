projectName.gallery = function(options) {
    var ui = {};
    var singleton = false;

    var config = {
        animationSpeed: projectName.app.config.animationSpeed,
        mobileBreakpoint: projectName.app.config,
        scrollOffset: 30
    };

    var defaults = {};

    var state = {
        isImageGallery: false,
        galleryItemCount: 0,
        currentInsertPos: 0,
        $currentItem: null,
        currentIndex: 0
    };

    var gallery = {
        init: init,
        singleton: singleton,
        ui: ui
    };

    options = $.extend(true, {}, defaults, options);

    function init(element) {
        ui.$el = $(element);
        ui.$galleryItems = $('.gallery__item', ui.$el);
        ui.$galleryDisplay = $('.gallery__display', ui.$el);
        ui.$galleryDisplayContainer = $('.gallery__display-container', ui.$el);
        ui.$galleryNav = $('.gallery__control', ui.$el);
        ui.$galleryClose = $('.gallery__close', ui.$el);

        state.galleryItemCount = ui.$galleryItems.length;
        state.isImageGallery = ui.$el.hasClass('gallery--image');

        bindEvents();
    }

    function bindEvents() {
        ui.$galleryItems.on('click.showGalleryContent', '.gallery__button', function(e) {
            var $this = $(this);
            var isMobile = Modernizr.mq(config.mobileBreakpoint);
            var content = $this.next('.gallery__content').html();
            var $parent = $(e.delegateTarget);
            var index = ui.$galleryItems.index($parent);
            var isActive = $parent.hasClass('is-active');
            var newInsertPos = getInsertPos(index, checkItemsPerRow());
            var insertIntoNewRow = newInsertPos !== state.currentInsertPos || isActive;
            var $galleryDisplay;

            e.preventDefault();

            state.currentInsertPos = newInsertPos;
            state.currentIndex = index;
            config.scrollOffset = isMobile ? 20 : 30;

            clearActiveGalleryItems();            

            if (insertIntoNewRow) {
                hideGalleryDisplay()
                    .promise()
                    .done(function() {
                        emptyGalleryDisplayContainer();

                        if (!isActive) {
                            populateGalleryDisplayContainer(content);
                            placeGalleryDisplay(newInsertPos);
                            revealGalleryDisplay();
                            activateGalleryItem($parent);
                            scrollToPosition($parent);
                        } else {
                            resetState();
                        }
                    });
            } else {
                activateGalleryItem($parent);

                fadeOutGalleryDisplayContainer()
                    .promise()
                    .done(function() {
                        emptyGalleryDisplayContainer();
                        populateGalleryDisplayContainer(content);
                        fadeInGalleryDisplayContainer();
                        scrollToPosition($parent);
                    });                    
            }
        });

        ui.$galleryNav.on('click.navigateGallery', function(e) {
            var $this = $(this);
            var direction = $this.data('direction');
            var newIndex = direction === 'next' ? state.currentIndex + 1 : state.currentIndex - 1;

            if (newIndex === state.galleryItemCount) {
                newIndex = 0;
            } else if (newIndex === -1) {
                newIndex = state.galleryItemCount -1;
            }

            e.preventDefault();

            $(ui.$galleryItems[newIndex]).find('.gallery__button').trigger('click.showGalleryContent');
        });

        ui.$galleryClose.on('click.closeGallery', function(e) {
            e.preventDefault();

            clearActiveGalleryItems();

            hideGalleryDisplay()
                .promise()
                .done(function() {
                    emptyGalleryDisplayContainer();
                    resetState();
                });
        });

        $(window).smartresize(function() {
            var index;
            var insertPos;

            if (state.$currentItem) {
                placeGalleryDisplay(-1);

                index = ui.$galleryItems.index(state.$currentItem);
                insertPos = getInsertPos(index, checkItemsPerRow());
                state.currentInsertPos = insertPos;

                placeGalleryDisplay(insertPos);
            }
        }, 1000);
    }

    function checkItemsPerRow() {
        var itemsPerRow = 0;

        $.each(ui.$galleryItems, function(i, item) {
            var $item = $(item);
            var $prevItem = $item.prev();
            var isNotFirstItem = $prevItem.length;
            var topPositionDifferent;

            if (isNotFirstItem) {
                topPositionDifferent = $item.position().top !== $prevItem.position().top;

                if (topPositionDifferent) {
                    return false;
                }
            }

            itemsPerRow++;
        });

        return itemsPerRow;
    }

    function getInsertPos(index, itemsPerRow) {
        var currentRow = Math.floor(index / itemsPerRow);
        var lastItemInCurrentRow = ((currentRow + 1) * itemsPerRow) - 1; // make sure maths works with 0-based index

        if (lastItemInCurrentRow === state.galleryItemCount) {
            lastItemInCurrentRow = state.galleryItemCount - 1;
        }

        return lastItemInCurrentRow;
    }

    function emptyGalleryDisplayContainer() {
        ui.$galleryDisplayContainer.empty();
    }

    function fadeOutGalleryDisplayContainer() {
        return ui.$galleryDisplayContainer.fadeOut(config.animationSpeed);
    }

    function fadeInGalleryDisplayContainer() {
        return ui.$galleryDisplayContainer.fadeIn(config.animationSpeed);   
    }

    function populateGalleryDisplayContainer(content) {
        ui.$galleryDisplayContainer.append(content);
    }

    function placeGalleryDisplay(pos) {
        ui.$galleryDisplay.insertAfter(ui.$galleryItems.eq(pos));
    }

    function revealGalleryDisplay() {
        return ui.$galleryDisplay.slideDown(config.animationSpeed);   
    }

    function hideGalleryDisplay() {
        return ui.$galleryDisplay.slideUp(config.animationSpeed);   
    }

    function clearActiveGalleryItems() {
        ui.$galleryItems.removeClass('is-active');

        state.$currentItem = null;
    }

    function activateGalleryItem(item) {
        state.$currentItem = item.addClass('is-active');
    }

    function scrollToPosition(el) {
        $('html, body').animate({
            scrollTop: el.offset().top -config.scrollOffset
        }, config.animationSpeed);
    }

    function resetState() {
        state.currentInsertPos = 0;
        state.currentIndex = 0;      
    }

    return gallery;
};