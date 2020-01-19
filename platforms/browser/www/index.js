function xhr_call(url, post_data, callback, post_format) 
{

var resp = [{"id":"1","name":"General","type":"Expense","description":"Household Expense","access":"Enabled"},{"id":"2","name":"Telecom","type":"Expense","description":"Telecom Related Expense","access":"Enabled"},{"id":"3","name":"IT Services","type":"Expense","description":"IT Consulting & Development Expense","access":"Enabled"},{"id":"4","name":"Insurance","type":"Expense","description":"Insurance Payments","access":"Enabled"},{"id":"5","name":"Fuel","type":"Expense","description":"Fuel Purchases","access":"Enabled"},{"id":"6","name":"Car Maintenance","type":"Expense","description":"Vehicle Maintenance Expense","access":"Enabled"},{"id":"7","name":"Rent","type":"Expense","description":"Rent, Power, Hydro Expenses","access":"Enabled"},{"id":"8","name":"Entertainment","type":"Expense","description":"Entertainment Expenses","access":"Enabled"},{"id":"9","name":"Donations","type":"Expense","description":"Charitable Donations","access":"Enabled"},{"id":"10","name":"Misc Expense","type":"Expense","description":"Misc Expenses","access":"Enabled"}];
	callback(resp);
			
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

const dbName = "indexedDb1";
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


