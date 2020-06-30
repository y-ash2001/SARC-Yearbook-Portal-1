const hamburger = document.querySelector('.hamburger');
const navlinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
	navlinks.classList.toggle('open');
	links.forEach((link) => {
		link.classList.toggle('fade');
	});
});

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}
function preventBack(){window.history.forward();}
         setTimeout("preventBack()", 0);
         window.onunload=function(){null};