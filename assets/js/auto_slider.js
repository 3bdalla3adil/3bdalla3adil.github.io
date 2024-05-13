const panels = document.querySelectorAll(".panel");

panels.forEach((panel) => {
  panel.addEventListener("click", () => {
    removeActiveClasses();
    panel.classList.add("active");
  });
});

const removeActiveClasses = () => {
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });
};

    // Dark-mode Switcher Functionality
    document.getElementById('toggleContrast').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Save user's preference to local storage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

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

// Check for user's preference on page load
const isDarkMode = localStorage.getItem('darkMode');
if (isDarkMode === 'true') {
    document.body.classList.add('dark-mode');
}
