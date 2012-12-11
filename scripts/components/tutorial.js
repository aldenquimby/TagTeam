
function Tutorial(tutorial) {

    // private members

    var _isTutorialOpen = false;
    var _isSetup = false;
    var _t = tutorial;

    // private methods

    var getTarget = function(target) {
        var tmp = $(target);
        return tmp.length > 1 ? $(tmp[0]) : tmp;
    };

    var setup = function() {

        $('.popover-close').live('click', function() {
            getTarget($(this).data('target')).popover('destroy');
            _isTutorialOpen = false;
        });

        $('.popover-next').live('click', function() {

            // do callback if it exists
            var tutorialId = $(this).data('tutorial-id');
            if (_t[tutorialId].transistionNextCallback) {
                _t[tutorialId].transistionNextCallback();
            }

            // add next popover
            var nextTrgt = _t[tutorialId + 1];
            var nextTrgtObj = getTarget(nextTrgt.target);
            if (!nextTrgtObj) {
                setTimeout(function() {
                    nextTrgtObj = getTarget(nextTrgt.target);
                }, 500);
            }

            nextTrgtObj.popover({
                title:nextTrgt.renderedTitle, 
                content:nextTrgt.renderedContent, 
                html:true, 
                trigger:'manual', 
                placement:nextTrgt.placement
            }); 

            var closePopover = getTarget($(this).parents('.popover').find('.popover-close').data('target'));
            var oldOffset = closePopover.parent().find('.popover').offset().top;
            closePopover.popover('destroy');
            nextTrgtObj.popover('show');
            var newOffset = nextTrgtObj.parent().find('.popover').offset().top;
            var scroll =  (newOffset - oldOffset)*0.5;
            $("html, body").animate({ scrollTop: $(document).scrollTop() + scroll }, "slow");
        });

        $('.popover-done').live('click', function() {
            var close = $(this).parents('.popover').find('.popover-close');
            getTarget(close.data('target')).popover('destroy');
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
            var titleData = {title:_t[i].title, target:_t[i].target};
            var contentData = {number:i+1, totalNumber: _t.length, content:_t[i].content, id:i};
            
            if (i < _t.length - 1) {
                contentData['hasNextTarget'] = true;
            }
            
            _t[i].renderedTitle = $.Mustache.render('tutorial-popover-title', titleData);
            _t[i].renderedContent = $.Mustache.render('tutorial-popover-content', contentData);
        }
        
        var firstTrgt = getTarget(_t[0].target);
        firstTrgt.popover({
            title:_t[0].renderedTitle, 
            content:_t[0].renderedContent, 
            html:true, 
            trigger:'manual', 
            placement:_t[0].placement
        });  
        firstTrgt.popover('show');

        _isTutorialOpen = true;

    };

    this.isOpen = function() {
        return _isTutorialOpen;
    }

}
