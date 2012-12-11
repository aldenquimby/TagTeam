var BookmarkCardView = BookmarkHelperView.extend({

    tagName:  "div",
    className: 'bookmark',
    template: 'result-card',

    events: {
      "click .result-name a": "showProfilePage",
      "click .result-image-wrapper": "showProfilePage",
      "mouseenter": "triggerToolTip",
      'mouseleave': 'untriggerToolTip'
    },

    triggerToolTip: function (){
      this.$el.find('.result-image-wrapper').tooltip('show');
    },

    untriggerToolTip: function (){
      this.$el.find('.result-image-wrapper').tooltip('hide');
    },
    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkUpdated, function (business) {
        if (business.id == self.model.id) {
          self.updated(business);
        }
      });

      self.render();

      self.setupBookmark();
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, self.model, { method:'html' });
      self.delegateEvents();
      if(self.model.remindnow) {
          self.$el.addClass('remindnow');
          self.$el.find('.result-image-wrapper').tooltip({placement: 'bottom', title: 'remember to visit!', trigger: 'manual'});
      }
      else {
          self.$el.removeClass('remindnow');  
          self.$el.find('.result-image-wrapper').tooltip('destroy');      
      }
      return self;
    },

    updated: function(business) {
      var self = this;
      self.model = business;
      if (self.model.bookmark) {
        persistApi.set(self.model.id, self.model);        
      }
      else {
        persistApi.remove(self.model.id);
        self.$el.remove();
      }
      self.render();
    },

    showProfilePage: function () {
      var self = this;
      dispatcher.trigger(appEvents.viewProfilePage, self.model);
    }

});
