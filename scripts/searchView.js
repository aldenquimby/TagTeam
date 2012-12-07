var SearchView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'search',
    // Cache the template function for a single item.
    template: 'search-view',
    // The DOM events specific to an item.
    events: {
      "submit form": "search"
    },
    lastSearch: {},

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      //let's set up the events!!
      dispatcher.on(appEvents.yelpResultsReturned, function (data){
        self.displayResults(data);
      });
      dispatcher.on(appEvents.viewProfilePage, function (){
        self.$el.hide();
      });
      dispatcher.on(appEvents.showSearchPage, function (){
        self.$el.show();
      });

      self.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.$el.mustache(self.template, {
          results: self.results 
      }, { method:'html' });
      
      return self;
    },

    search: function (e) {
      var self = this;
      e.preventDefault();
      var query = self.$el.find('#search-query').val();
      var location = self.$el.find('#search-location').val();
      if(location==""){
        location = appDefaults.location;
      }
      if(query==""){
        query = appDefaults.query;
      }
      self.lastSearch.location = location;
      self.lastSearch.query = query;
      yelpApi.search(function(data){
        dispatcher.trigger(appEvents.yelpResultsReturned, data);
      }, location, query);

    },

    displayResults: function (data) {
      var self = this;
      console.log(data);
      self.$el.find('.results').html('');
      self.displayMessage(data.businesses.length, self.lastSearch.query, self.lastSearch.location);
      _.each(data.businesses, function(result){
        self.$el.find('.results').append(new SearchResultView({model:result}).el);
      });
    },

    displayMessage: function (num,search,location){
      var self = this;
      var template = "results-message";
      self.$el.find('.result-message').remove();
      self.$el.find('.results').mustache(template, {
          number: num,
          search: search,
          location: location 
      }, { method:'prepend' });
    }




  });