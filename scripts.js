// Script for Dark/light mode switcher
// const themeSwitch = document.getElementById('themeSwitch');
// const body = document.body;

// themeSwitch.addEventListener('change', () => {
//     if (themeSwitch.checked) {
//         body.classList.add('dark-theme');
//     } else {
//         body.classList.remove('dark-theme');
//     }
// });

window.onload = function () { 
	let slides = 
		document.getElementsByClassName('carousel-item'); 

	function addActive(slide) { 
		slide.classList.add('active'); 
	} 

	function removeActive(slide) { 
		slide.classList.remove('active'); 
	} 

	addActive(slides[0]); 
	setInterval(function () { 
		for (let i = 0; i < slides.length; i++) { 
			if (i + 1 == slides.length) { 
				addActive(slides[0]); 
				setTimeout(removeActive, 350, slides[i]); 
				break; 
			} 
			if (slides[i].classList.contains('active')) { 
				setTimeout(removeActive, 350, slides[i]); 
				addActive(slides[i + 1]); 
				break; 
			} 
		} 
	}, 1500); 
};
