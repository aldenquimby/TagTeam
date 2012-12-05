var TabView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "div",

    className: 'tab',
    // Cache the template function for a single item.
    //TODO: set template shit up
    template: 'tab-card',
    // The DOM events specific to an item.
    events: {
      "click": "showStuff"
    },

    search: false,

    bookmark: false,

    help: false,

    businessId: 0,

    name: '',
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(place, s, b, h) {
      if(s){
        this.search = true;
        this.name = 'Search';
      }
      else if(b){
        this.bookmark = true;
        this.name = 'My Bookmarks';
      }
      else if(h){
        this.help = true;
        this.name = 'Help';
        this.$el.addClass('helpTab');
      }
      else{
        console.log("hey");
        console.log(place);
        businessId = place.id;
        this.name = place.name;
        this.attributes= {'data-id': businessId};
      }


      //maybe i can keep the destroy? if we remove the object we should remove the tab for it i guess...
      this.render();
    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.$el.mustache(self.template, {
          name: self.name 
      }, { method:'html' });
      return self;
    },

    showStuff: function () {
      if(this.search){
        //show the search view


      }
      else if(this.bookmark){
        //show the bookmarks view


      }
      else if(this.help){
        //show help stuff
      }
      else{
        //it's a business, show the profile view
      }




    }

  });








