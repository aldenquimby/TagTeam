var TabsView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'tab-wrapper',
    // Cache the template function for a single item.
    //TODO: set template shit up

    // The DOM events specific to an item.
    events: {
      //i don't think there are events for this really
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      //foreach(search and bookmark)
      //make new tabview with special shit (search/bookmark)

      //maybe i can keep the destroy? if we remove the object we should remove the tab for it i guess...
      this.model.on('destroy', this.remove, this);
    },

    // Re-render the titles of the todo item.
    render: function() {


      //this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    

    

  });