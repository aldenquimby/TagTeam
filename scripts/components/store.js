
function StoreData(onError) {
    
    var _apiKey = '50678d1fe4b0c0cda3668e9b';

    this.set = function(id, data) {
        
        // remove any existing data
        this.remove(id);
        
        $.ajax({
            url: "https://api.mongolab.com/api/1/databases/tagteam/collections/business?apiKey=" + _apiKey,
            data: JSON.stringify({
		            "id" : id,
		            "data" : JSON.stringify(data)
		        }),
            type: "POST",
            contentType: "application/json",
            error: function (xhr, status, err) {
                onError(); 
            }
        });
    };
    
    this.get = function(callback) {
        
        $.ajax({
            url: "https://api.mongolab.com/api/1/databases/tagteam/collections/business/?apiKey=" + _apiKey,
            type: "GET",
            async: true,
            success: function (fromDb) { 
                var d = [];
                for (var i = 0; i < fromDb.length; i++) {
                    d.push({
                        id: fromDb[i].id, 
                        data: JSON.parse(fromDb[i].data)
                    });
                }
                callback(d);
            },
	          error: function (xhr, status, err) {
                onError(); 
            }
        });

    }; 

    this.remove = function(id) {

        $.ajax({ 
            url: 'https://api.mongolab.com/api/1/databases/tagteam/collections/business/?q=' +JSON.stringify({"id": id}) +'&apiKey=' + _apiKey,
            type: "GET",
            async: true,
            success: function (data) { 

                $.ajax({
                    url: "https://api.mongolab.com/api/1/databases/tagteam/collections/business/" + data[0]._id.$oid + "?apiKey=" + _apiKey,
                    type: "DELETE",
                    async: true,
                    timeout: 300000,
                    error: function (xhr, status, err) {
                        onError(); 
                    }
                });

      	    },
            error: function (xhr, status, err) {
                onError();
            }
        });

    }; 
} 

function StoreDataDebug(onError) {

    var _prefix = "tagteam-";
    var _tutorialKey = "tutorial";

    this.set = function(id, data) {
        window.localStorage.setItem(_prefix + id, JSON.stringify(data));
    };
    
    this.get = function(callback) {
        var data = [];
        for (var i = 0; i < localStorage.length; i++) {
            var wrappedId = localStorage.key(i);
            if (wrappedId.indexOf(_prefix) != -1) {
                var actualId = wrappedId.split(_prefix)[1];
                data.push({
                    id: actualId, 
                    data: JSON.parse(localStorage.getItem(wrappedId))
                });
            } 
        }
        callback(data);
    }; 

    this.remove = function(id) {
        window.localStorage.removeItem(_prefix + id);
    }; 

    this.setTutorial = function(saw) {
        window.localStorage.setItem(_tutorialKey, saw);
    };

    this.sawTutorial = function() {
        return window.localStorage.getItem(_tutorialKey);
    };

} 
