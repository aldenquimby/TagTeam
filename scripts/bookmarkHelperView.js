var BookmarkHelperView = Backbone.View.extend({

    appliedTags: [],
    allowedTags: [],

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

      modal.find('.bookmark-delete').click(function() {
        if (confirm('Are you sure you want to delete this bookmark?')) {
          modal.modal('hide');
          delete self.model.bookmark;
          dispatcher.trigger(appEvents.bookmarkUpdated, self.model);
        }
      });

      $('#bookmark-advanced-show-' + self.model.id).click(function() {
          $(this).hide();
          $('#bookmark-advanced-hide-' + self.model.id).show();
          $('#bookmark-advanced-' + self.model.id).slideDown();
      });

      $('#bookmark-advanced-hide-' + self.model.id).click(function () {
          $(this).hide();
          $('#bookmark-advanced-show-' + self.model.id).show();
          $('#bookmark-advanced-' + self.model.id).slideUp();
      });
    }

});