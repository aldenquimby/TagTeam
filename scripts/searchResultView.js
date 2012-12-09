var SearchResultView = Backbone.View.extend({

    tagName:  "div",
    className: 'result',
    template: 'result-card',
    events: {
      "click .result-name a": "showProfilePage",
      "click .result-image-wrapper": "showProfilePage",
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
        if (self.model.id == business.id) {
          self.model = business;
          self.render();
        }
      });
      dispatcher.on(appEvents.bookmarkAdded, function(business){
        if (self.model.id == business.id) {
          self.model = business;
          self.render();
        }
      });

      self.render();
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      return self;
    },

    showProfilePage: function () {
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
      var typeaheadInput = popover.find('.typeahead');

      self.allowedLabels = appDefaults.labels;
      _.each(allBookmarks, function(bkmrk) {
          _.each(bkmrk.labels, function(label) {
              self.allowedLabels.push(label);
          });
      });
      self.allowedLabels = _.uniq(self.allowedLabels);

      typeaheadInput.typeahead({
        source: function(a, b) {
          return self.allowedLabels;
        },
        items: 5,
        updater: function(item) {
          self.appliedLabels.push(item);
          self.allowedLabels = _.without(self.allowedLabels, item);
          popover.find('.applied-labels').mustache('bookmark-tags', {bookmark:{labels:self.appliedLabels}}, {method:'html'});
          return '';
        },
        sorter: function(items) {
            return items;
        },
        highlighter: function(item) {
            return '<span>' + item + '</span>';
        }
      }); 

      typeaheadInput.keyup(function (e) {
        if (e.keyCode == 13) {
          var item = $(this).val();
          if (self.appliedLabels.indexOf(item) < 0 && item != '') {
            self.appliedLabels.push(item);
            self.allowedLabels = _.without(self.allowedLabels, item);
            popover.find('.applied-labels').mustache('bookmark-tags', {bookmark:{labels:self.appliedLabels}}, {method:'html'});
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

      // kill other popovers, disable appropriate button
      $('.bookmarkit').popover('destroy');
      $('.bookmarkit').removeClass('disabled');
      $(e.currentTarget).addClass('disabled');

      // create and show popover, and setup typeahead
      self.createPopover();
      $(e.currentTarget).popover('show');
      self.setupTypeahead();
    },

    hideBookmarkPopover: function(e) {
      var self = this;
      if (e) {
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

      self.model.bookmark = { 
        labels: self.appliedLabels,
        note: '',
        reminder: null
      };

      dispatcher.trigger(appEvents.bookmarkAdded, self.model);
    }


  });








