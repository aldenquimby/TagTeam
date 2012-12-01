
function YelpApi(onApiError) {

    // private members

    var auth = {
        consumerKey: "vUUxfoVd8JucIOiSrx7QMQ",
        consumerSecret: "2Asg9ACoJ2GbpSKBx00ZGVaumHQ",
        accessToken: "fuLqILJMeG8GQBjy6I83Ouz1wwlXqAWs",
        accessTokenSecret: "6_e-TGq-Okm6DJEqwZP3gI7Ng50",
        serviceProvider: { 
            signatureMethod: "HMAC-SHA1"
        }        
    };

    // private methods

    var getParamMapForAuth = function(action, method) {
        var message = { 
            action: action,
            method: method,
            parameters: []
        };
        message.parameters.push(['callback', 'cb']);
        message.parameters.push(['oauth_consumer_key', auth.consumerKey]);
        message.parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        message.parameters.push(['oauth_token', auth.accessToken]);
        message.parameters.push(['oauth_signature_method', auth.serviceProvider.signatureMethod]);

        var accessor = {
            consumerSecret: auth.consumerSecret,
            tokenSecret: auth.accessTokenSecret
        };
        
        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);
        
        var parameterMap = OAuth.getParameterMap(message.parameters);
        parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

        return parameterMap;
    };

    var apiRequest = function(url, successCallback) {
        var method = 'GET';
        var paramMap = getParamMapForAuth(url, method);

        $.ajax({
            type: method,
            url: url,
            data: paramMap,
            cache: true,
            dataType: 'jsonp',
            jsonpCallback: 'cb',
            success: function(data, statusText, XMLHttpRequest) {
                successCallback(data);
            },
            error: function(data, statusText, XMLHttpRequest) {
                onApiError();
            }
        });  
    };

    // public methods

    this.search = function(successCallback, location, term, limit, offset, sort, category_filter, radius_filter) {
        var url = 'http://api.yelp.com/v2/search?location=' + encodeURIComponent(location);

        if (term) {
            url += "&term=" + encodeURIComponent(term);
        }
        if (limit) {
            url += "&limit=" + encodeURIComponent(limit);
        }
        if (offset) {
            url += "&offset=" + encodeURIComponent(offset);
        }
        if (sort) {
            url += "&sort=" + encodeURIComponent(sort);
        }
        if (category_filter) {
            url += "&category_filter=" + encodeURIComponent(category_filter);
        }
        if (radius_filter) {
            url += "&radius_filter=" + encodeURIComponent(radius_filter);
        }

        apiRequest(url, successCallback);
    };

    this.business = function(successCallback, businessId) {
        var url = 'http://api.yelp.com/v2/business/' + businessId;

        apiRequest(url, successCallback);
    };

}
