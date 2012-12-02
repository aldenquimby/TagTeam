
function Tutorial(tutorial) {

    // private members

    var _isTutorialOpen = false;
    var _isSetup = false;
    var _t = tutorial;

    // private methods

    var setup = function() {

        $('.popover-close').live('click', function() {
            $($(this).data('target')).popover('destroy');
            _isTutorialOpen = false;
        });

        $('.popover-next').live('click', function() {
            var closePopover = $($(this).parents('.popover').find('.popover-close').data('target'));
            var showPopover = $($(this).data('target'));
            var oldOffset = closePopover.parent().find('.popover').offset().top;
            closePopover.popover('destroy');
            showPopover.popover('show');
            var newOffset = showPopover.parent().find('.popover').offset().top;
            var scroll =  (newOffset - oldOffset)*0.5;
            $("html, body").animate({ scrollTop: $(document).scrollTop() + scroll }, "slow");
        });

        $('.popover-done').live('click', function() {
            var close = $(this).parents('.popover').find('.popover-close');
            $(close.data('target')).popover('destroy');
            $("html, body").animate({ scrollTop: 0 }, "slow");
            _isTutorialOpen = false;
        });

        _isSetup = true;

    };

    // public methods

    this.kickoff = function() {

        // setup if necessary
        if (!_isSetup) {
            setup();
        }

        // get to top of page
        $("html, body").animate({ scrollTop: 0 }, "slow");

        // close any existing tutorial
        $('.popover-close').click();

        for (var i = 0; i < _t.length; i++) {
            var titleData = {number:i+1, title:_t[i].title, target:_t[i].target};
            var contentData = {content:_t[i].content};
            if (i < _t.length - 1) {
                contentData['nextTarget'] = _t[i+1].target;
            }
            var title = $.Mustache.render('popover-title', titleData);
            var content = $.Mustache.render('popover-content', contentData);
            $(_t[i].target).popover({
                title:title, content:content, html:true, trigger:'manual', placement:_t[i].placement
            });
        }
        
        $(_t[0].target).popover('show');

        _isTutorialOpen = true;

    };

    this.isOpen = function() {
        return _isTutorialOpen;
    }

}
