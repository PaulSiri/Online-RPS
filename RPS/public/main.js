var socket = io();
var opponentMoved = false;
var oppMove;

socket.on('connectToRoom',function(data) {
	$('#room-number').text(data);
});

socket.on('waitForOpponent', ()=>{
	$('#rock-button').prop('disabled', true);
	$('#paper-button').prop('disabled', true);
	$('#scissors-button').prop('disabled', true);

	$('#client-output').text("Waiting for opponent to join the room...");
})

socket.on('startGame', () =>{
	$('#rock-button').prop('disabled', false);
	$('#paper-button').prop('disabled', false);
	$('#scissors-button').prop('disabled', false);

	$('#client-output').text("Choose Rock, Paper, or Scissors!");
})

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

socket.on("playerLeft", ()=>{
	$('#rock-button').prop('disabled', true);
	$('#paper-button').prop('disabled', true);
	$('#scissors-button').prop('disabled', true);

	$('#client-output').text("Your opponent left the room...");

	$('#return-button').slideDown(1);
})


firebase.auth().onAuthStateChanged(function(user) {

  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    $('#after-login').slideDown(1);
    document.getElementById("LogIn").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      //
      // document.getElementById("user_para").innerHTML = "Welcome " + email_id;

  // ...

    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("LogIn").style.display = "block";

  }
});

function signUp(){

  var email = document.getElementById("email_fieldS").value;
  var password = document.getElementById("password_fieldS").value;

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  window.alert("Error : " + errorMessage);

  // ...
});
goToLogin();
}


function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
  $('#after-login').slideUp(1);
}

function goToLogin(){
  document.getElementById("LogIn").style.display = "block";
  document.getElementById("SignUp").style.display = "none";
}

function goToSignUp(){
  document.getElementById("LogIn").style.display = "none";
  document.getElementById("SignUp").style.display = "block";
  document.getElementById("name_fieldS").innerHTML = "";
  document.getElementById("email_fieldS").innerHTML = "";
  document.getElementById("password_fieldS").innerHTML = "";
}


$('#play-button').on('click', ()=>{
	$('#login-page').slideUp(1000);
	$('#game-page').stop().delay(1000).slideDown(1000);
});

$('#return-button').on('click', ()=>{
	$('#game-page').slideUp(1000);
	$('#login-page').stop().delay(1000).slideDown(1000, ()=>{
		location.reload();
	});
})

$('#rock-button').on('click', () =>{
	socket.emit('chooseMove', "rock");
});

$('#paper-button').on('click', () =>{
	socket.emit('chooseMove', "paper");
});

$('#scissors-button').on('click', () =>{
	socket.emit('chooseMove', "scissors");
});
