/**Prof specific things**/
var socket = io.connect('http://localhost:4000');

var clearbin = document.querySelector('#clearbin');
var bin = document.querySelector('#bin');
// var activatebtn = document.querySelector('#activate');
var profOutput = document.querySelector('#profoutput');
var wait = document.querySelector('#wait');
var num = -1;
var confirmclearbtns = document.querySelector('#clearbuttons');
var confirmactivatebtns = document.querySelector('#activatebuttons');

var activateActive = document.querySelector('#activateActive');
var activate = document.querySelector('#activate');

var logout = document.querySelector('#logout');

socket.on('chat',function(data){
	num = num+1;
	profOutput.innerHTML += '<div class="question-con"><div class="question-bubble"><p class="question">'+data.message+'</p><div class="question-info"><p class="time">'+data.time+'</p><label class="answercon" for="'+num+'"><p>Answered</p><input type="checkbox" id="'+num+'" class="answered"><span class="checkmark"></span></label><p class="sender" id="'+num+'">Sender</p></div></div></div>';
	senders(data);
	answered();
});

var confirmclear = document.querySelector('#confirm-clearbin');
clearbin.addEventListener('click', function(){
	confirmclear.style.display = 'flex';
});

confirmclearbtns.addEventListener('click', function(e){
	// console.log(e.target.id);
	if (e.target.id === 'c-cancel') {
		confirmclear.style.display = 'none';
	  } else if (e.target.id === 'c-continue') {
	    socket.emit('clearthebinreq');
	    confirmclear.style.display = 'none';
	  } else {
	    console.log('oops');
	  }
});

socket.on('bin', function(questions){
	bin.innerHTML = questions.length;
});

socket.on('clearthebin', function(){
	profOutput.innerHTML += '<div id="binCleared"><p>Bin Was Cleared</p></div>';
	bin.innerHTML = 0;
});

var confirmactivate = document.querySelector('#confirm-activate');

	activate.addEventListener('click', function(){
		// console.log('activate clicked');
	// confirmactivate.classList.remove('hidden');
	confirmactivate.style.display = 'flex';

});

confirmactivatebtns.addEventListener('click', function(e){
	// console.log(e.target.id);
	if (e.target.id === 'a-cancel') {
		confirmactivate.style.display = 'none';;
	  } else if(e.target.id === 'a-continue'){
	    socket.emit('activatereq');
	    confirmactivate.style.display = 'none';

	    if(activateActive.style.width != '24px'){
			activateActive.style.width = '24px';
			activateActive.style.height = '24px';
		}else{
			activateActive.style.width = '0';
			activateActive.style.height = '0';
		}
	  }else{
	  	console.log('activate oops');
	  }
});

function senders (data){
	var sender = document.querySelectorAll('.sender');
	//console.log(data);
	for (var i = 0; i < sender.length; i++) {
		sender[i].addEventListener('click', function(){
			if(this.innerHTML != 'Sender'){
				this.innerHTML = 'Sender';
			}else{
				//this will be where user's username is dynamically added
				this.innerHTML = data.handle;
			}
		});
	}
}

function answered(){
	//console.log('answered');
	var answered = document.querySelectorAll('.answered');
	for (var i = 0; i < answered.length; i++) {
		answered[i].addEventListener('click', function(){
			if(this.checked != false){
				socket.emit('changeanswer', {
					id:this.id,
					answered:true
				});
			}
		});
	}
}

socket.on('activate', function(activate){
	if(activate != true){
		activateActive.style.width = '0';
		activateActive.style.height = '0';

	}else{
		activateActive.style.width = '24px';
		activateActive.style.height = '24px';
	}
});

window.addEventListener('load', function(){
	//emit what is in the bin
	socket.emit('refreshed');

	socket.on('refill', function(questions){
		// console.log(questions);
		bin.innerHTML = questions.length;
		for (var i = 0; i < questions.length; i++) {
			profOutput.innerHTML += '<div class="question-con"><div class="question-bubble"><p class="question">'+questions[i].question+'</p><div class="question-info"><p class="time">'+questions[i].date+'</p><label class="answercon" for="'+i+'"><p>Answered</p><input type="checkbox" id="'+i+'" class="answered"><span class="checkmark"></span></label><p class="sender" id="'+i+'">Sender</p></div></div></div>';
		}
	});
});

//disabling chat and clearing bin if prof logs out
logout.addEventListener('click', function(){
	socket.emit('clearthebinreq');
	socket.emit('activatereq');
});
