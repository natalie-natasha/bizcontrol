/* =========================
   HEADER SCROLL EFFECT
========================= */
const header = document.getElementById("header");

// Remove the image only when it fails to load, allowing the hero content to remain usable.
document.querySelectorAll(".hero-image img").forEach(image => {
    image.addEventListener("error", () => {
        image.remove();
    });
});

/* =========================
   HERO TYPEWRITER
========================= */
const heroTitle = document.querySelector(".hero-title-text");

if (heroTitle) {
    // Slogans are kept in HTML so changing the words does not require editing this logic.
    const slogans = heroTitle.dataset.slogans.split("|");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const typeSpeed = 75; // Time between typed characters in milliseconds
    const deleteSpeed = 42; // Time between deleted characters in milliseconds
    const sloganPause = 3000; // Time each complete slogan stays visible
    const betweenSlogansPause = 350; // Time before the next slogan starts typing
    let sloganIndex = 0;
    let characterIndex = 0;

    // Add one character at a time, then hold the completed slogan before erasing it.
    const typeNextSlogan = () => {
        const slogan = slogans[sloganIndex];

        if (characterIndex < slogan.length) {
            heroTitle.textContent += slogan[characterIndex];
            characterIndex += 1;
            window.setTimeout(typeNextSlogan, typeSpeed);
            return;
        }

        window.setTimeout(deleteCurrentSlogan, sloganPause);
    };

    // Erase the current slogan from right to left before advancing to the next one.
    const deleteCurrentSlogan = () => {
        if (heroTitle.textContent.length > 0) {
            heroTitle.textContent = heroTitle.textContent.slice(0, -1);
            window.setTimeout(deleteCurrentSlogan, deleteSpeed);
            return;
        }

        sloganIndex = (sloganIndex + 1) % slogans.length;
        characterIndex = 0;
        window.setTimeout(typeNextSlogan, betweenSlogansPause);
    };

    // Reduced-motion visitors see the final slogan immediately and do not get a blinking caret.
    if (reduceMotion) {
        heroTitle.textContent = slogans[slogans.length - 1];
        heroTitle.classList.add("cursor-hidden");
    } else {
        typeNextSlogan();
    }
}

window.addEventListener("scroll", () => {
    // A compact dark header improves contrast after the hero scrolls out of view.
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* =========================
   MOBILE MENU
========================= */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    // Toggle the mobile navigation as a single stateful panel.
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
    // Close the panel after a mobile visitor chooses a destination.
        navLinks.classList.remove("active");
    });
});

/* =========================
   CONTACT FORM
========================= */
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
    // This static site keeps the form on-page and displays a local confirmation.
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const company = document.getElementById("company").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate required fields before showing a success message.
        if (!name || !company || !email || !message) {
            formMessage.textContent = document.documentElement.lang === 'ka'
                ? "გთხოვთ, შეავსოთ ყველა სავალდებულო ველი."
                : "Please complete all required fields.";
            return;
        }
        formMessage.textContent = document.documentElement.lang === 'ka'
            ? "მადლობა. თქვენი შეტყობინება მიღებულია."
            : "Thank you. Your message has been received.";
        contactForm.reset();
    });
}

/* =========================
   SIMPLE REVEAL ANIMATION
========================= */
const revealElements = document.querySelectorAll(
    ".service-card, .why-card, .process-step, .industry-item, .about-features > div"
);

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            // Reveal each item once, when it enters the viewport.
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((element, index) => {
    // Start hidden and stagger the reveal so a grid arrives in a readable rhythm.
    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease";
    element.style.transitionDelay = `${index * 0.08}s`;
    observer.observe(element);
});

/* =========================
   LANGUAGE SWITCHER
========================= */
const langKaBtn = document.getElementById("lang-ka");
const langEnBtn = document.getElementById("lang-en");

function setLanguage(lang) {
    // The lang attribute controls which .ka or .en spans CSS displays.
    document.documentElement.lang = lang;
    localStorage.setItem("biz_control_lang", lang);
    
    if(lang === 'ka') {
        langKaBtn.classList.add("active");
        langEnBtn.classList.remove("active");
    } else {
        langEnBtn.classList.add("active");
        langKaBtn.classList.remove("active");
    }
}

langKaBtn.addEventListener("click", () => setLanguage("ka"));
langEnBtn.addEventListener("click", () => setLanguage("en"));

// Initialize language from local storage or default to KA
const savedLang = localStorage.getItem("biz_control_lang") || "ka";
setLanguage(savedLang);

/* =========================
   SERVICES: EXPAND DETAILS
========================= */
document.querySelectorAll(".expand-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
    // Each button controls only the details panel inside its own service card.
        const content = e.target.closest('.service-card').querySelector(".details-content");
        if(content.classList.contains("open")) {
            content.classList.remove("open");
            // Switch text based on current language
            const isKa = document.documentElement.lang === 'ka';
            e.target.innerHTML = isKa ? '<span class="ka">დეტალურად</span><span class="en" style="display:none;">Details</span> &rarr;' : '<span class="ka" style="display:none;">დეტალურად</span><span class="en">Details</span> &rarr;';
        } else {
            content.classList.add("open");
            const isKa = document.documentElement.lang === 'ka';
            e.target.innerHTML = isKa ? '<span class="ka">აკეცვა</span><span class="en" style="display:none;">Close</span> &uarr;' : '<span class="ka" style="display:none;">აკეცვა</span><span class="en">Close</span> &uarr;';
        }
    });
});

/* =========================
   SERVICES: MONITORING TABS
========================= */
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Keep one tab and one content panel active at a time.
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        
        // The button's data-target links it to the matching content panel.
        const targetId = btn.getAttribute("data-target");
        document.getElementById(targetId).classList.add("active");
    });
});