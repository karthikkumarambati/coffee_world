// Mobile menu toggle
let navbar = document.querySelector('.navbar');
let menuBtn = document.querySelector('#menu-btn');

menuBtn.onclick = () => {
    navbar.classList.toggle('active');
};

window.onscroll = () => {
    navbar.classList.remove('active');
};

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all elements with the slide-up animation class
document.querySelectorAll('.animate-slide-up').forEach((element) => {
    element.style.animationPlayState = 'paused'; // Pause initially until scrolled into view
    observer.observe(element);
});
