var SearchResultView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'result',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'result-card',
    // The DOM events specific to an item.
    events: {
      "click .result-name": "showStuff",
      "click .result-image-wrapper": "showStuff",
      "click .bookmarkit": "showBookmarkPopover",
      "click .popover .close": "hideBookmarkPopover", 
      "click .popover .addBookmark": "addBookmark" 
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkUpdated, function(business){
        self.render();
      });
      dispatcher.on(appEvents.bookmarkAdded, function(business){
        self.render();
      })

      self.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      console.log(self.model);
      self.$el.mustache(self.template, self.model, { method:'html' });

      var title = $.Mustache.render('add-bookmark-popover-title');
      var content = $.Mustache.render('add-bookmark-popover-content', {
        content: 'testing 123'
      });
      self.$el.find('.bookmarkit').popover({
        title:title, content:content, html:true, trigger:'manual', placement:'bottom'
      });

      return self;
    },

    showStuff: function () {
      var self = this;
      dispatcher.trigger(appEvents.viewProfilePage, self.model);
    },

    showBookmarkPopover: function(e) {
      var self = this;  

      e.stopPropagation();

      // dispatcher.trigger(appEvents.bookmarkPopOver, self.model);

      $(e.currentTarget).popover('show');

    },

    hideBookmarkPopover: function(e) {
      var self = this;

      e.stopPropagation();


      self.$el.find('.bookmarkit').popover('hide');      
    },

    addBookmark: function() {
      var self = this;

      // create bookmark object on business model using result of popover form
      self.model.bookmark = {
        labels: ['group hangout', 'date spot']
      };

      dispatcher.trigger(appEvents.bookmarkAdded, self.model);
    }


  });








