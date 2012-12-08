var TabView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'tab',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'tab-card',
    // The DOM events specific to an item.
    events: {
      "click": "showStuff"
    },

    search: false,

    bookmark: false,

    help: false,

    business: {},

    name: '',
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(place, s, b, h) {

      if(s){
        this.search = true;
        this.name = 'Search';
      }
      else if(b){
        this.bookmark = true;
        this.name = 'My Bookmarks';
      }
      else if(h){
        this.help = true;
        this.name = 'Help';
        this.$el.addClass('helpTab');
      }
      else{
        this.business = place;
        this.name = place.name;
        this.$el.addClass('businessTab');
      }

      //maybe i can keep the destroy? if we remove the object we should remove the tab for it i guess...
      this.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.$el.mustache(self.template, {
          name: self.name 
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
    }

  });








