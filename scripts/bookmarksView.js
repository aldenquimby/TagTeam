var BookmarksView = Backbone.View.extend({

    tagName:  "div",
    className: 'bookmarks',
    template: 'bookmarks-view',

    events: {
      "submit form": "filterResults",
      "change .filter form": "filterResults"
    },

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkAdded, function (business) {
        self.addBookmark(business);
      });
      dispatcher.on(appEvents.persistResultsReturned, function (data) {
        self.displayBookmarks(data);
      });
      dispatcher.on(appEvents.viewProfilePage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showSearchPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showHelpPage, function () {
        self.$el.hide();
      });
      dispatcher.on(appEvents.showBookmarksPage, function () {
        self.$el.show();
      });

      self.render();
    },

    render: function() {
      var self = this;
      self.$el.mustache(self.template, { }, { method:'html' });
      self.$el.find('.results').show().height(window.innerHeight-200);
      return self;
    },

    showFilterView: function (){
      var self = this;
      console.log(self.bookmarks);
      cats = _.uniq(_.flatten(_.map(self.bookmarks, function(bus){
        return _.pluck(bus.data.categories, 0);
      })));

      self.$el.find('.filter').mustache('filter-view', {
           categories: cats
      }, { method:'html' });

      self.$el.find('.filter').show();
    },

    filterResults: function () {
      var self = this;
      var sort = $('.filter form').find("select").val();
      var filtered = self.bookmarks;
      if(sort=="alphabetical"){
        filtered = _.sortBy(filtered, function(bus){ return bus.data.name; });
      }
      else if(sort=="# reviews"){
        filtered = _.sortBy(filtered, function(bus){ return -1*bus.data.review_count; });
      }
      else if(sort=="rating"){
        filtered = _.sortBy(filtered, function(bus){ return -1*bus.data.rating; });
      }
      else if(sort=="bookmarked"){
        filtered = _.sortBy(filtered, function(bus){ return allBookmarks[bus.data.id] == null;});
      }
      else{
        //leave it yo
      }
      var categoryHash = {};
      $('.filter form').find('.category-check').each(function (){
        if($(this).is(':checked')){
          categoryHash[$(this).val()] = true;
        }
      });

      var filterTerm = self.$el.find('#bookmark-query').val();
      filtered = _.filter(filtered, function (bus){
        var values = _.flatten(_.values(bus.data));
        return _.any(values, function (val){
          if(typeof val == 'string'){
            return val.indexOf(filterTerm!=-1);
          }
          return false;
        });
      });

      filtered = _.filter(filtered, function (bus){
        return _.any(bus.data.categories, function (cat){
          return categoryHash[cat[0]];
        });
      });


      self.$el.find('.results').html('');
      _.each(filtered, function(result){
        self.$el.find('.results').append(new BookmarkCardView({model:result}).el);
      });
    },

    displayBookmarks: function (data) {
      var self = this;
      self.bookmarks = data;
      self.$el.find('.results').html('');
      _.each(data, function(persistItem){
        self.$el.find('.results').append(new BookmarkCardView({model:persistItem.data}).el);
      });
      if (data.length > 0) {
        self.$el.find('.results').show();
        self.showFilterView();
      }
    },

    addBookmark: function(business) {
      var self = this;
      persistApi.set(business.id, business);
      self.$el.find('.results').append(new BookmarkCardView({model:business}).el);
    }

});