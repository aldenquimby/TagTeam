var BookmarkHelperView = Backbone.View.extend({

    appliedTags: [],

    setupBookmark: function() {
      var self = this;

      var modal = $('#modal-bookmark-' + self.model.id);
      var typeaheadInput = modal.find('.bookmark-add-tag');
      var startDatepicker = $('#bookmark-reminder-start-' + self.model.id);
      var endDatepicker = $('#bookmark-reminder-end-' + self.model.id);

      startDatepicker.datepicker('remove');
      endDatepicker.datepicker('remove');
      
      modal.remove();
      $('body').mustache('bookmark-modal', self.model);

	    modal = $('#modal-bookmark-' + self.model.id);
      typeaheadInput = modal.find('.bookmark-add-tag');
      startDatepicker = $('#bookmark-reminder-start-' + self.model.id);
      endDatepicker = $('#bookmark-reminder-end-' + self.model.id);
      var appliedTagsWrapper = modal.find('.applied-tags');

      self.appliedTags = (self.model.bookmark || {}).tags || [];

      modal.find('.bookmark-remove-tag').live('click', function(e) {
        var tag = $(e.currentTarget).data('tag');
        self.appliedTags = _.without(self.appliedTags, tag);
        $(e.currentTarget).parent().remove();
      });

      var applyTag = function(tag) {
          self.appliedTags.push(tag);
          appliedTagsWrapper.mustache('bookmark-tags', {bookmark:{tags:self.appliedTags}}, {method:'html'});
      };

      typeaheadInput.typeahead({
        source: function(a, b) {
          var tmp = [];
          _.each(allBookmarks, function(bkmrk) {
              _.each(bkmrk.tags, function(label) {
                  tmp.push(label);
              });
          });
          return _.uniq(_.difference(_.union(tmp, appDefaults.tags), self.appliedTags));
        },
        items: 5,
        minLength: 0,
        updater: function(item) {
          applyTag(item);
          return '';
        },
        highlighter: function(item) {
            return '<span>' + item + '</span>';
        }
      }); 

      typeaheadInput.on('focus', typeaheadInput.typeahead.bind(typeaheadInput, 'lookup'));

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

      var currentStart = startDatepicker.val();

      if (currentStart != '') {
        endDatepicker.removeAttr('disabled');
      }

      var startD = moment().subtract('days', 2);

      endDatepicker.datepicker({
        autoclose: true,
        startDate: currentStart,
        todayHighlight: false
      });

      startDatepicker.datepicker({
        autoclose: true,
        startDate: startD._d
      }).on('changeDate', function(ev) {
        endDatepicker.removeAttr('disabled');
        endDatepicker.datepicker('setStartDate', ev.date);
        endDatepicker.val(startDatepicker.val());
        endDatepicker.datepicker('update');
        endDatepicker.val('');
      });

      $('#bookmark-submit-' + self.model.id).click(function(e) {
      	e.stopPropagation();
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

        return false;
      });

      $('#bookmark-delete-' + self.model.id).click(function(e) {
      	e.stopPropagation();
        if (confirm('Are you sure you want to delete this bookmark?')) {
          modal.modal('hide');
          delete self.model.bookmark;
          dispatcher.trigger(appEvents.bookmarkUpdated, self.model);
        }
      });
    }
});