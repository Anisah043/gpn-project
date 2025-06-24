// js/component.js 
async function loadComponent(elementId, componentPath, data = {}) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Élément avec l'ID '${elementId}' non trouvé dans le DOM`);
            return false;
        }

        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        let html = await response.text();
        
        if (Object.keys(data).length > 0) {
            html = replacePlaceholders(html, data);
        }
        
        element.innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Erreur lors du chargement du composant '${elementId}':`, error);
        return false;
    }
}

// Fonction pour remplacer les placeholders dans le HTML
function replacePlaceholders(html, data) {
    return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

// Fonction pour appliquer l'image de background dynamique
function applyDynamicBackground(imagePath) {
    setTimeout(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && imagePath) {
            heroSection.style.background = `linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${imagePath}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.backgroundAttachment = 'fixed';
        }
    }, 100);
}

// Configuration du contenu pour chaque page
const pageConfigs = {
    'home': {
        title: 'Sensibiliser aujourd\'hui,<br>protéger demain.',
        subtitle: 'Ensemble, semons les graines d\'un avenir vert dans le cœur de nos enfants pour cultiver un monde plus sain, durable et vivable pour tous.',
        activeNav: 'accueil',
        image: '../assets/images/font.jpg'
    },
    'about': {
        title: 'Nos Objectifs',
        subtitle: 'Conscientiser chaque citoyen surtout les enfants, à travers une éducation environnementale durable au niveau local, régional et national.<br> Assurer un environnement sain, viable et vivable pour les générations actuelles et futures. <br> Améliorer la santé et le bien-être de la population en mettant en place de dispositifs nécessaires dans le domaine WASH pour lutter contre la pollution environnementale, pour garder un endroit loin de la pollution et en participant l\'éradication de la défécation à l\'air libre.',
        activeNav: 'apropos',
        image: '../assets/images/about-details.jpg'
    },
    'contact': {
        title: 'Envie de faire partie du changement ?',
        subtitle: 'Chez Génération Pro-Nature, chaque geste compte, chaque engagement renforce notre impact, et chaque personne est une force motrice pour un avenir plus vert.',
        activeNav: 'contact',
        image: '../assets/images/contact.jpg'
    }
};
// Fonction pour détecter la page actuelle
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    
    const pageMap = {
        'index': 'home',
        'about': 'about',
        'contact': 'contact'
    };
    
    return pageMap[page] || 'home';
}

// Fonction pour gérer le scroll de la navbar
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Fonction pour l'animation des éléments au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.testimonial-card, .about-section img');
    if (elements.length === 0) {
        console.info('Aucun élément trouvé pour l\'animation au scroll');
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Fonction pour le smooth scroll des liens de navigation
function setupSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    if (anchors.length === 0) {
        console.info('Aucun lien d\'ancrage trouvé pour le smooth scroll');
        return;
    }

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fonction pour mettre à jour la navigation active
function updateActiveNavigation(activePage) {
    setTimeout(() => {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('text-warning', 'fw-semibold');
            link.classList.add('text-white');
        });

        // Marquer le lien actif
        const activeLink = document.querySelector(`[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.remove('text-white');
            activeLink.classList.add('text-warning', 'fw-semibold');
        }
    }, 100);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    
    const currentPage = getCurrentPage();
    const pageConfig = pageConfigs[currentPage];
    
    // console.log(`Page détectée: ${currentPage}`, pageConfig);
    
    const components = [
        { 
            id: 'header', 
            path: 'components/header.html',
            data: pageConfig 
        },
        { id: 'about-section', path: 'components/aboutSection.html' },
        { id: 'gpn', path: 'components/gpn.html' },
        { id: 'join', path: 'components/join.html' },
        { id: 'info', path: 'components/info.html' },
        { id: 'project', path: 'components/project.html' },
        { id: 'testimonials-section', path: 'components/testimony.html' },
        { id: 'footer', path: 'components/footer.html' }
    ];

    let loadedComponents = 0;
    for (const component of components) {
        const success = await loadComponent(component.id, component.path, component.data);
        if (success) {
            loadedComponents++;
        }
    }
    
    setTimeout(() => {
        handleNavbarScroll();
        animateOnScroll();
        setupSmoothScroll();
        updateActiveNavigation(pageConfig.activeNav);
        
        if (pageConfig.image) {
            applyDynamicBackground(pageConfig.image);
        }
        
        window.addEventListener('scroll', handleNavbarScroll);
        
    }, 200);
});

window.ComponentLoader = {
    loadComponent,
    pageConfigs,
    getCurrentPage,
    updateActiveNavigation
};

window.addEventListener('load', function() {
    setTimeout(function() {
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }, 500);
});
