function onYelpApiError() {
    $('#alertContainer').mustache('alert', {
        type:'error', 
        message: 'Looks like the Yelp API might be down, please try again later.'
    }, { method:'html' });
};

var dispatcher = _.clone(Backbone.Events);  //

var yelpApi = new YelpApiDebug(onYelpApiError);

var appEvents = {
	viewProfilePage: 'view-profile-page', //someone clicks on a search result
	search: 'yelp-search', //someone searches (we could show loading gif)
	bookmarkPopOver: 'bookmark-bringup-popover', //someone should be shown the popover
	bookMarkPlace: 'bookmark-finished-popup', //someone bookmarks something 
	closeTab: 'close-tab', //someone closes a tab (maybe remove the detailed object)
	yelpResultsReturned: 'returned-yelp-results', //yelp results returned succesfully
	errorYelpApi: 'yelp-api-error', //error with yelp api
	//etc....
}

