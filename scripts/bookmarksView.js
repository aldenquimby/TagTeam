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

      dispatcher.on(appEvents.bookMarkPlaceFinish, function (bkmrk) {
        self.addBookmark(bkmrk);
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

      persistApi.get(function(data) {
        dispatcher.trigger(appEvents.persistResultsReturned, data);
      });

    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, { }, { method:'html' });
      return self;
    },

    filter: function(e) {

    },

    sort: function(e) {

    },

    displayBookmarks: function (data) {
      var self = this;
      self.$el.find('.results').html('');
      _.each(data, function(bkmrk){
        self.$el.find('.results').append(new BookmarkCardView({model:bkmrk.data}).el);
      })
    },

    addBookmark: function(bkmrk) {
      persistApi.set(bkmrk.id, bkmrk);
      self.$el.find('.results').append(new BookmarkCardView({model:bkmrk}).el);
    }

});