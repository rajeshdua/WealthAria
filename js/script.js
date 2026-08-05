/* ==========================================
   WealthAria V1.0 JavaScript
========================================== */

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Header shadow on scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {

    if (window.scrollY > 30) {
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.12)";
    } else {
        header.style.boxShadow = "0 2px 15px rgba(0,0,0,.08)";
    }

});

// Reveal cards while scrolling
const cards = document.querySelectorAll('.card');

const revealCards = () => {

    const trigger = window.innerHeight * 0.90;

    cards.forEach(card => {

        const top = card.getBoundingClientRect().top;

        if (top < trigger) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }

    });

};

// Initial card state
cards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all .6s ease";

});

window.addEventListener('scroll', revealCards);
revealCards();

// Statistics animation
const stats = document.querySelectorAll(".stat h2");

stats.forEach(stat => {

    const value = stat.innerText;

    if (!isNaN(parseInt(value))) {

        const target = parseInt(value);

        let count = 0;

        const timer = setInterval(() => {

            count++;

            stat.innerText = count + "+";

            if (count >= target) {

                stat.innerText = value;

                clearInterval(timer);

            }

        }, 40);

    }

});

console.log("✅ WealthAria V1.0 Loaded");
