/*
================================================================
  InAmigos Foundation - NGO Awareness Webpage Script
  Header Scroll, Counters, Responsive Menu, Lightbox & Modals
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. HEADER SCROLL EFFECT =================
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  function handleHeaderScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Trigger on load in case page is already scrolled


  // ================= 2. MOBILE MENU / HAMBURGER =================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    // Close menu when a link is clicked
    link.addEventListener('click', closeMenu);
  });

  // Close menu if user clicks outside of nav area
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });


  // ================= 3. ACTIVE NAV LINK INDICATOR =================
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveLink() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset for nav header height
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink);
  highlightActiveLink();


  // ================= 4. SCROLL TRIGGERED COUNTERS =================
  const counterElements = document.querySelectorAll('.impact-number');
  const animationDuration = 1800; // Total counter animation duration in ms

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const startValue = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      // EaseOutQuad function for natural progressive counting
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * (target - startValue) + startValue);

      // Formatting values with commas for clean representation
      let formattedValue = currentValue.toLocaleString();

      // Append suffix
      if (target === 28) {
        element.textContent = `${formattedValue}`; // Presence across 28 states
      } else if (target === 50) {
        element.textContent = `${formattedValue}+`; // fed daily
      } else {
        element.textContent = `${formattedValue}+`; // standard + suffix
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Guarantee exact target displays at the end
        if (target === 28) {
          element.textContent = `${target}`;
        } else {
          element.textContent = `${target.toLocaleString()}+`;
        }
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Intersection Observer for Statistics counters
  const counterObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Trigger count up only once
      }
    });
  }, counterObserverOptions);

  counterElements.forEach(element => {
    counterObserver.observe(element);
  });


  // ================= 5. INTERACTIVE VOLUNTEER MODAL =================
  const modalOverlay = document.getElementById('volunteer-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const volunteerForm = document.getElementById('volunteer-form');
  const modalFormState = document.getElementById('modal-form-state');
  const modalSuccessState = document.getElementById('modal-success-state');
  const successCloseBtn = document.getElementById('success-close-btn');

  function openModal(e) {
    if (e) e.preventDefault();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Check if the trigger button has a specific value to pre-fill initiative dropdown
    if (e && e.target && e.target.classList.contains('project-link')) {
      const parentCard = e.target.closest('.project-card');
      if (parentCard) {
        const projectTitle = parentCard.querySelector('.project-title').textContent.trim();
        const selectDropdown = document.getElementById('interest');
        
        if (projectTitle.includes('SEVA')) selectDropdown.value = 'seva';
        else if (projectTitle.includes('BACHPANSHALA')) selectDropdown.value = 'bachpanshala';
        else if (projectTitle.includes('JEEV')) selectDropdown.value = 'jeev';
        else if (projectTitle.includes('UDAAN')) selectDropdown.value = 'udaan';
        else if (projectTitle.includes('PRAKRITI')) selectDropdown.value = 'prakriti';
        else if (projectTitle.includes('VIKAS')) selectDropdown.value = 'vikas';
      }
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
    
    // Smooth delay before resetting form back to entry state
    setTimeout(() => {
      modalFormState.style.display = 'block';
      modalSuccessState.style.display = 'none';
      volunteerForm.reset();
      
      // Clear validation styles
      const inputs = volunteerForm.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
      });
    }, 400);
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalCloseBtn.addEventListener('click', closeModal);
  successCloseBtn.addEventListener('click', closeModal);

  // Close modal when clicking on backdrop shadow
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Modal Escape key binder
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Validation & Success State Transition
  volunteerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const fullName = document.getElementById('full-name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const interest = document.getElementById('interest');
    
    const inputs = [fullName, email, phone, interest];
    
    // Clear previous visual validations
    inputs.forEach(input => {
      input.style.borderColor = 'rgba(11, 37, 69, 0.15)';
      input.style.backgroundColor = '#FFFFFF';
    });

    // Custom validations
    if (!fullName.value.trim()) {
      fullName.style.borderColor = '#E11D48';
      fullName.style.backgroundColor = '#FFF1F2';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.style.borderColor = '#E11D48';
      email.style.backgroundColor = '#FFF1F2';
      isValid = false;
    }

    if (!phone.value.trim() || phone.value.length < 9) {
      phone.style.borderColor = '#E11D48';
      phone.style.backgroundColor = '#FFF1F2';
      isValid = false;
    }

    if (!interest.value) {
      interest.style.borderColor = '#E11D48';
      interest.style.backgroundColor = '#FFF1F2';
      isValid = false;
    }

    if (isValid) {
      // Perform transition to Success State
      modalFormState.style.display = 'none';
      modalSuccessState.style.display = 'block';
    }
  });


  // ================= 6. INTERACTIVE GALLERY LIGHTBOX =================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullImgSrc = item.getAttribute('data-image');
      const captionText = item.getAttribute('data-caption');
      
      lightboxImg.src = fullImgSrc;
      lightboxCaption.textContent = captionText;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable page scrolling
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }

  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close lightbox on clicking outside image container
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Lightbox Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });


  // ================= 7. SCROLL-TO-TOP BUTTON =================
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const showScrollThreshold = 400;

  function handleScrollTopVisibility() {
    if (window.scrollY > showScrollThreshold) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility);

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

});
