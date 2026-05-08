// ===============================
// MENU MOBILE
// ===============================

const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});

// Fermer le menu après clic sur un lien
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
    });
});


// ===============================
// ANIMATION AU SCROLL
// ===============================

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }

    });

}, {
    threshold: 0.15
});

hiddenElements.forEach(el => observer.observe(el));


// ===============================
// ANNÉE AUTOMATIQUE FOOTER
// ===============================

const year = document.getElementById("year");

year.textContent = new Date().getFullYear();


// ===============================
// HEADER BACKGROUND AU SCROLL
// ===============================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


// ===============================
// SCROLL FLUIDE
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});


// ===============================
// EFFET TYPING HERO
// ===============================

const text = "Référente digitale";
const typingElement = document.querySelector(".hero h2");

let index = 0;

function typeEffect(){

    if(index < text.length){

        typingElement.textContent += text.charAt(index);

        index++;

        setTimeout(typeEffect, 100);
    }

}

// Réinitialiser le texte avant animation
typingElement.textContent = "";

window.addEventListener("load", typeEffect);


// ===============================
// ANIMATION DES BARRES DE SKILLS
// ===============================

const skillBars = document.querySelectorAll(".progress span");

const skillObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            const bar = entry.target;

            const width = bar.style.width;

            bar.style.width = "0";

            setTimeout(() => {
                bar.style.width = width;
            }, 200);

        }

    });

}, {
    threshold: 0.5
});

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});


// ===============================
// FORMULAIRE CONTACT
// ===============================

const form = document.querySelector(".contact-form");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    alert("Votre message a été envoyé avec succès !");

    form.reset();

});