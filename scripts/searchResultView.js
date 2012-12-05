var SearchResultView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'result',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'result-card',
    // The DOM events specific to an item.
    events: {
      "click": "showStuff"
    },

    
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      
      this.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      console.log(self.model);
      self.$el.mustache(self.template, self.model, { method:'html' });
      return self;
    },

    showStuff: function () {
      alert('do some stuff');

    }

  });








