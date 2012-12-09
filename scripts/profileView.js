var ProfileView = Backbone.View.extend({

    tagName:  "div",
    className: 'profile',
    template: 'profile-page',
    events: {
    },

    appliedTags: [],
    allowedTags: [],

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

      self.setupBookmark();

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
      var spotToCut = fullBusiness.image_url.lastIndexOf('/');
      var bigimg = fullBusiness.image_url.substring(0, spotToCut + 1) + 'l.jpg';
      fullBusiness.big_img = bigimg;
      // re-render
      self.render();
    },

    setupBookmark: function() {
      var self = this;

      $('#modal-bookmark-' + self.model.id).remove();
      $('body').mustache('bookmark-modal', self.model);

      var modal = $('#modal-bookmark-' + self.model.id);
      var appliedTagsWrapper = modal.find('.applied-tags');
      var typeaheadInput = modal.find('.bookmark-add-tag');

      self.appliedTags = (self.model.bookmark || {}).tags || [];
      self.allowedTags = appDefaults.tags;
      _.each(allBookmarks, function(bkmrk) {
          _.each(bkmrk.tags, function(label) {
              self.allowedTags.push(label);
          });
      });
      self.allowedTags = _.uniq(_.difference(self.allowedTags, self.appliedTags));

      modal.find('.bookmark-remove-tag').live('click', function(e) {
        var tag = $(e.currentTarget).data('tag');
        self.allowedTags.push(tag);
        self.appliedTags = _.without(self.appliedTags, tag);
        $(e.currentTarget).parent().remove();
      });

      var applyTag = function(tag) {
          self.appliedTags.push(tag);
          self.allowedTags = _.without(self.allowedTags, tag);
          appliedTagsWrapper.mustache('bookmark-tags', {bookmark:{tags:self.appliedTags}}, {method:'html'});
      };

      typeaheadInput.typeahead({
        source: function(a, b) {
          return self.allowedTags;
        },
        items: 5,
        updater: function(item) {
          applyTag(item);
          return '';
        },
        highlighter: function(item) {
            return '<span>' + item + '</span>';
        }
      }); 

      typeaheadInput.keypress(function (e) {
        if (e.which == 13) {
          e.preventDefault();
          var tag = $(this).val();
          if (self.appliedTags.indexOf(tag) < 0 && tag != '') {
            applyTag(tag);
          }
          $(this).val('');
          return false;
        }
      });

      var startDatepicker = $('#bookmark-reminder-start-' + self.model.id);
      var endDatepicker = $('#bookmark-reminder-end-' + self.model.id);

      var currentStart = startDatepicker.val();

      if (currentStart != '') {
        endDatepicker.removeAttr('disabled');
      }

      endDatepicker.datepicker({
        autoclose: true,
        startDate: currentStart
      });

      startDatepicker.datepicker({
        autoclose: true,
        startDate: new Date()
      }).on('changeDate', function(ev) {
        endDatepicker.removeAttr('disabled');
        endDatepicker.datepicker('setStartDate', ev.date);
        endDatepicker.val(startDatepicker.val());
        endDatepicker.datepicker('update');
        endDatepicker.val('');
      });

      modal.find('.bookmark-submit').click(function() {
        var notes = $("#bookmark-notes-" + self.model.id).val();
        var start = startDatepicker.val();
        var end = endDatepicker.val();

        var isAdd = self.model.bookmark == null;

        self.model.bookmark = { 
          tags: self.appliedTags,
          notes: notes
        };

        if (start != '') {
          self.model.bookmark.reminder = {
            start: start,
            end: end == '' ? null : end
          }
        }

        modal.modal('hide');

        if (isAdd) {
          dispatcher.trigger(appEvents.bookmarkAdded, self.model);
        } else {
          dispatcher.trigger(appEvents.bookmarkUpdated, self.model);          
        }
      });
    }

  });







