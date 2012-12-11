var SearchResultView = BookmarkHelperView.extend({

    tagName:  "div",
    className: 'result',
    template: 'result-card',
    events: {
      "click .result-name a": "showProfilePage",
      "click .result-image-wrapper": "showProfilePage",
      "mouseenter": "triggerToolTip",
      'mouseleave': 'untriggerToolTip',
      "click .dismiss": "removeReminder"
    },

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
       var cats = [];
      _.each(self.model.categories, function(cat){
        cats.push(cat[0]);
      });
      self.model.fixed_cat = cats.join(', ');
      self.render();
      self.setupBookmark();
    },
    triggerToolTip: function (){
      this.$el.find('.result-image-wrapper').tooltip('show');
    },
    
    untriggerToolTip: function (){
      this.$el.find('.result-image-wrapper').tooltip('hide');
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      self.delegateEvents();
      if(self.model.bookmark && self.model.bookmark.remindnow) {
          self.$el.addClass('remindnow');
          self.$el.find('.result-image-wrapper').tooltip({placement: 'bottom', title: 'remember to visit!', trigger: 'manual'});
      }
      else {
          self.$el.removeClass('remindnow');  
          self.$el.find('.result-image-wrapper').tooltip('destroy');      
      }
      return self;
    },

    showProfilePage: function () {
      var self = this;
      dispatcher.trigger(appEvents.viewProfilePage, self.model);
    },

    removeReminder: function (){
      var self = this;
      self.model.bookmark.remindnow = false;
      delete self.model.bookmark.reminder;
      delete self.model.bookmark.remindernote;
      dispatcher.trigger(appEvents.bookmarkUpdated, self.model);
      alert("succesfully removed!");
    }

});

