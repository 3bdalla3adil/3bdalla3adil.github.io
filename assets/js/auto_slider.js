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

// Check for user's preference on page load
const isDarkMode = localStorage.getItem('darkMode');
if (isDarkMode === 'true') {
    document.body.classList.add('dark-mode');
}
