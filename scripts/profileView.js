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

//      var yelpApi = new YelpApiDebug(self.onApiError);

      var businessObject = self.options.smallModel;
      //for now
      self.model = businessObject;

      dispatcher.on(appEvents.showSearchPage, function (){
        self.$el.remove();
      });

      console.log("right before api call");
      console.log(businessObject);

      yelpApi.business(dispatcher.trigger("got " + businessObject[0]), businessObject[0]);//here************* what am i doing wrong?

      console.log("right after api call");

      //businessObject is the thing that has the id in it so you can do the yelp business call
      dispatcher.listen("got " + businessObject[0], function (data){//here***************** what am i doing wrong?
        self.render(data)
      });

//      yelpApi.business(self.render, businessObject[0]);    

    },

    // Re-render the titles of the todo item.
    render: function (data) {
      var self = this;
      self.$el.mustache(self.template, data, { method:'html' });
      return self;
    },

    onApiError: function () {
      alert("something bad happened with the api");
    },

    showStuff: function () {
      alert('whatever brah');
    },
    off: function (){

    }

  });







