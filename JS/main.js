const navbar = document.querySelector('.navbar');
const navbarHeight = navbar ? navbar.offsetHeight : 0;
const observerOptions = {
    rootMargin: `-${navbarHeight}px 0px 0px 0px`
};

const myObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        }
    })
}, observerOptions)

const elements = document.querySelectorAll('.hidden');
elements.forEach((element) => myObserver.observe(element));

// Add 'show' class to all hidden elements on load since they are in view
document.addEventListener('DOMContentLoaded', () => {
    elements.forEach((element) => element.classList.add('show'));

    // Force hero animations to show immediately
    const heroDetails = document.querySelector('.hero-details');
    if (heroDetails) heroDetails.classList.add('show');

    const heroImageSection = document.querySelector('.hero-section section.hidden');
    if (heroImageSection) heroImageSection.classList.add('show');
});

// --------------------------------------------------------------- 

document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.querySelector('.hero .animate-fade');
    const subt = document.getElementById('hero-sub');

    if (titulo) {
        setTimeout(() => titulo.classList.add('visible'), 180);
    }

    if (subt) {
        const texto = subt.dataset.text || '';
        subt.textContent = '';
        const speed = 35;
        let i = 0;

        setTimeout(function type() {
            if (i < texto.length) {
                subt.textContent += texto.charAt(i++);
                setTimeout(type, speed);
            } else {
                subt.classList.remove('typing');
            }
        }, 500);
    }
});

// --------------------------------------------------------------- 

document.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.querySelector('.btn-menu');
    // Busca por ambos os seletores: 'nav ul' (homepage) ou '.nav-menu' (páginas internas)
    const navMenu = document.querySelector('nav ul') || document.querySelector('.nav-menu');

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            btnMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fecha o menu ao clicar em um link (útil em mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                btnMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// ---------------------------------------------------------------

// ---------------------------------------------------------------
// DRAG AND DROP FOR BRIGADEIRO CARDS
// ---------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-bolo');
    const catalogoContainer = document.querySelector('.catalogo-container');

    cards.forEach(card => {
        card.draggable = false;
        let isDragging = false;
        let startX, startY, startTime;

        // Handle mousedown to track start
        card.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
            startTime = Date.now();
        });

        // Handle mouseup to check if it's a click or drag
        card.addEventListener('mouseup', (e) => {
            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);
            const deltaTime = Date.now() - startTime;

            // If movement is small and time is short, treat as click
            if (deltaX < 10 && deltaY < 10 && deltaTime < 300 && !isDragging) {
                const brigadeiroName = card.querySelector('h3').textContent.trim();
                const message = `Olá, gostaria de algumas informações sobre ${brigadeiroName}.`;
                const whatsappUrl = `https://wa.me/5196090068?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
        });

        // Drag start
        card.addEventListener('dragstart', (e) => {
            isDragging = true;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        // Drag end
        card.addEventListener('dragend', () => {
            isDragging = false;
            card.classList.remove('dragging');
        });
    });

    // Handle drop on container
    if (catalogoContainer) {
        catalogoContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        catalogoContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggingCard = document.querySelector('.card-bolo.dragging');
            if (!draggingCard) return;

            const afterElement = getDragAfterElement(catalogoContainer, e.clientX);
            if (afterElement == null) {
                catalogoContainer.appendChild(draggingCard);
            } else {
                catalogoContainer.insertBefore(draggingCard, afterElement);
            }
        });
    }

    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll('.card-bolo:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});

// ---------------------------------------------------------------
// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle tortas carousel
    const tortasCarousel = document.getElementById('tortas-carousel');
    const leftArrowTortas = document.getElementById('left-arrow-tortas');
    const rightArrowTortas = document.getElementById('right-arrow-tortas');

    if (tortasCarousel && leftArrowTortas && rightArrowTortas) {
        // Scroll left
        leftArrowTortas.addEventListener('click', () => {
            tortasCarousel.scrollBy({
                left: -320, // Scroll by card width + gap
                behavior: 'smooth'
            });
        });

        // Scroll right
        rightArrowTortas.addEventListener('click', () => {
            tortasCarousel.scrollBy({
                left: 320, // Scroll by card width + gap
                behavior: 'smooth'
            });
        });

        // Update arrow visibility based on scroll position
        function updateArrows() {
            const isAtStart = tortasCarousel.scrollLeft === 0;
            const isAtEnd = tortasCarousel.scrollLeft >= tortasCarousel.scrollWidth - tortasCarousel.clientWidth - 1;

            leftArrowTortas.style.opacity = isAtStart ? '0.5' : '1';
            leftArrowTortas.style.pointerEvents = isAtStart ? 'none' : 'auto';
            rightArrowTortas.style.opacity = isAtEnd ? '0.5' : '1';
            rightArrowTortas.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }

        // Initial check
        updateArrows();

        // Update on scroll
        tortasCarousel.addEventListener('scroll', updateArrows);

        // Update on window resize
        window.addEventListener('resize', updateArrows);
    }

    // Handle bolos carousel
    const bolosCarousel = document.getElementById('bolos-carousel');
    const leftArrowBolos = document.getElementById('left-arrow-bolos');
    const rightArrowBolos = document.getElementById('right-arrow-bolos');

    if (bolosCarousel && leftArrowBolos && rightArrowBolos) {
        // Scroll left
        leftArrowBolos.addEventListener('click', () => {
            bolosCarousel.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        });

        // Scroll right
        rightArrowBolos.addEventListener('click', () => {
            bolosCarousel.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        });

        function updateBolosArrows() {
            const isAtStart = bolosCarousel.scrollLeft === 0;
            const isAtEnd = bolosCarousel.scrollLeft >= bolosCarousel.scrollWidth - bolosCarousel.clientWidth - 1;

            leftArrowBolos.style.opacity = isAtStart ? '0.5' : '1';
            leftArrowBolos.style.pointerEvents = isAtStart ? 'none' : 'auto';
            rightArrowBolos.style.opacity = isAtEnd ? '0.5' : '1';
            rightArrowBolos.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }

        updateBolosArrows();
        bolosCarousel.addEventListener('scroll', updateBolosArrows);
        window.addEventListener('resize', updateBolosArrows);
    }

    // Handle brigadeiros carousel
    const brigadeirosCarousel = document.getElementById('brigadeiros-carousel');
    const leftArrowBrigadeiros = document.getElementById('left-arrow-brigadeiros');
    const rightArrowBrigadeiros = document.getElementById('right-arrow-brigadeiros');

    if (brigadeirosCarousel && leftArrowBrigadeiros && rightArrowBrigadeiros) {
        // Scroll left
        leftArrowBrigadeiros.addEventListener('click', () => {
            brigadeirosCarousel.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        });

        // Scroll right
        rightArrowBrigadeiros.addEventListener('click', () => {
            brigadeirosCarousel.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        });

        function updateBrigadeirosArrows() {
            const isAtStart = brigadeirosCarousel.scrollLeft === 0;
            const isAtEnd = brigadeirosCarousel.scrollLeft >= brigadeirosCarousel.scrollWidth - brigadeirosCarousel.clientWidth - 1;

            leftArrowBrigadeiros.style.opacity = isAtStart ? '0.5' : '1';
            leftArrowBrigadeiros.style.pointerEvents = isAtStart ? 'none' : 'auto';
            rightArrowBrigadeiros.style.opacity = isAtEnd ? '0.5' : '1';
            rightArrowBrigadeiros.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }

        updateBrigadeirosArrows();
        brigadeirosCarousel.addEventListener('scroll', updateBrigadeirosArrows);
        window.addEventListener('resize', updateBrigadeirosArrows);
    }
});

// ---------------------------------------------------------------
// Form submission handler for contact form
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contato-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = contactForm.querySelector('input[name="nome"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const message = contactForm.querySelector('textarea[name="mensagem"]').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            // Simulate sending (in a real app, this would send to a server)
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');

            // Reset form
            contactForm.reset();
        });
    }
});

// ---------------------------------------------------------------

