var SearchView = Backbone.View.extend({

    tagName:  "div",
    className: 'search',
    template: 'search-view',
    events: {
      "submit form": "search",
      "change .filter form": "filterResults"
    },

    lastSearch: {},

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.yelpResultsReturned, function (data){
        self.displayResults(data);
      });
      dispatcher.on(appEvents.viewProfilePage, function (){
        self.$el.hide();
      });
      dispatcher.on(appEvents.showBookmarksPage, function (){
        self.$el.hide();
      });
      dispatcher.on(appEvents.showHelpPage, function () {
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
      //i just... i just don't understand
      self.$el.find('.filter').hide();
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
        self.yelpSearchComplete(data);
      }, location, query);
      
      
    },

    yelpSearchComplete: function(data) {
      // need to check for bookmarked places
      _.each(data.businesses, function(result){
        if (allBookmarks[result.id] != null) {
          result.bookmark = allBookmarks[result.id];
        }
      });
      // trigger AFTER setting bookmarks
      dispatcher.trigger(appEvents.yelpResultsReturned, data);
      
    },

    displayResults: function (data) {
      var self = this;
      console.log(data);
      self.$el.find('.results').html('');
      self.lastSearch.results = [];
      self.displayMessage(data.businesses.length, self.lastSearch.query, self.lastSearch.location);
      var html = "";
      _.each(data.businesses, function(result){
        var view = new SearchResultView({model:result})
        self.lastSearch.results.push(view);
        self.$el.find('.results').append(view.el);
      });
      
      self.$el.find('.results').show().height(window.innerHeight-200);
      self.showFilterView(data.businesses);
    },

    showFilterView: function (data){
      var self = this;
      cats = _.uniq(_.flatten(_.map(data, function(bus){
        return _.pluck(bus.categories, 0);
      })));

      self.$el.find('.filter').mustache('filter-view', {
           categories: cats
      }, { method:'html' });

      self.$el.find('.filter').show();
    },

    filterResults: function () {
      var self = this;
      var sort = $('.filter form').find("select").val();
      var filtered = self.lastSearch.results;
      if(sort=="alphabetical"){
        filtered = _.sortBy(filtered, function(bus){ return bus.model.name; });
      }
      else if(sort=="# reviews"){
        filtered = _.sortBy(filtered, function(bus){ return -1*bus.model.review_count; });
      }
      else if(sort=="rating"){
        filtered = _.sortBy(filtered, function(bus){ return -1*bus.model.rating; });
      }
      else if(sort=="bookmarked"){
        filtered = _.sortBy(filtered, function(bus){ return allBookmarks[bus.model.id] == null;});
      }
      else{
        //leave it yo
      }
      var categoryHash = {};
      self.$el.find('.category-check').each(function (){
        if($(this).is(':checked')){
          categoryHash[$(this).val()] = true;
        }
      });
      console.log(categoryHash);

      filtered = _.filter(filtered, function (bus){
        return _.any(bus.model.categories, function (cat){
          return categoryHash[cat[0]];
        });
      });

      _.each(self.lastSearch.results, function (view){
        view.$el.remove();
      });
      _.each(filtered, function(view){
        self.$el.find('.results').append(view.render().el);
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