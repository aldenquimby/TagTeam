
var dispatcher = _.clone(Backbone.Events);

var appEvents = {

	viewProfilePage: 'view-profile-page', //someone clicks on a search result
	showSearchPage: 'show-search-page', //someone clicks search tab
	showBookmarksPage: 'show-bookmarks-page', //someone clicks bookmarks tab
	showHelpPage: 'show-help-page', //someone clicks help tab

    persistResultsReturned: 'returned-persist-results', //mongo results returned succesfully
	yelpResultsReturned: 'returned-yelp-results', //yelp results returned succesfully
	apiError: 'api-error',

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
	query: 'Dive Bars',
    tags: ['check it out', 'must go back', 'stay away']
};

// search needs to know if stuff is bookmarked
// appView maintains this
var allBookmarks = {};

var yelpApi = new YelpApiDebug(function(){
    dispatcher.trigger(appEvents.apiError, 'Looks like the Yelp API might be down, please try again later.');
});

var persistApi = new StoreDataDebug(function(){
	dispatcher.trigger(appEvents.apiError, 'We are having trouble loading your bookmarks, please try again later.');
});

var tutorial = new Tutorial([{
    title:'Explore Images', 
    target:'#explore', 
    content:'Browse through your images and select one to start editing.',
    placement:'bottom'
},
{
    title:'Filter Search Results', 
    target:'#filter', 
    content:'Use these options to filter your search results.',
    placement:'left'
},
{
    title:'Draw Gestures on Image',
    target:'#canvas', 
    content:'Draw gestures here after selecting an image.',
    placement:'top'
},
{
    title:'Help and Documentation',
    target:'#help-link', 
    content:'Questions? Click here for help and documentation.',
    placement:'bottom'
}]);
