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

    appliedTags: [],
    allowedTags: [],

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
        template: '<div class="popover add-bookmark-popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
        title:title, content:content, html:true, trigger:'manual', placement:'bottom'
      });
    },

    setupTypeahead: function() {
      var self = this;

      var popover = self.$el.find('.popover');
      var typeaheadInput = popover.find('.typeahead');

      self.allowedTags = appDefaults.tags;
      _.each(allBookmarks, function(bkmrk) {
          _.each(bkmrk.tags, function(label) {
              self.allowedTags.push(label);
          });
      });
      self.allowedTags = _.uniq(self.allowedTags);
      self.appliedTags = [];

      typeaheadInput.typeahead({
        source: function(a, b) {
          return self.allowedTags;
        },
        items: 5,
        updater: function(item) {
          self.appliedTags.push(item);
          self.allowedTags = _.without(self.allowedTags, item);
          popover.find('.applied-tags').mustache('bookmark-tags', {bookmark:{tags:self.appliedTags}}, {method:'html'});
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
          if (self.appliedTags.indexOf(item) < 0 && item != '') {
            self.appliedTags.push(item);
            self.allowedTags = _.without(self.allowedTags, item);
            popover.find('.applied-tags').mustache('bookmark-tags', {bookmark:{tags:self.appliedTags}}, {method:'html'});
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
      self.allowedTags.push(tag);
      self.appliedTags = _.without(self.appliedTags, tag);
      $(e.currentTarget).parent().remove();
    },

    addBookmark: function() {
      var self = this;

      self.model.bookmark = { 
        tags: self.appliedTags,
        notes: '',
        reminder: null
      };

      dispatcher.trigger(appEvents.bookmarkAdded, self.model);
    }


  });








