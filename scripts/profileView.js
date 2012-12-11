var ProfileView = BookmarkHelperView.extend({

    tagName:  "div",
    className: 'profile',
    template: 'profile-page',
    events: {
      // none yet!
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
        if (smallModel.id == self.model.id) {
          self.model.bookmark = smallModel.bookmark;
        }
        self.render();
      });
      dispatcher.on(appEvents.bookmarkAdded, function (smallModel) {
        if (smallModel.id == self.model.id) {
          self.model.bookmark = smallModel.bookmark;
        }
        self.render();
      });

      //actual initialize functions

      yelpApi.business(function(fullBusiness) {
        self.businessReturned(fullBusiness);
      }, self.options.smallModel.id);
    },

    render: function () {
      var self = this;
      if(self.model.bookmark) {
        var shouldRemind = false;
        if(self.model.bookmark.reminder) {
          var shouldRemindText = "Remember to to visit!"
          if(self.model.bookmark.reminder.end) {
            var start = moment(self.model.bookmark.reminder.start);
            var end = moment(self.model.bookmark.reminder.end);
            if(start < moment() && moment() < end){
              shouldRemind = true;
               shouldRemindText += " (between " + self.model.bookmark.reminder.start 
                 + " and " + self.model.bookmark.reminder.end + ")";
            }
            else {
               self.model.bookmark.remindernote = "Remind me to visit between " + self.model.bookmark.reminder.start
                 + " and " + self.model.bookmark.reminder.end;
            }
          }
          else {
            var start = moment(self.model.bookmark.reminder.start);
            if(start < moment()){
              shouldRemind = true;
              shouldRemindText += " (after " + self.model.bookmark.reminder.start + ")";
            }
            else {
               self.model.bookmark.remindernote = "Remind me to visit after " + self.model.bookmark.reminder.start;
            }
          }
          if(shouldRemind){
            self.model.bookmark.remindernote = shouldRemindText;
          }
        }
      }

      self.$el.mustache(self.template, self.model, { method:'html' });
      setTimeout(function (){
        //this is messed up but you gotta do what you gotta do...
        var coord = self.model.location.coordinate;
        var mapOptions = {
          center: new google.maps.LatLng(coord.latitude, coord.longitude),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      var map = new google.maps.Map(self.$el.find('.map')[0],
          mapOptions);
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(coord.latitude, coord.longitude),
            map: map
        });
      }, 100);

      self.$el.find('.prof-details').height(window.innerHeight-280);

      self.setupBookmark();

      return self;
    },

    businessReturned: function(fullBusiness) {
      var self = this;
      self.model = fullBusiness;
      // make sure we know about bookmark if it exists
      self.model.bookmark = self.options.smallModel.bookmark;
      //do some object cleanup

      //like setting the reminder note if there is one...
      var cats = [];
      _.each(fullBusiness.categories, function(cat){
        cats.push(cat[0]);
      });
      fullBusiness.fixed_cat = cats.join(' - ');
      //now get that big img...
      var spotToCut = fullBusiness.image_url.lastIndexOf('/');
      var bigimg = fullBusiness.image_url.substring(0, spotToCut + 1) + 'l.jpg';
      fullBusiness.big_img = bigimg;
      // re-render
      self.render();
    },

});

