var ProfileView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'profile',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'profile-page',
    // The DOM events specific to an item.
    events: {
      "click": "showStuff"
    },
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      var businessObject = self.options.smallModel;
      //for now
      self.model = businessObject;

      dispatcher.on(appEvents.showSearchPage, function (){
        self.$el.remove();
      })
      //businessObject is the thing that has the id in it so you can do the yelp business call
      self.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      return self;
    },

    showStuff: function () {
      alert('whatever brah');
    },
    off: function (){

    }

  });








