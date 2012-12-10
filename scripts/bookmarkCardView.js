var BookmarkCardView = BookmarkHelperView.extend({

    tagName:  "div",
    className: 'bookmark',
    template: 'result-card',

    events: {
      "click .result-name a": "showProfilePage",
      "click .result-image-wrapper": "showProfilePage"
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkUpdated, function (business) {
        if (business.id == self.model.id) {
          self.updated(business);
        }
      });

      self.render();

      self.setupBookmark();
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      self.delegateEvents();
      return self;
    },

    updated: function(business) {
      var self = this;
      self.model = business;
      if (self.model.bookmark) {
        persistApi.set(self.model.id, self.model);        
      }
      else {
        persistApi.remove(self.model.id);
        self.$el.remove();
      }
      self.render();
    },

    showProfilePage: function () {
      var self = this;
      dispatcher.trigger(appEvents.viewProfilePage, self.model);
    }

});
