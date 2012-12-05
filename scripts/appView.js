//this is the first view that creates the other views

var AppView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'page',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'app-view',
    // The DOM events specific to an item.
    events: {
      //i don't think there are events for this really either...
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      //render my template yo

      /*
		function onSearchSuccess(data) {
                    if (data.total == 0) {
                        // handle no results here
                        return;
                    }

                    // show search results
                    $('#searchResultsContainer').mustache('searchResults', data, {method:'html'});

                    // get more info about first result (exmample reviews, etc)
                    yelpApi.business(onBusinessSuccess, data.businesses[0].id);
                };

                function onBusinessSuccess(data) {
                    $('#businessContainer').mustache('business', data, {method:'html'});
                }

                function onApiError() {
                    $('#alertContainer').mustache('alert', {
                        type:'error', 
                        message: 'Looks like the Yelp API might be down, please try again later.'
                    }, { method:'html' });
                };

      */

      this.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
	    this.$el.mustache(this.template, {
	        title:'Tag Team', 
	    }, { method:'html' });

	    this.$el.find('.tabs').html(new TabsView().el);
        this.$el.find('.desktop').html(new SearchView().el);


      return this;
    },
    

    

  });