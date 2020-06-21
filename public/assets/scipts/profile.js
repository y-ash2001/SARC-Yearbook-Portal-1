var x = document.getElementById('glitch');
function toggle() {
	if (x.style.display === 'none') {
		console.log(1);
		x.style.display = 'flex';
	} else {
		x.style.display = 'none';
	}
}
