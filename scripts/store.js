
function storeData(onError){
    this.set = function(id, data) {
      this.remove(id);
      $.ajax( { url: "https://api.mongolab.com/api/1/databases/tagteam/collections/business?apiKey=50678d1fe4b0c0cda3668e9b",
         data: JSON.stringify( {
		"id" : id,
		"data" : JSON.stringify(data)
		} ),
         type: "POST",
         contentType: "application/json",
	 error: function (xhr, status, err) {onError(); } } );
    };
    
    this.get = function(callback) {
      $.ajax( { url: "https://api.mongolab.com/api/1/databases/tagteam/collections/business/?apiKey=50678d1fe4b0c0cda3668e9b",
          type: "GET",
          async: true,
          success: function (data) { 
	      callback(data);
	  },
	  error: function (xhr, status, err) {onError(); }});
    }; 

    this.remove = function(id) {

      var component = {"id": id};
      var pageUrl = 'https://api.mongolab.com/api/1/databases/tagteam/collections/business/?q=' +JSON.stringify(component) +'&apiKey=50678d1fe4b0c0cda3668e9b';

      $.ajax( { url: pageUrl,
          type: "GET",
          async: true,
          success: function (data) { 
              $.ajax( { url: "https://api.mongolab.com/api/1/databases/tagteam/collections/business/" + data[0]._id.$oid + "?apiKey=50678d1fe4b0c0cda3668e9b",
                type: "DELETE",
                async: true,
                timeout: 300000,
                success: function (data) { },
                error: function (xhr, status, err) {onError(); } } );
    	     }});
    }; 
} 
