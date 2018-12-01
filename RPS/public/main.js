var socket = io();
var opponentMoved = false;
var oppMove;

socket.on('connectToRoom',function(data) {
	$('#room-number').text(data);
});

socket.on('playMove', function(data){
	$('#rock-button').prop('disabled', true);
	$('#paper-button').prop('disabled', true);
	$('#scissors-button').prop('disabled', true);

	$('#client-output').text("You chose " + data.move + "... Waiting for opponent...");

	if(opponentMoved){
		socket.emit("compareMoves", {
			myMove: data.move,
			opponentMove: oppMove
		});
		console.log(data.move);
		console.log(oppMove);
	}
})

socket.on("opponentMoved", (data)=>{
	oppMove = data;
	opponentMoved = true;

	socket.emit("")
})

socket.on("setPlayerOne", ()=>{
	socket.emit("setPlayer", 1);
})

socket.on("outputResult", (data) =>{
	$('#client-output').text(data);
})

$('#login-button').on('click', ()=>{
	$('#main-page').slideUp(1000);
	$('#game-page').stop().delay(1000).slideDown(1000);
});

$('#rock-button').on('click', () =>{
	socket.emit('chooseMove', "rock");
});

$('#paper-button').on('click', () =>{
	socket.emit('chooseMove', "paper");
});

$('#scissors-button').on('click', () =>{
	socket.emit('chooseMove', "scissors");
});
