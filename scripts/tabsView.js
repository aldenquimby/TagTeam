var TabsView = Backbone.View.extend({

    tagName:  "div",
    className: 'tab-wrapper',
    events: {
    },

    search: {
      searches: {}
    },
    bookmark: {
      bookmarks: {}
    },
    helpTab: {},

    tabCount: 0,

    initialize: function() {
      var self = this;
      //let's set up the events!!

      dispatcher.on(appEvents.viewProfilePage, function (business){
        if (business.bookmark == null) {
          self.handleViewProfile(business);          
        }
        else {
          self.handleViewBookmarkedProfile(business);          
        }
      });
      dispatcher.on(appEvents.bookmarkUpdated, function(business){
        if (business.bookmark == null) {
          self.handleBookmarkRemoved(business);
        }
      });
      dispatcher.on(appEvents.bookmarkAdded, function (business){
          self.handleBookmarkAdded(business);
      });
      dispatcher.on(appEvents.tabClosed, function(businessId) {
          self.tabClosed(businessId);
      });
      dispatcher.on(appEvents.showSearchPage, function() {
        self.search.tab.$el.addClass('tab-select');
      });
      dispatcher.on(appEvents.showBookmarksPage, function() {
        self.bookmark.tab.$el.addClass('tab-select');
      });

      //first let's set up search tab
      self.search.tab = new TabView(self.tabCount++, null, false, true,false)
      self.search.searches = {};

      //then let's set up bookmark tab
      self.bookmark.tab = new TabView(self.tabCount++, null, false, false, true);
      self.bookmark.bookmarks = {};

      //set up the help tab!
      self.helpTab = new TabView(self.tabCount++, null, false, false, false, true);
      //maybe i can keep the destroy? if we remove the object we should remove the tab for it i guess...
      //this.model.on('destroy', this.remove, this);
      self.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      
      self.$el.html('');

      //render search tab
      self.$el.append(self.search.tab.render().el);
      //render all tabs opened from searches
      _.each(self.search.searches, function (tab) {
        self.$el.append(tab.render().el);
      });

      //render bookmark tab
      self.$el.append(self.bookmark.tab.render().el);
      //render all tabs opened from bookmarks
      _.each(self.bookmark.bookmarks, function (tab){
        self.$el.append(tab.render().el);
      });
      //render the help tab
      self.$el.append(self.helpTab.render().el);
      return self;
    },

    handleBookmarkRemoved: function(business) {
      var self = this;
      var currentTab = self.bookmark.bookmarks[business.id];
      if (currentTab != null) {
        var shouldShow = currentTab.$el.hasClass('tab-select');
        self.search.searches[business.id] = new TabView(self.tabCount++, business, {show:shouldShow});
        delete self.bookmark.bookmarks[business.id];
      }
      self.render();
    },

    handleBookmarkAdded: function(business) {
      var self = this;
      var currentTab = self.search.searches[business.id];
      var shouldShow = currentTab != null && currentTab.$el.hasClass('tab-select');
      self.bookmark.bookmarks[business.id] = new TabView(self.tabCount++, business, {show:shouldShow});
      delete self.search.searches[business.id];
      self.render();
    },

    handleViewBookmarkedProfile: function(business) {
      var self = this;
      var currentTab = self.bookmark.bookmarks[business.id];
      if (currentTab == null) {
        self.bookmark.bookmarks[business.id] = new TabView(self.tabCount++, business, {show:true});
        delete self.search.searches[business.id];
      }
      else {
        dispatcher.trigger(appEvents.tabSelected, currentTab.tabId);
      }
      self.render();
    },

    handleViewProfile: function(business) {
      var self = this;
      var currentTab = self.search.searches[business.id];
      if (currentTab == null) {
        self.search.searches[business.id] = new TabView(self.tabCount++, business, {show:true});
        delete self.bookmark.bookmarks[business.id];
      } 
      else {
        dispatcher.trigger(appEvents.tabSelected, currentTab.tabId);
      }
      self.render();
    },

    tabClosed: function(businessId) {
      var self = this;
      delete self.search.searches[businessId];
      delete self.bookmark.bookmarks[businessId];
      dispatcher.trigger(appEvents.showSearchPage);
    }

  });