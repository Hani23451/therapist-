//  toogle sidebar

document.addEventListener("DOMContentLoaded", () => {
  toggleSidebar();
  makeLinkActive();
});

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById("sidebarToggle");

  toggleButton.addEventListener("click", () => {
    if (sidebar.classList.contains("-translate-x-full")) {
      sidebar.classList.remove("-translate-x-full");
    } else {
      sidebar.classList.add("-translate-x-full");
    }
  });
}

// make linke active
function makeLinkActive() {
  const currentPath = window.location.pathname;
  console.log(currentPath);
  const sidebarLinks = document.querySelectorAll("#sidebar a");

  sidebarLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("bg-gray-700");
    } 
  });
}
 


function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

// Function to hide the loading overlay
function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

// Show loading spinner on form submit
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function() {
    showLoading();
  });
});

// Show loading spinner on page navigation
window.addEventListener('beforeunload', function() {
  showLoading();
});

// For AJAX requests, show and hide loading spinner accordingly
document.addEventListener('DOMContentLoaded', function() {
  // Intercept fetch API requests
  const originalFetch = fetch;
  window.fetch = function(...args) {
    showLoading();
    return originalFetch(...args).finally(hideLoading);
  };
});