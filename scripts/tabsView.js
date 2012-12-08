var TabsView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'tab-wrapper',
    // Cache the template function for a single item.
    
    // The DOM events specific to an item.
    events: {
      //i don't think there are events for this really
    },

    search: {
      searches: {}
    },
    bookmark: {
      bookmarks: {}
    },
    helpTab: {},

    tabCount: 0,

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      //let's set up the events!!

      dispatcher.on(appEvents.viewProfilePage, function (business){
        if (business.bookmark == null) {
          self.handleViewProfile(business);          
        }
        else {
          self.handleViewBookmarkedProfile(business, true);          
        }
      });
      dispatcher.on(appEvents.bookmarkUpdated, function(business){
        if (business.bookmark == null) {
          self.handleBookmarkRemoved(business);
        }
      });
      dispatcher.on(appEvents.bookmarkAdded, function (business){
          self.handleViewBookmarkedProfile(business, false);
      })

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
      // move tab from bookmarks to searches
      if (self.bookmark.bookmarks[business.id] != null) {
        self.search.searches[business.id] = new TabView(self.tabCount++, business);
        delete self.bookmark.bookmarks[business.id];
        self.render();
      }
    },

    handleViewBookmarkedProfile: function(business, show) {
      var self = this;
      if (self.bookmark.bookmarks[business.id] == null) {
        self.bookmark.bookmarks[business.id] = new TabView(self.tabCount++, business, {show:show});
        if (self.search.searches[business.id] != null) {
          delete self.search.searches[business.id];
        }
      }
      self.render();
    },

    handleViewProfile: function(business) {
      var self = this;
      if (self.search.searches[business.id] == null) {
        self.search.searches[business.id] = new TabView(self.tabCount++, business);
        if (self.bookmark.bookmarks[business.id] != null) {
          delete self.bookmark.bookmarks[business.id];
        }
      }
      self.render();
    }

  });