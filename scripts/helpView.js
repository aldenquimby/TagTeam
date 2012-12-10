var HelpView = Backbone.View.extend({

    tagName:  "div",
    className: 'help-page',
    template: 'help-page',

    events: {
      "click #redo-tutorial": "redoTutorial",
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.viewProfilePage, function (){
        self.$el.hide();
      });
      dispatcher.on(appEvents.showBookmarksPage, function (){
        self.$el.hide();
      });
      dispatcher.on(appEvents.showSearchPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showHelpPage, function (){
        self.$el.show();
      });

      self.render();
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, { }, { method:'html' });
      self.$el.find('.row-fluid').height(window.innerHeight-190);
      return self;
    },

    redoTutorial: function() {
      // go to search page and start tutorial
      dispatcher.trigger(appEvents.showSearchPage);
      tutorial.kickoff();
    }

});
