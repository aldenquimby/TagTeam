var TabView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'tab',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'tab-card',
    // The DOM events specific to an item.
    events: {
      "click": "showStuff",
      "click .tab-close": "close"
    },
    tabId: 0,

    search: false,

    bookmark: false,

    help: false,

    business: {},

    name: '',
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(tabId, place, bookmarked, s, b, h) {
      var self = this;
      self.tabId = tabId;

      dispatcher.on(appEvents.tabSelected, function (id){
        if(self.tabId!=id){
          self.$el.removeClass('tab-select');
        } else {
          self.$el.addClass('tab-select');
        }
      });

      if(place && !bookmarked || bookmarked && bookmarked.show){
        dispatcher.trigger(appEvents.tabSelected, self.tabId);
      }
      if(s){
        self.search = true;
        self.name = 'Search';
        self.$el.addClass('searchTab');
      }
      else if(b){
        self.bookmark = true;
        self.name = 'My Bookmarks';
        self.$el.addClass('bookmarkTab');
      }
      else if(h){
        self.help = true;
        self.name = 'Help';
        self.$el.addClass('helpTab');
      }
      else{
        self.business = place;
        self.name = place.name.length < 20 ? place.name : (place.name.substring(0, 19) + '...');
        self.$el.addClass('businessTab');
      }

      //maybe i can keep the destroy? if we remove the object we should remove the tab for it i guess...
      self.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.$el.mustache(self.template, {
          name: self.name,
          id: self.business.id
      }, { method:'html' });
      self.delegateEvents();
      return self;
    },

    showStuff: function () {
      var self = this;
      if(self.search){
        //show the search view
        dispatcher.trigger(appEvents.showSearchPage);
      }
      else if(self.bookmark){
        //show the bookmarks view
        dispatcher.trigger(appEvents.showBookmarksPage);
      }
      else if(self.help){
        //show help stuff
        dispatcher.trigger(appEvents.showHelpPage);
      }
      else{
        //it's a business, show the profile view
        dispatcher.trigger(appEvents.viewProfilePage, self.business);
      }
      dispatcher.trigger(appEvents.tabSelected, self.tabId);
    },

    close: function(e) {
      var self = this;
      e.stopPropagation();
      dispatcher.trigger(appEvents.tabClosed, self.business.id);
      self.$el.remove();
    } 

  });








