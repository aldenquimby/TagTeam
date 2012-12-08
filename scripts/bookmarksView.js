var BookmarksView = Backbone.View.extend({

    tagName:  "div",
    className: 'bookmarks',
    template: 'bookmarks-view',

    events: {
      "click sort-submit": "sort",
      "click filter-submit": "filter"
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkAdded, function (business) {
        self.addBookmark(business);
      });
      dispatcher.on(appEvents.persistResultsReturned, function (data) {
        self.displayBookmarks(data);
      });
      dispatcher.on(appEvents.viewProfilePage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showSearchPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showHelpPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showBookmarksPage, function () {
        self.$el.show();
      });

      self.render();

    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, { }, { method:'html' });
      return self;
    },

    filter: function(e) {
      var self = this;

    },

    sort: function(e) {
      var self = this;

    },

    displayBookmarks: function (data) {
      var self = this;
      self.$el.find('.results').html('');
      _.each(data, function(persistItem){
        self.$el.find('.results').append(new BookmarkCardView({model:persistItem.data}).el);
      })
    },

    addBookmark: function(business) {
      var self = this;
      persistApi.set(business.id, business);
      self.$el.find('.results').append(new BookmarkCardView({model:business}).el);
    }

});