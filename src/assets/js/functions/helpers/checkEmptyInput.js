/**
* Example helper which is an IIFE (Immediately-invoked function expression). Set up in this way because it's not bound to a particular element on the page, but can be used from within any other component.
* This example returns 'check' as a pubicly-accessible function, used in the following way:
* projectName.checkEmptyInput.check(event, $('input[type=submit]'));
*/
projectName.checkEmptyInput = (function() {
    function check(e, $input) {
        var searchTerm = $input.val();

        e.preventDefault();

        if (!searchTerm) {
            $input
                .focus()
                .addClass('has-error');

            setTimeout(function() {
                $input.removeClass('has-error');
            }, 400);
        } else {
            return true;
        }
    }

    return {
        check: check
    };
})();