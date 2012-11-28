function getParamMapForAuth(message) {
    var auth = { 
        consumerKey: "vUUxfoVd8JucIOiSrx7QMQ",
        consumerSecret: "2Asg9ACoJ2GbpSKBx00ZGVaumHQ",
        accessToken: "fuLqILJMeG8GQBjy6I83Ouz1wwlXqAWs",
        accessTokenSecret: "6_e-TGq-Okm6DJEqwZP3gI7Ng50",
        serviceProvider: { 
            signatureMethod: "HMAC-SHA1"
        }
    };

    parameters = [];
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', auth.serviceProvider.signatureMethod]);

    message.parameters = parameters;

    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };
    
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

    return parameterMap;
}
