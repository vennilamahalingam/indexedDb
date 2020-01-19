function xhr_call(url, post_data, callback, post_format) {
	var xhr_type = (post_data == "" ? "GET" : "POST");

	var xhr	= new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open(xhr_type, url, true);

	switch(post_format) {
		case "urlencoded":
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		break;
		case "multipart":
		// header must only be set by HTML form element; automatic, standard behavior
		break;
		case "text/plain":
		default:
		xhr.setRequestHeader("Content-Type", "text/plain");
		break;
	}

	xhr.responseType = "text";
	xhr.setRequestHeader("X-Auth", "424237be0ecd48ab8796a8d1912455644752834ef3ba467ebd7bb1022b25eff0");
	
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (typeof callback === "function") {
				callback(JSON.parse(this.responseText));
			}
		}
	}

	xhr.send(post_data);
}
function createEntry(obj) 
{
   var obj = {};
   obj.id = document.getElementById("id").value;
   obj.name = document.getElementById("name").value;
   obj.type = document.getElementById("type").value;
   obj.description = document.getElementById("description").value;
   
   var request = db.transaction("bill_category", "readwrite").objectStore("bill_category").add(obj);
   
   request.onsuccess = function(event) {
      alert("done");
	  retrieveAll();
   };
   
   request.onerror = function(event) {
      alert("error");
   }
}
function retrieveAll() {
   var objectStore = db.transaction("bill_category").objectStore("bill_category");
   document.getElementById("container").innerHTML = "";
   
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) 
	  {
			document.getElementById("container").append("Id: "+cursor.value.id+" Name: " + cursor.value.name + ", Type:" + cursor.value.type + ", Description: " + cursor.value.description);
			document.getElementById("container").appendChild(document.createElement("br"));
			cursor.continue();
      } 
	  
   };
}
function deleteEntry() 
{
   var id = document.getElementById("delete_inp").value;
   var request = db.transaction(["bill_category"], "readwrite").objectStore("bill_category").delete(id);
   
   request.onsuccess = function(event) 
   {
      alert("deletion done id:"+id);
	  retrieveAll();
   };
   request.onerror = function(event) {
      alert("error");
   }
}

const dbName = "indexedDb";
var db, response;

xhr_call("http://sftp.boyal.us:8080/api/?name=bill_category&action=list&offset=0&limit=10","",function(response)
{
	response = response;
	var request = window.indexedDB.open(dbName, 6);
		
	request.onerror = function(event) 
	{
		console.log("some error occured");
	};
	 request.onsuccess = function(event)
	 {
		db = request.result;
		console.log("success: "+ db);
	 };

	request.onupgradeneeded = function(event) 
	{
	  db = event.target.result;
	  var objectStore = db.createObjectStore("bill_category", { keyPath: "id" }); //keypath is the unique id

	  //oncomplete - when db has been created.
	  objectStore.transaction.oncomplete = function(event) 
	  {
		var billObjectStore = db.transaction("bill_category", "readwrite").objectStore("bill_category");
		response.forEach(function(billCategoryEl) 
			{
				billObjectStore.add(billCategoryEl);
				console.log("writing");
			});
	  };
	};
});


