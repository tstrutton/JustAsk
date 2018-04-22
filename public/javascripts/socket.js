//make conection from front end to server
var socket = io.connect('http://localhost:4000');
var handle = document.querySelector('#handle');
var message = document.querySelector('#message');
var btn = document.querySelector('#send');
var studentOutput = document.querySelector('#studentoutput');
var today = new Date();
var time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
var empty = document.querySelector('#empty');

//emit events
btn.addEventListener('click', function(){
	if(message.value === ''){
		// console.log('please put something');
		empty.classList.remove('hidden');
		setTimeout(function() {
			empty.classList.add('hidden');
		}, (3.5 * 1000));
	}else{
		socket.emit('chat', {
			message:message.value,
			handle: handle.value,
			time:time
		});
	}

}, false);

//'selected'

var questionCons = document.querySelectorAll('.question-con');

for (var i = 0; i < questionCons.length; i++) {
	questionCons[i].addEventListener('click', function(e){
		e.currentTarget.classList.toggle('selected');
	});
}


var logo = document.querySelector('#logo');
var logoutbtn = document.querySelector('#logoutbtn');

function mediaQueries(){
	if(window.innerWidth >=1440){
		logo.src = 'images/logo.svg';
		logoutbtn.innerHTML = 'Logout';
	}
}

mediaQueries();
