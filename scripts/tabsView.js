var TabsView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'tab-wrapper',
    // Cache the template function for a single item.
    
    // The DOM events specific to an item.
    events: {
      //i don't think there are events for this really
    },

    tabs: {
      
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      alert('hey you newed up a tab(s)view');

      //let's define some sort of tabs... object, and put in it search and bookmarks
      //the key can be the business id, the value can be the tabview... or whatevs
      //maybe we load up... the last tabs we had
      this.tabs['search'] = new TabView(true, false);
      this.tabs[57] = new TabView(false,false,{name:"Joe's pub", id: 57});
      this.tabs['bookmark'] = new TabView(false, true);
      //foreach(search and bookmark)
      //make new tabview with special shit (search/bookmark)

      //maybe i can keep the destroy? if we remove the object we should remove the tab for it i guess...
      //this.model.on('destroy', this.remove, this);
      this.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      _.each(this.tabs, function (tab) {
        self.$el.append(tab.el);
      })
      return self;
    },




  });