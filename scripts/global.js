function onYelpApiError() {
    $('#alertContainer').mustache('alert', {
        type:'error', 
        message: 'Looks like the Yelp API might be down, please try again later.'
    }, { method:'html' });
};

var dispatcher = _.clone(Backbone.Events);

var yelpApi = new YelpApiDebug(onYelpApiError);
var persistApi = new StoreDataDebug(onYelpApiError);

var appEvents = {

	viewProfilePage: 'view-profile-page', //someone clicks on a search result
	showSearchPage: 'show-search-page', //someone clicks search tab
	showBookmarksPage: 'show-bookmarks-page', //someone clicks bookmarks tab

	yelpResultsReturned: 'returned-yelp-results', //yelp results returned succesfully
	errorYelpApi: 'yelp-api-error', //error with yelp api
	persistResultsReturned: 'returned-persist-results', //mongo results returned succesfully
	errorPersistApi: 'persist-api-error', //error with mongo api

	search: 'yelp-search', //someone searches (we could show loading gif)
	bookmarkPopOver: 'bookmark-bringup-popover', //someone should be shown the popover
	bookMarkPlaceFinish: 'bookmark-finished-popup', //someone bookmarks something
	closeTab: 'close-tab', //someone closes a tab (maybe remove the detailed object)

}

var appDefaults = {
	location: 'New York',
	query: 'Dive Bars'
}

