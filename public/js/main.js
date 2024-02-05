document.addEventListener("DOMContentLoaded", () => {
    // Initialize the category buttons event listeners
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
            this.classList.add('active'); // Add active class to the clicked button
            fetchVrApps(this.getAttribute('data-category'));
        });
    });

    fetchVrApps(); // Fetch all categories by default
});

function fetchVrApps(category = "") {
    const vrAppContainer = document.getElementById('vrAppContainer');
    vrAppContainer.innerHTML = ''; // Clear the current content
    const url = `/api/vrapps${category ? `?category=${encodeURIComponent(category)}` : ''}`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayVrApps(data))
        .catch(error => console.error("Failed to load VR apps data:", error));
}

function displayVrApps(vrApps) {
    const container = document.getElementById('vrAppContainer');
    container.innerHTML = ''; // Clear existing apps

    vrApps.forEach(app => {
        const appElement = document.createElement('div');
        appElement.className = 'vr-app';
        appElement.innerHTML = `
            <h2>${app.name}</h2>
            <div class="video-container">
                <video class="vr-video" controls muted loop preload="none">
                    <source src="${app.videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <span class="category-tag">${app.category}</span> <!-- Category tag added here -->
            </div>
            <p>${app.description}</p>
            <a href="${app.link}" target="_blank" class="button">GET</a>
        `;
        container.appendChild(appElement);
    });

    setupVideoAutoplay(); // Set up video autoplay and pause on scroll
}

function setupVideoAutoplay() {
    const videos = document.querySelectorAll('.vr-video');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                entry.target.pause();
            } else {
                entry.target.play();
            }
        });
    }, {
        root: null, // default is the viewport
        rootMargin: '0px',
        threshold: 0.1 // play when 10% of the video is visible
    });

    videos.forEach(video => {
        observer.observe(video);
    });
}
