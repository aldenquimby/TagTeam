var TabsView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'tab-wrapper',
    // Cache the template function for a single item.
    
    // The DOM events specific to an item.
    events: {
      //i don't think there are events for this really
    },

    search: {},
    bookmark: {},

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      //let's set up the events!!

      dispatcher.on(appEvents.viewProfilePage, function (business){
        self.search.searches[business.id] = new TabView(business);
        self.render();
      });
      dispatcher.on(appEvents.bookMarkPlaceFinish, function (business){
        self.bookmark.bookmarks[business.id] = new TabView(business);
        self.render();
      });

      //first let's set up search tab
      self.search.tab = new TabView(null, true,false)
      self.search.searches = {};

      //then let's set up bookmark tab
      self.bookmark.tab = new TabView(null, false, true);
      self.bookmark.bookmarks = {};

      //maybe i can keep the destroy? if we remove the object we should remove the tab for it i guess...
      //this.model.on('destroy', this.remove, this);
      self.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.$el.html('');

      //render search tab
      self.$el.append(self.search.tab.el);
      //render all tabs opened from searches
      _.each(self.search.searches, function (tab) {
        self.$el.append(tab.el);
      })

      //render bookmark tab
      self.$el.append(self.bookmark.tab.el);
      //render all tabs opened from bookmarks
      _.each(self.bookmark.bookmarks, function (tab){
        self.$el.append(tab.el);
      });
      //render the help tab
      
      return self;
    },




  });