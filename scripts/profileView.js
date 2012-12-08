var ProfileView = Backbone.View.extend({

    tagName:  "div",
    className: 'profile',
    template: 'profile-page',
    events: {
      "click": "clickedSomewhereOnMe"
    },

    initialize: function() {
      var self = this;


      //wiring everything up
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

      //actual initialize functions

      yelpApi.business(function(fullBusiness) {
        self.businessReturned(fullBusiness);
      }, self.options.smallModel.id);

      


    },

    render: function () {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      var coord = self.model.location.coordinate;
      var mapOptions = {
        center: new google.maps.LatLng(coord.latitude, coord.longitude),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(self.$el.find('.map')[0],
          mapOptions);
      return self;
    },

    businessReturned: function(fullBusiness) {
      var self = this;
      self.model = fullBusiness;
      console.log(fullBusiness);
      // make sure we know about bookmark if it exists
      self.model.bookmark = self.options.smallModel.bookmark;
      //do some object cleanup
      var cats = [];
      _.each(fullBusiness.categories, function(cat){
        cats.push(cat[0]);
      });
      fullBusiness.fixed_cat = cats.join(' - ');
      //now get that big img...
      

      // re-render
      self.render();
    },

    clickedSomewhereOnMe: function () {
      console.log('clicked somewhere');
    }

  });







