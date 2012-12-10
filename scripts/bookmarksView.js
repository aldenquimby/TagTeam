var BookmarksView = Backbone.View.extend({

    tagName:  "div",
    className: 'bookmarks',
    template: 'bookmarks-view',

    events: {
      "submit form": "filterResults",
      "keyup #bookmark-query": "filterResults2",
      "change .filter form": "filterResults"
    },

    renderedModals: false,

    initialize: function() {
      var self = this;

      dispatcher.on(appEvents.bookmarkAdded, function (business) {
        self.addBookmark(business);
      });
      dispatcher.on(appEvents.bookmarkUpdated, function (updatedBook){
        var oldBook = null;
        if(updatedBook.bookmark) {
          _.each(self.bookmarkViews, function (view) {
            if(view.model.id==updatedBook.id){
              view.model = updatedBook;
            }
          });
        }

        else {
          self.bookmarkViews = _.map(self.bookmarkViews, function (view){
            if(view.model.id!=updatedBook.id){
              return view;
            }
          }) 
        }
        self.bookmarkViews = _.compact(self.bookmarkViews);
        //#thug
        var data = _.map(self.bookmarkViews, function (view){
          return {id: view.model.id, data: view.model };
        })
        self.displayBookmarks(data);
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
        if (!self.renderedModals) {
          _.each(self.bookmarkViews, function(view) {
            view.setupBookmark();
          });
          self.renderedModals = true;
        }
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
      var models = _.map(self.bookmarkViews, function (view){
        return view.model;
      })
      cats = _.uniq(_.flatten(_.map(models, function(bus){
        return _.pluck(bus.categories, 0);
      })));

      self.$el.find('.filter').mustache('filter-view', {
           categories: cats
      }, { method:'html' });

      self.$el.find('.filter').show();
    },

    filterResults2: function(e) {
      e.stopPropagation();
      var self = this;

      var filtered = self.bookmarkViews;
      var filterTerm = $(e.currentTarget).val();

      filtered = _.filter(filtered, function (bus) {
        var props = [];
        _.each(bus.model.categories, function(c) { props.push(c[0]); });
        props.push(bus.model.name);
        props.push(bus.model.location.cross_streets);
        props = _.union(props, bus.model.location.neighborhoods, bus.model.bookmark.tags);

        return _.any(props, function (val) {
          return val.toLowerCase().indexOf(filterTerm.toLowerCase())!=-1;
        });
      });

      _.each(self.bookmarkViews, function (view){
        view.$el.remove();
      });
      _.each(filtered, function(view){
        self.$el.find('.results').append(view.render().el);
      });

      return false;
    },

    filterResults: function (e) {
      e.stopPropagation();
      var self = this;
      var sort = $('.filter form').find("select").val();
      var filtered = self.bookmarkViews;
      if(sort=="alphabetical"){
        filtered = _.sortBy(filtered, function(bus){ return bus.model.name; });
      }
      else if(sort=="# reviews"){
        filtered = _.sortBy(filtered, function(bus){ return -1*bus.model.review_count; });
      }
      else if(sort=="rating"){
        filtered = _.sortBy(filtered, function(bus){ return -1*bus.model.rating; });
      }
      else if(sort=="bookmarked"){
        filtered = _.sortBy(filtered, function(bus){ return allBookmarks[bus.model.id] == null;});
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

      filtered = _.filter(filtered, function (bus){
        return _.any(bus.model.categories, function (cat){
          return categoryHash[cat[0]];
        });
      });

      var filterTerm = self.$el.find('#bookmark-query').val();
      filtered = _.filter(filtered, function (bus) {

        var props = [];
        _.each(bus.model.categories, function(c) { props.push(c[0]); });
        props.push(bus.model.name);
        props.push(bus.model.location.cross_streets);
        props = _.union(props, bus.model.location.neighborhoods, bus.model.bookmark.tags);

        return _.any(props, function (val) {
          return val.toLowerCase().indexOf(filterTerm.toLowerCase())!=-1;
        });
      });

      _.each(self.bookmarkViews, function (view){
        view.$el.remove();
      });
      _.each(filtered, function(view){
        self.$el.find('.results').append(view.render().el);
      });

      return false;
    },

    displayBookmarks: function (data) {
      var self = this;
      self.bookmarkViews = [];
      self.$el.find('.results').html('');
      _.each(data, function(persistItem){
        var result = persistItem.data;
        var view = new BookmarkCardView({model:result})
        self.bookmarkViews.push(view);
        self.$el.find('.results').append(view.el);
      });
      if (data.length > 0) {
        self.$el.find('.results').show();
        self.showFilterView();
      }
    },

    addBookmark: function(business) {
      var self = this;
      persistApi.set(business.id, business);
      var view = new BookmarkCardView({model:business});
      self.bookmarkViews.push(view);
      self.$el.find('.results').append(view.el);
    }

});