var ProfileView = Backbone.View.extend({

    tagName:  "div",
    className: 'profile',
    template: 'profile-page',
    events: {
      "click": "clickedSomewhereOnMe"
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.showSearchPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showHelpPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showBookmarksPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.viewProfilePage, function(business){
        if (business.id == self.model.id) {
          self.$el.show();
        }
        else {
          self.$el.hide();
        }
      });

      dispatcher.on(appEvents.bookmarkUpdated, function (smallModel) {
        self.model.bookmark = smallModel.bookmark;
        self.render();
      });
      dispatcher.on(appEvents.bookmarkAdded, function (smallModel) {
        self.model.bookmark = smallModel.bookmark;
        self.render();
      });

      yelpApi.business(function(fullBusiness) {
        self.businessReturned(fullBusiness);
      }, self.options.smallModel.id);

    },

    render: function () {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      return self;
    },

    businessReturned: function(fullBusiness) {
      var self = this;
      self.model = fullBusiness;
      // make sure we know about bookmark if it exists
      self.model.bookmark = self.options.smallModel.bookmark;
      // re-render
      self.render();
    },

    clickedSomewhereOnMe: function () {
      alert('whatever brah');
    }

  });







