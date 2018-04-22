var message = document.querySelector('#message');
var btn = document.querySelector('#send');
var studentOutput = document.querySelector('#studentoutput');
var unavailablealert = document.querySelector('#unavailable');
var fullbin = document.querySelector('#fullbin');

socket.on('chat',function(data){
	studentOutput.innerHTML += '<div class="question-con"><div class="question-bubble"><p class="question">'+data.message+'</p><div class="question-info"><p class="time">'+data.time+'</p></div></div></div>';
	message.value = "";
});

socket.on('bin', function(questions){
	console.log(questions.length);
	if(questions.length === 5){
		console.log('stop!');
		fullbin.style.display = 'flex';
		message.setAttribute("disabled", "disabled");
		btn.setAttribute("disabled", "disabled");
	}
});

socket.on('activate', function(activate){
	if(activate != true){
		unavailablealert.style.display = 'flex';
		message.setAttribute("disabled", "disabled");
		btn.setAttribute("disabled", "disabled");
	}else{
		unavailablealert.style.display = 'none';
		message.removeAttribute("disabled", "disabled");
		btn.removeAttribute("disabled", "disabled");
	}
});

socket.on('clearthebin', function(){

	studentOutput.innerHTML += '<div id="binCleared"><p>Bin Was Cleared</p></div>';
	fullbin.style.display = 'none';
	message.removeAttribute("disabled", "disabled");
	btn.removeAttribute("disabled", "disabled");

});


window.addEventListener('load', function(){
	//emit what is in the bin
	socket.emit('refreshed');

	socket.on('refill', function(questions){
		//answered does not get sent to this, so nothing will be checked even if was before the refresh
		for (var i = 0; i < questions.length; i++) {
			studentOutput.innerHTML += '<div class="question-con"><div class="question-bubble"><p class="question">'+questions[i].question+'</p><div class="question-info"><p class="time">'+questions[i].date+'</p></div></div></div>';
		}
	});
});