let box = document.getElementById('main-photo'),
	btn = document.getElementById('toggle-button');

btn.addEventListener(
	'click',
	function () {
		if (box.classList.contains('hidden')) {
			box.classList.remove('hidden');
			setTimeout(function () {
				box.classList.remove('visuallyhidden');
			}, 20);
		} else {
			box.classList.add('visuallyhidden');
			box.addEventListener(
				'transitionend',
				function (e) {
					box.classList.add('hidden');
				},
				{
					capture: false,
					once: true,
					passive: false,
				}
			);
		}
	},
	false
);
