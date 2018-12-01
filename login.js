

firebase.auth().onAuthStateChanged(function(user) {

  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
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
