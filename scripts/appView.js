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

    // keep list of the profiles we've loaded so we don't load every time
    profiles: {},

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.viewProfilePage, function(business){
        // create new profile view if we haven't yet
        if (self.profiles[business.id] == null) {
          self.$el.find('.desktop').append(new ProfileView({smallModel:business}).el); 
          self.profiles[business.id] = business;
        }
      });

      dispatcher.on(appEvents.apiError, function(msg) {
        self.onSearchError(msg);
      });

      dispatcher.on(appEvents.searchError, function(msg) {
        self.onSearchError(msg);
      });

      dispatcher.on(appEvents.persistResultsReturned, function(data){
        _.each(data, function(persistItem){
          if (persistItem.data && persistItem.data.bookmark) {
            allBookmarks[persistItem.id] = persistItem.data.bookmark;
          }
        });
      });
      dispatcher.on(appEvents.bookmarkAdded, function(business){
        allBookmarks[business.id] = business.bookmark;
      });
      dispatcher.on(appEvents.bookmarkUpdated, function(business){
        if (business.bookmark) {
          allBookmarks[business.id] = business.bookmark;
        }
        else if (allBookmarks[business.id]) {
          delete allBookmarks[business.id];
        }
      });

      $('.slidey-show').live('click', function(e) {
        var slidey = $(e.currentTarget);
        var target = slidey.data('target');
        var otherSlidey = $('.slidey-hide[data-target="' + target + '"]');
        otherSlidey.show();
        slidey.hide();
        $(target).slideDown();
        $(target).find('.fixed-description').slideDown();
      });

      $('.slidey-hide').live('click', function(e) {
        var slidey = $(e.currentTarget);
        var target = slidey.data('target');
        var otherSlidey = $('.slidey-show[data-target="' + target + '"]');
        otherSlidey.show();
        slidey.hide();
        $(target).find('.fixed-description').hide();
        $(target).slideUp();
      });

      self.render();

      // fetch bookmarks when app starts up
      persistApi.get(function(data) {
        dispatcher.trigger(appEvents.persistResultsReturned, data);
      });

      dispatcher.trigger(appEvents.showSearchPage);
    },

    render: function() {
	    this.$el.mustache(this.template, {
	        title:'Tag Team', 
	    }, { method:'html' });

	    this.$el.find('.tabs').html(new TabsView().el);
      this.$el.find('.desktop').html(new SearchView().el);
      this.$el.find('.desktop').append(new BookmarksView().el);
      this.$el.find('.desktop').append(new HelpView().el);

      return this;
    },
    
    onSearchError: function(message) {
        $('#searchAlertContainer').mustache('alert', {
            type:'error', 
            message: message
        }, { method:'html' }); 
    }

  });