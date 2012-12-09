var SearchResultView = BookmarkHelperView.extend({

    tagName:  "div",
    className: 'result',
    template: 'result-card',
    events: {
      "click .result-name a": "showProfilePage",
      "click .result-image-wrapper": "showProfilePage"
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkUpdated, function(business){
        if (self.model.id == business.id) {
          self.model = business;
          self.render();
        }
      });
      dispatcher.on(appEvents.bookmarkAdded, function(business){
        if (self.model.id == business.id) {
          self.model = business;
          self.render();
        }
      });

      self.render();
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      self.setupBookmark();
      return self;
    },

    showProfilePage: function () {
      var self = this;
      dispatcher.trigger(appEvents.viewProfilePage, self.model);
    }

});

