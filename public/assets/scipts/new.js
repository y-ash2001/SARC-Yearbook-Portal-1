var modal = document.getElementById('modal-main');
var mask = document.getElementById('modal-mask');
var photo_modal = document.getElementById('photo-modal');
var modal_mask = document.getElementById('upload-modal');
// Get the <span> element that closes the modal
var span = document.getElementById('close-modal');
var close_button = document.getElementById('close-photo-modal');
var photo_btn = document.getElementById('photo-button');
// When the user clicks on <span> (x), close the modal
photo_btn.onclick = function () {
	modal_mask.style.display = 'block';
	photo_modal.style.display = 'block';
};

span.onclick = function () {
	modal.style.display = 'none';
	mask.style.display = 'none';
};

close_button.onclick = function () {
	modal_mask.style.display = 'none';
	photo_modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == mask) {
		modal.style.display = 'none';
		mask.style.display = 'none';
	}
};