
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

    this.set = function(id, data) {
        window.localStorage.setItem(id, JSON.stringify(data));
    };
    
    this.get = function(callback) {
        var data = [];
        for (var i = 0; i < localStorage.length; i++) {
            data.push({
                id: localStorage.key(i), 
                data: JSON.parse(localStorage.getItem(localStorage.key(i)))
            });
        }
        callback(data);
    }; 

    this.remove = function(id) {
        window.localStorage.removeItem(id);
    }; 

} 
