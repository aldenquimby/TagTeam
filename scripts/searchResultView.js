var SearchResultView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'result',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'result-card',
    // The DOM events specific to an item.
    events: {
      "click .result-name a": "showStuff",
      "click .result-image-wrapper": "showStuff",
      "click .bookmarkit": "showBookmarkPopover",
      "click .popover .close-bookmark-popover": "hideBookmarkPopover", 
      "click .popover .addBookmark": "addBookmark",
      "click .popover .remove-label": "removeLabel"
    },

    appliedLabels: [],
    allowedLabels: [],

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkUpdated, function(business){
        self.render();
      });
      dispatcher.on(appEvents.bookmarkAdded, function(business){
        self.render();
      });

      self.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      
      return self;
    },

    showStuff: function () {
      var self = this;
      dispatcher.trigger(appEvents.viewProfilePage, self.model);
    },

    createPopover: function() {
      var self = this;
      var title = $.Mustache.render('add-bookmark-popover-title');
      var content = $.Mustache.render('add-bookmark-popover-content');
      self.$el.find('.bookmarkit').popover({
        title:title, content:content, html:true, trigger:'manual', placement:'bottom'
      });

    },

    setupTypeahead: function() {
      var self = this;

      var popover = self.$el.find('.popover');

      self.allowedLabels = appDefaults.labels;
      _.each(allBookmarks, function(bkmrk){
          _.each(bkmrk.labels, function(label) {
              self.allowedLabels.push(label);
          });
      });
      self.allowedLabels = _.uniq(self.allowedLabels);

      popover.find('.typeahead').typeahead({
        source: function(a, b) {
          return self.allowedLabels;
        },
        items: 5,
        updater: function(item) {
          popover.find('.applied-labels').append(
            '<span class="label" style="margin-right:10px;">' + item + '<span data-tag="' + item + '" class="close remove-label" style="padding-left:5px;height:0px;margin-top:-2px;">×</span></span>'
          );
          self.appliedLabels.push(item);
          self.allowedLabels = _.without(self.allowedLabels, item);
          return '';
        },
        sorter: function(items) {
            return items;
        },
        highlighter: function(item) {
            return '<span>' + item + '</span>';
        }
      }); 

      popover.find('.typeahead').keyup(function (e) {
        if (e.keyCode == 13) {
          var item = $(this).val();
          if (self.appliedLabels.indexOf(item) < 0 && item != '') {
            popover.find('.applied-labels').append(
              '<span class="label" style="margin-right:10px;">' + item + '<span data-tag="' + item + '" class="close remove-label" style="padding-left:5px;height:0px;margin-top:-2px;">×</span></span>'
            );
            self.appliedLabels.push(item);
            self.allowedLabels = _.without(self.allowedLabels, item);
          }
          $(this).val('');
          return false;
        }
        else if (e.keyCode == 27) {
          self.hideBookmarkPopover();
          return false;
        }
      });

    },

    showBookmarkPopover: function(e) {
      var self = this;  
      e.stopPropagation();

      if ($(e.currentTarget).attr('class').indexOf('disabled') >= 0) {
        // currently disabled
        return;
      }

      // kill other popovers
      $('.bookmarkit').popover('destroy');

      // remove disabled
      $('.bookmarkit').removeClass('disabled');

      self.createPopover();

      // disable button
      $(e.currentTarget).addClass('disabled');

      // show popover
      $(e.currentTarget).popover('show');

      self.setupTypeahead();
    },

    hideBookmarkPopover: function(e) {
      var self = this;
      if (e){
        e.stopPropagation();
      }
      self.$el.find('.bookmarkit').removeClass('disabled');
      self.$el.find('.bookmarkit').popover('hide');
    },

    removeLabel: function(e) {
      var self = this;
      var tag = $(e.currentTarget).data('tag');
      self.allowedLabels.push(tag);
      self.appliedLabels = _.without(self.appliedLabels, tag);
      $(e.currentTarget).parent().remove();
    },

    addBookmark: function() {
      var self = this;

      // create bookmark object on business model using result of popover form
      self.model.bookmark = {
        labels: self.appliedLabels
      };

      dispatcher.trigger(appEvents.bookmarkAdded, self.model);
    }


  });








