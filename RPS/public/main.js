$('#login-button').on('click', ()=>{
	$('#main-page').slideUp(1000);
	$('#game-page').stop().delay(1000).slideDown(1000);
});