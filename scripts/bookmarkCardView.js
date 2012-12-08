var BookmarkCardView = Backbone.View.extend({

    tagName:  "div",
    className: 'bookmark',
    template: 'bookmark-card',

    events: {
      "click .remove": "remove",
      "click .add-label": "addLabel"
    },

    initialize: function() {
      this.render();
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

    addLabel: function(label) {
      var self = this;
      self.model.bookmark.labels.push(label);
      persistApi.set(self.model.id, self.model);
      dispatcher.trigger(appEvents.bookmarkUpdated, self.model);
      self.render();
    }

});
