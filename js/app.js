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
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

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
    
    // Reset scroll position of inner body back to top on open
    const scrollBody = modalOverlay.querySelector('.modal-body-scroll');
    if (scrollBody) {
      scrollBody.scrollTop = 0;
    }
    
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
      
      // Reset scroll position of inner body back to top on close
      const scrollBody = modalOverlay.querySelector('.modal-body-scroll');
      if (scrollBody) {
        scrollBody.scrollTop = 0;
      }
      
      // Clear all active validation error elements
      const inputs = volunteerForm.querySelectorAll('.form-input');
      inputs.forEach(input => {
        clearError(input);
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

  // Helper function to display active form group error state
  function showError(input, message) {
    if (!input) return;
    input.classList.add('is-invalid');
    input.style.borderColor = '#e11d48';
    input.style.backgroundColor = '#fff1f2';
    
    const errorSpan = document.getElementById(`error-${input.id}`);
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.add('active');
    }
  }

  // Helper function to clear active form group error state
  function clearError(input) {
    if (!input) return;
    input.classList.remove('is-invalid');
    input.style.borderColor = '';
    input.style.backgroundColor = '';
    
    const errorSpan = document.getElementById(`error-${input.id}`);
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('active');
    }
  }

  // Master field-level validation logic
  function validateField(input) {
    if (!input) return true;
    
    // 1. Full Name Validation
    if (input.id === 'full-name') {
      const val = input.value.trim();
      if (!val) {
        showError(input, 'Full name is required');
        return false;
      }
      if (val.length < 2) {
        showError(input, 'Name must be at least 2 characters long');
        return false;
      }
      clearError(input);
      return true;
    }
    
    // 2. Email Address Validation
    if (input.id === 'email') {
      const val = input.value.trim();
      if (!val) {
        showError(input, 'Email address is required');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError(input, 'Please enter a valid email address');
        return false;
      }
      if (!val.toLowerCase().endsWith('@gmail.com')) {
        showError(input, 'Please enter a valid Gmail address');
        return false;
      }
      clearError(input);
      return true;
    }
    
    // 3. Phone Number Validation
    if (input.id === 'phone') {
      const val = input.value.trim();
      if (!val) {
        showError(input, 'Phone number is required');
        return false;
      }
      const onlyDigitsRegex = /^\d+$/;
      if (!onlyDigitsRegex.test(val)) {
        showError(input, 'Phone number must contain only numbers');
        return false;
      }
      if (val.length !== 10) {
        showError(input, 'Phone number must be exactly 10 digits');
        return false;
      }
      clearError(input);
      return true;
    }
    
    // 4. Preferred Initiative Validation
    if (input.id === 'interest') {
      const val = input.value;
      if (!val) {
        showError(input, 'Please select a preferred initiative');
        return false;
      }
      clearError(input);
      return true;
    }
    
    return true;
  }

  // Hook real-time validation listeners to input elements
  const inputsToValidate = [
    document.getElementById('full-name'),
    document.getElementById('email'),
    document.getElementById('phone'),
    document.getElementById('interest')
  ];

  inputsToValidate.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        validateField(input);
      });
      input.addEventListener('blur', () => {
        validateField(input);
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          validateField(input);
        });
      }
    }
  });

  // Strict number-only keyboard filters and 10-digit cap for the phone field
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('keypress', (e) => {
      // Allow only numbers 0-9
      if (e.key < '0' || e.key > '9') {
        e.preventDefault();
      }
    });

    phoneInput.addEventListener('input', () => {
      // Strip any non-digits (e.g. from copy-paste) and cap length to exactly 10
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  // Form Validation & Success State Transition
  volunteerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    inputsToValidate.forEach(input => {
      const isFieldValid = validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Perform transition to Success State
      modalFormState.style.display = 'none';
      modalSuccessState.style.display = 'block';
      
      // Reset scroll position of inner body to top for success screen
      const scrollBody = modalOverlay.querySelector('.modal-body-scroll');
      if (scrollBody) {
        scrollBody.scrollTop = 0;
      }
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


  // ================= 8. INTERACTIVE NEWS & BLOG DETAIL MODAL =================
  const newsModal = document.getElementById('news-modal');
  const newsModalCloseBtn = document.getElementById('news-modal-close-btn');
  const newsLinks = document.querySelectorAll('.news-link');
  
  const modalImg = document.getElementById('news-modal-img');
  const modalTag = document.getElementById('news-modal-tag');
  const modalDate = document.getElementById('news-modal-date');
  const modalTitle = document.getElementById('news-modal-title');
  const modalText = document.getElementById('news-modal-text');
  const modalExternalLink = document.getElementById('news-modal-external-link');

  // Descriptive content for each card to display beautifully inside the popup modal
  const cardData = {
    'world-water-day-2025': {
      text: `InAmigos Foundation conducted a highly interactive advocacy campaign on World Water Day 2025 to spread clean water awareness across disadvantaged communities. <br><br>Our dedicated volunteers set up interactive testing stations, demonstrating practical water filtration methods and simple everyday conservation strategies to over 500 local residents.<br><br>By distributing clean storage containers and organic water purification tablets, we actively supported local families in securing healthy, clean drinking water. Thank you to all who contributed to making this campaign a massive success!`
    },
    'international-day-of-happiness-2025': {
      text: `To celebrate the International Day of Happiness 2025, InAmigos Foundation hosted special celebration camps inside orphanage centers and street communities. <br><br>The event was filled with uninhibited laughter, fun painting workshops, physical sporting games, and a successful distribution of healthy refreshments and nutrition kits to hundreds of happy children.<br><br>Our primary objective was to ensure that every single child experienced pure joy and felt deeply cared for. Spreading smiles is at the absolute core of our social mission!`
    },
    'international-day-women-girls-science-2025': {
      text: `InAmigos Foundation celebrated the International Day of Women and Girls in Science by holding special STEM classes in local government schools. <br><br>Young schoolgirls were introduced to hands-on science models, physics demos, and fun experiments to spark their scientific curiosity.<br><br>We also arranged interactive mentoring sessions with women educators to motivate girls to pursue engineering, research, and scientific careers, breaking social biases and establishing equal opportunities.`
    },
    'empowering-education-via-bachpanshala': {
      text: `Project BachpanShala represents InAmigos Foundation's primary initiative to ensure quality primary education reaches every child in underserved pockets.<br><br>Through this blog post, we share our journey of setting up smart study kits, digital classes, and robust educational infrastructures inside rural schools.<br><br>We explore how structuring structural support, supply of quality learning materials, and persistent volunteer tutoring can bridge severe education gaps and help young minds shape bright futures.`
    },
    'project-udaan-fostering-self-reliance': {
      text: `Project Udaan is our dedicated campaign centered around modern women's empowerment and economic self-reliance.<br><br>This post shares the inspiring stories of our women trainees who joined our tailoring, sewing, and local business training camps.<br><br>By equipping them with lifelong craft skills and introductory financial planning workshops, Project Udaan actively transforms dependent lives into resilient, successful micro-entrepreneurial ventures.`
    },
    'lifestyle-for-environment-going-green': {
      text: `Under Project Prakriti, InAmigos Foundation is dedicated to advocating sustainable environment care and practical green lifestyles.<br><br>This article explores the concept of 'Lifestyle for Environment' (LiFE), outlining how small, daily personal adjustments can create massive ecological conservation benefits.<br><br>We discuss our extensive plantation campaigns, seedball distributions, and our interactive local plastic cleanup drives that help build a greener, cleaner tomorrow.`
    }
  };

  function openNewsModal(e) {
    e.preventDefault();
    const card = e.target.closest('.news-card');
    if (!card) return;

    const imgUrl = card.querySelector('.news-img-wrapper img').src;
    const tagText = card.querySelector('.news-tag').textContent;
    const isBlog = card.querySelector('.news-tag').classList.contains('blog-tag');
    const dateText = card.querySelector('.news-date').textContent;
    const titleText = card.querySelector('.news-card-title').textContent;
    const externalUrl = card.querySelector('.news-link').getAttribute('href');

    // Resolve key for detailed text based on title similarity
    let dataKey = '';
    if (titleText.includes('Water')) dataKey = 'world-water-day-2025';
    else if (titleText.includes('Happiness')) dataKey = 'international-day-of-happiness-2025';
    else if (titleText.includes('Science')) dataKey = 'international-day-women-girls-science-2025';
    else if (titleText.includes('BachpanShala')) dataKey = 'empowering-education-via-bachpanshala';
    else if (titleText.includes('Udaan')) dataKey = 'project-udaan-fostering-self-reliance';
    else if (titleText.includes('Environment')) dataKey = 'lifestyle-for-environment-going-green';

    const detailedText = cardData[dataKey] ? cardData[dataKey].text : card.querySelector('.news-desc').textContent;

    // Inject data
    modalImg.src = imgUrl;
    modalTag.textContent = tagText;
    modalTag.className = isBlog ? 'news-modal-tag blog-tag' : 'news-modal-tag event-tag';
    modalDate.textContent = dateText;
    modalTitle.textContent = titleText;
    modalText.innerHTML = detailedText;
    modalExternalLink.href = externalUrl;
    if (isBlog) {
      modalExternalLink.style.display = 'none';
    } else {
      modalExternalLink.style.display = '';
      modalExternalLink.textContent = 'Full Event Details';
    }

    // Show modal
    newsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNewsModal() {
    newsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  newsLinks.forEach(link => {
    link.addEventListener('click', openNewsModal);
  });

  // Also open modal on clicking the card title or image for better UX
  const newsCards = document.querySelectorAll('.news-card');
  newsCards.forEach(card => {
    const title = card.querySelector('.news-card-title');
    const imgWrapper = card.querySelector('.news-img-wrapper');
    title.style.cursor = 'pointer';
    imgWrapper.style.cursor = 'pointer';
    title.addEventListener('click', openNewsModal);
    imgWrapper.addEventListener('click', openNewsModal);
  });

  newsModalCloseBtn.addEventListener('click', closeNewsModal);

  newsModal.addEventListener('click', (e) => {
    if (e.target === newsModal) {
      closeNewsModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && newsModal.classList.contains('active')) {
      closeNewsModal();
    }
  });

});
