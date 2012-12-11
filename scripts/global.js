
var dispatcher = _.clone(Backbone.Events);

var appEvents = {

	viewProfilePage: 'view-profile-page', //someone clicks on a search result
	showSearchPage: 'show-search-page', //someone clicks search tab
	showBookmarksPage: 'show-bookmarks-page', //someone clicks bookmarks tab
	showHelpPage: 'show-help-page', //someone clicks help tab

    persistResultsReturned: 'returned-persist-results', //mongo results returned succesfully
	yelpResultsReturned: 'returned-yelp-results', //yelp results returned succesfully
	apiError: 'api-error',
    searchError: 'search-error',

	search: 'yelp-search', //someone searches (we could show loading gif)
	bookmarkPopOver: 'bookmark-bringup-popover', //someone should be shown the popover
    bookmarkAdded: 'bookmark-added', //someone bookmarks something
	bookmarkUpdated: 'bookmark-updated', //someone changed a bookmark
	closeTab: 'close-tab', //someone closes a tab (maybe remove the detailed object)

    tabSelected: 'tab-selected', //to all them tabs no bout that shit
    tabClosed: 'tab-closed' //to all them tabs no bout that shit
};

var appDefaults = {
	location: 'New York',
	query: 'dive bars',
    tags: ['check it out', 'must go back', 'stay away', 'group hangout']
};

// search needs to know if stuff is bookmarked
// appView maintains this
var allBookmarks = {};

var yelpApi = new YelpApi(function(){
    dispatcher.trigger(appEvents.apiError, 'Looks like the Yelp API might be down, please try again later.');
});

var persistApi = new StoreDataDebug(function(){
	dispatcher.trigger(appEvents.apiError, 'We are having trouble loading your bookmarks, please try again later.');
});

var tagTeamTutorial = new Tutorial([
    {
        title:'Search for Places', 
        target:'#search-query', 
        content:"Enter a keyword, like 'dive bar' to find great places near you.",
        placement:'bottom',
        transistionNextCallback: function() {
            if ($('.search .result').length == 0) {
                $('#search-query').val(appDefaults.query);
                $('#search-submit').click();
            }
        }
    },
    {
        title:'Browse Search Results', 
        target:'#search-results-span', 
        content:'View search results here.',
        placement:'left'
    },
    {
        title:'Advanced Searching',
        target:'#search-filter', 
        content:'After searching, sort and filter the search results here.',
        placement:'left'
    },
    {
        title:'Business Profile',
        target:'.search .result-name', 
        content:'View more detailed info about a business by clicking the name.',
        placement:'bottom',
        transistionNextCallback: function() {
            $($('.search .result-name')[0]).find('a').click();
        }
    },
    {
        title:'Business Profile',
        target:'.profile .prof-details', 
        content:'Read reviews, locate the business on a map and more.',
        placement:'left'
    },
    {
        title:'Bookmark',
        target:'.profile .edit-bookmark .book', 
        content:'Bookmark this place for later by clicking here.',
        placement:'bottom'
    },
    {
        title:'My Bookmarks',
        target:'.tab.bookmarkTab', 
        content:'Browse your existing bookmarks here.',
        placement:'right'
    },
    {
        title:'Help and Documentation',
        target:'.tab.helpTab', 
        content:'Questions? Click here for help and documentation.',
        placement:'top'
    }
]);
