//need for other containers in the base.ejs view if you are to also display details content
var resultRequest;

function showResults() {
	resultRequest = createRequest();
	var url = '/api/questions/';
	resultRequest.onreadystatechange = respRequest;
	resultRequest.open("GET", url, true);
	resultRequest.send(null);

	function respRequest() {
		if(resultRequest.readyState === 4 || resultRequest.readyState === "complete") {
			console.log(resultRequest.responseText);
		}
	}
}

function createRequest() {
var request;

try {
request = new XMLHttpRequest();
} catch(e) {
try {
request = new ActiveXObject("Msxml2.XMLHTTP");
} catch(e) {
try {
request = new ActiveXObject("Microsoft.XMLHTTP");
} 	catch(e) {
request = null;
}
}
}
return request;
}

/*second ajax call*/

function showDetails(e) {
	//console.log(e.currentTarget.id);
	var id=e.currentTarget.id;
	resultRequest = createRequest();
	var url = '/students/'+ id;
	//console.log(url);
	resultRequest.onreadystatechange = respRequest2;
	resultRequest.open("GET", url, true);
	resultRequest.send(null);

	function respRequest2() {
		//console.log('respRequest');
		//console.log(resultRequest.readyState);
		if(resultRequest.readyState === 4 || resultRequest.readyState === "complete") {
			//console.log('readystate = 4');
			//console.log(resultRequest.responseText);
			result.innerHTML = "";
			var jsonfile = JSON.parse(resultRequest.responseText);
			console.log(jsonfile);
			//for(var i =0; i< jsonfile.length; i++) {
				//result.innerHTML += '<img src="images/'+jsonfile.photo+'">'+jsonfile.job+' '+jsonfile.email;

			//}
		}
	}
}

function createRequest() {
var request;

try {
request = new XMLHttpRequest();
} catch(e) {
try {
request = new ActiveXObject("Msxml2.XMLHTTP");
} catch(e) {
try {
request = new ActiveXObject("Microsoft.XMLHTTP");
} 	catch(e) {
request = null;
}
}
}
return request;
}


link.addEventListener('click', showResults, false);


