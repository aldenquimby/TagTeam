var BookmarkCardView = Backbone.View.extend({

    tagName:  "div",
    className: 'bookmark',
    template: 'bookmark-card',

    events: {
      "click .remove": "remove",
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkUpdated, function (business) {
        if (business.id == self.model.id) {
          self.updated(business);
        }
      });

      self.render();
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      return self;
    },

    remove: function() {
      var self = this;
      delete self.model.bookmark;
      persistApi.remove(self.model.id);
      dispatcher.trigger(appEvents.bookmarkUpdated, self.model);
      self.$el.remove();
    },

    updated: function(business) {
      var self = this;
      self.model = business;
      if (self.model.bookmark) {
        persistApi.set(self.model.id, self.model);        
      }
      else {
        persistApi.remove(self.model.id);
      }
      self.render();
    }

});
