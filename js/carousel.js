const carousel = document.querySelector('#carouselExemple');
const carouselInstance = new bootstrap.Carousel(carousel, {
    interval: 4000, // 4 secondes entre chaque slide
    wrap: true,     // Retour au début après le dernier slide
    touch: true     // Support du swipe sur mobile
});

// Pause au survol
carousel.addEventListener('mouseenter', () => {
    carouselInstance.pause();
});

carousel.addEventListener('mouseleave', () => {
    carouselInstance.cycle();
});