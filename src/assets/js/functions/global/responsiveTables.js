/**
* Example function which is an IIFE (Immediately-invoked function expression). Set up in this way because it runs on rich text content which does not support hooking in via our data-component technique.
*/
projectName.responsiveTables = (function() {
    var ui = {
        $el: $('.rte')
    };

    var responsiveTables = {
        wrap: wrapTables,
        unwrap: unwrapTables
    };

    function init() {
        ui.$tables = $('table', ui.$el);

        wrapTables();
    }

    function wrapTables() {
        $.each(ui.$tables, function(i, table) {
            var $table = $(table);
            var wrapperExists = $table.parents('.table-wrapper').length;

            if (!wrapperExists) {
                $table.wrap($('<div>', {
                    'class': 'table-wrapper'
                }));
            } 
        });
    }

    function unwrapTables() {
        $.each(ui.$tables, function(i, table) {
            $(table).unwrap('.table-wrapper');
        });   
    }

    $(function() {
        init();
    });

    return responsiveTables;
})();