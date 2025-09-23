// Loading functionality
document.addEventListener("DOMContentLoaded", function() {
    const loaderOverlay = document.getElementById('loader-overlay');
    const portfolioContainer = document.getElementById('portfolio-container');
    const progressBar = document.getElementById('loader-progress-bar');
    const loaderText = document.getElementById('loader-text');
    const loaderParticles = document.getElementById('loader-particles');
    
    // Create particles for loader background
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('loader-particle');
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random animation delay
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      loaderParticles.appendChild(particle);
    }
    
    // Track assets loading progress
    let progress = 0;
    const totalAssets = 2; // Three.js + image
    let loadedAssets = 0;
    
    // Update the progress bar
    function updateProgress(increment) {
      loadedAssets += increment;
      progress = (loadedAssets / totalAssets) * 100;
      progressBar.style.width = `${progress}%`;
      
      if (progress >= 100) {
        setTimeout(hideLoader, 500);
      }
    }
    
    // Load profile image in advance
    const profileImage = new Image();
    profileImage.onload = function() {
      updateProgress(1);
      loaderText.textContent = "Initializing 3D environment...";
    };
    profileImage.onerror = function() {
      // Continue even if image fails to load
      updateProgress(1);
    };
    profileImage.src = "profile.jpg";
    
    // Three.js loading (monitor initialization)
    let threeJsLoaded = false;
    function checkThreeJsLoaded() {
      if (typeof THREE !== 'undefined' && !threeJsLoaded) {
        threeJsLoaded = true;
        updateProgress(1);
        loaderText.textContent = "Preparing portfolio...";
      } else if (!threeJsLoaded) {
        setTimeout(checkThreeJsLoaded, 100);
      }
    }
    checkThreeJsLoaded();
    
    // Hide loader and show portfolio
    function hideLoader() {
      loaderOverlay.classList.add('loader-hidden');
      portfolioContainer.classList.add('portfolio-visible');
      
      // Initialize Three.js once loading is complete
      initializeThreeJs();
      
      // Remove loader after transition completes
      loaderOverlay.addEventListener('transitionend', function() {
        loaderOverlay.style.display = 'none';
      });
    }
    
    // Fallback in case assets take too long
    setTimeout(function() {
      if (progress < 100) {
        // Force complete if taking too long
        progressBar.style.width = '100%';
        setTimeout(hideLoader, 500);
      }
    }, 5000);
  });
  
  // Initialize Three.js Scene
  function initializeThreeJs() {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('three-container').appendChild(renderer.domElement);
  
    // Set background color
    scene.background = new THREE.Color(0x0A1114);
  
    // Set camera position
    camera.position.z = 5;
  
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  
    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
  
    // Create particles for background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
  
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
  
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8
    });
  
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
  
    // Add glowing dots
    function createGlowDots() {
      const dotCount = 30;
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('glow-dot');
  
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
  
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
  
        // Random size
        const size = Math.random() * 4 + 2;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
  
        // Random opacity
        dot.style.opacity = Math.random() * 0.6 + 0.2;
  
        document.body.appendChild(dot);
  
        // Animate the dots
        animateGlowDot(dot);
      }
    }
  
    function animateGlowDot(dot) {
      // Random animation duration
      const duration = Math.random() * 8000 + 5000;
  
      // Random new position
      const newX = Math.random() * window.innerWidth;
      const newY = Math.random() * window.innerHeight;
  
      // Set transition
      dot.style.transition = `all ${duration}ms ease-in-out`;
  
      // Set new position
      setTimeout(() => {
        dot.style.left = `${newX}px`;
        dot.style.top = `${newY}px`;
  
        // Continue animation
        setTimeout(() => {
          animateGlowDot(dot);
        }, duration);
  
      }, 100);
    }
  
    createGlowDots();
  
    // Create 3D cards
    const cards = document.querySelectorAll('.card');
    const cardsCount = cards.length;
    const cardPositions = [];
    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);
  
    // Create visual placeholders for the cards in 3D space
    cards.forEach((card, index) => {
      // Create card visual representation
      const cardGeometry = new THREE.PlaneGeometry(4, 5);
      const cardMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
  
      // Position cards in 3D space
      const angle = (index * (2 * Math.PI)) / cardsCount;
      const radius = 7;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
  
      cardMesh.position.set(x, 0, z);
      cardMesh.lookAt(0, 0, 0);
  
      cardPositions.push({ x, y: 0, z, angle });
      cardsGroup.add(cardMesh);
    });
  
    // Current active card index
    let activeCardIndex = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;
  
    // Show first card
    updateActiveCard();
  
    // Setup mouse move effect
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
  
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
  
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
  
      // Smooth follow for mouse
      targetMouseX += (mouseX - targetMouseX) * 0.05;
      targetMouseY += (mouseY - targetMouseY) * 0.05;
  
      // Rotate particles based on mouse position
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;
  
      // Add some mouse-based motion to particles
      particlesMesh.rotation.x += targetMouseY * 0.0002;
      particlesMesh.rotation.y += targetMouseX * 0.0002;
  
      // Smooth rotation of card group
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      cardsGroup.rotation.y = currentRotationY;
  
      // Add subtle floating animation to cards
      cardsGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
  
      renderer.render(scene, camera);
    }
  
    animate();
  
    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  
      // Recalculate card positions with appropriate spacing for current screen size
      updateActiveCard();
    });
  
    // Navigation functionality
    function updateActiveCard() {
      const totalCards = cards.length;
  
      cards.forEach((card, index) => {
        // Calculate relative index for circular navigation
        let relativeIndex = index - activeCardIndex;
  
        // Adjust for circular navigation
        if (relativeIndex < -Math.floor(totalCards / 2)) {
          relativeIndex += totalCards;
        } else if (relativeIndex > Math.floor(totalCards / 2)) {
          relativeIndex -= totalCards;
        }
  
        if (index === activeCardIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
  
        // Position the card
        const position = calculateCardPosition(relativeIndex);
        card.style.transform = `translate3d(${position.x}px, ${position.y}px, ${position.z}px) rotateY(${position.rotateY}deg)`;
  
        // Set z-index based on distance from center
        card.style.zIndex = 20 - Math.abs(relativeIndex);
  
        // Set opacity based on distance from center
        if (relativeIndex === 0) {
          card.style.opacity = 1;
        } else if (Math.abs(relativeIndex) === 1) {
          card.style.opacity = 0.7;
        } else if (Math.abs(relativeIndex) === 2) {
          card.style.opacity = 0.4;
        } else {
          card.style.opacity = 0.1;
        }
      });
  
      // Update menu items
      document.querySelectorAll('.menu-item').forEach((item, idx) => {
        if (idx === activeCardIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
  
      // Update nav dots
      document.querySelectorAll('.nav-dot').forEach((dot, idx) => {
        if (idx === activeCardIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
  
      // Update 3D scene rotation
      targetRotationY = -cardPositions[activeCardIndex].angle;
    }
  
    function calculateCardPosition(relativeIndex) {
      // Base position for centered card
      if (relativeIndex === 0) {
        return {
          x: 0,
          y: 0,
          z: 0,
          rotateY: 0
        };
      }
  
      // Position for cards to the left/right - responsive to screen size
      let cardSpacing = 700; // Default spacing for large screens
  
      // Adjust spacing based on screen width and height
      if (window.innerHeight <= 800) {
        cardSpacing = 500; // Much smaller spacing for short screens
      } else if (window.innerHeight <= 900) {
        cardSpacing = 600; // Smaller spacing for medium-height screens
      }
  
      // If screen is narrow, further reduce spacing
      if (window.innerWidth <= 1366) {
        cardSpacing -= 100;
      }
  
      const distance = cardSpacing * Math.sign(relativeIndex);
      const z = -300 * Math.abs(relativeIndex);
      const y = -50 * Math.abs(relativeIndex);
      const angle = 30 * relativeIndex;
  
      return {
        x: distance,
        y: y,
        z: z,
        rotateY: angle
      };
    }
  
    // Handle card navigation with proper scroll behavior
    function changeCard(direction) {
      // For circular navigation
      const totalCards = cards.length;
      activeCardIndex = (activeCardIndex + direction + totalCards) % totalCards;
      updateActiveCard();
    }
  
    // Add click events to nav dots
    document.querySelectorAll('.nav-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        activeCardIndex = index;
        updateActiveCard();
      });
    });
  
    // Add click events to menu items
    document.querySelectorAll('.menu-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));
        activeCardIndex = index;
        updateActiveCard();
      });
    });
  
    // Navigation arrows
    document.querySelector('.prev-arrow').addEventListener('click', () => {
      changeCard(-1);
    });
  
    document.querySelector('.next-arrow').addEventListener('click', () => {
      changeCard(1);
    });
  
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        changeCard(-1);
      } else if (e.key === 'ArrowRight') {
        changeCard(1);
      }
    });
  
    // Fix scrolling inside cards
    document.querySelectorAll('.card-content').forEach(content => {
      content.addEventListener('wheel', (e) => {
        const contentHeight = content.scrollHeight;
        const visibleHeight = content.clientHeight;
        const scrollTop = content.scrollTop;
  
        // If we're not at the top or bottom of the content, prevent default behavior
        if ((scrollTop > 0 && e.deltaY < 0) ||
          (scrollTop < contentHeight - visibleHeight && e.deltaY > 0)) {
          e.stopPropagation();
        }
      });
    });
  
    // Handle wheel event for card navigation
    window.addEventListener('wheel', (e) => {
      // Check if we're scrolling inside a card or outside
      const isScrollingInsideCard = e.target.closest('.card-content');
  
      // If not scrolling inside a card content, change the card
      if (!isScrollingInsideCard) {
        if (e.deltaY > 0) {
          changeCard(1);
        } else if (e.deltaY < 0) {
          changeCard(-1);
        }
      }
    });
  
    // Handle touch swipe for mobile - improved version
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;
    let touchStartTime = 0;
    let hasSwipedThisGesture = false;

    document.addEventListener('touchstart', (e) => {
      // Check if we're touching inside a card content area
      const isScrollingInsideCard = e.target.closest('.card-content');

      // If not inside card content, prepare for potential swipe
      if (!isScrollingInsideCard) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isSwiping = true;
        hasSwipedThisGesture = false;

        // Prevent default to avoid page scrolling during swipe
        e.preventDefault();
      } else {
        isSwiping = false;
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (isSwiping && !hasSwipedThisGesture) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = touchStartX - touchX;
        const diffY = touchStartY - touchY;

        // Check if this is more of a horizontal swipe than vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
          // Prevent default scrolling for horizontal swipes
          e.preventDefault();

          // Only trigger swipe if we've moved far enough and it's been quick enough
          if (Math.abs(diffX) > 80) {
            const timeDiff = Date.now() - touchStartTime;

            // Only allow swipes that are reasonably fast (within 500ms)
            if (timeDiff < 500) {
              if (diffX > 0) {
                changeCard(1); // Swipe left to go to next card
              } else {
                changeCard(-1); // Swipe right to go to previous card
              }

              hasSwipedThisGesture = true;
              isSwiping = false;
            }
          }
        } else if (Math.abs(diffY) > 20) {
          // If user is scrolling vertically, cancel horizontal swipe detection
          isSwiping = false;
        }
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      isSwiping = false;
      hasSwipedThisGesture = false;
    });
  
    // Handle form submission
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message. I will get back to you soon!');
      contactForm.reset();
    });
  
    // Mobile Menu Functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    let isMobileMenuOpen = false;

    // Toggle mobile menu
    function toggleMobileMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;

      if (isMobileMenuOpen) {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
      } else {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    // Close mobile menu
    function closeMobileMenu() {
      if (isMobileMenuOpen) {
        isMobileMenuOpen = false;
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    // Mobile menu toggle button click
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile menu when overlay is clicked
    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Handle mobile menu item clicks
    document.querySelectorAll('.mobile-menu-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));

        // Update active mobile menu item
        document.querySelectorAll('.mobile-menu-item').forEach(menuItem => {
          menuItem.classList.remove('active');
        });
        item.classList.add('active');

        // Navigate to the selected card
        activeCardIndex = index;
        updateActiveCard();

        // Close mobile menu after selection
        closeMobileMenu();
      });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    });

    // Close mobile menu when screen size changes to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    });

    // Update mobile menu active state when cards change
    function updateMobileMenuActiveState() {
      document.querySelectorAll('.mobile-menu-item').forEach((item, idx) => {
        if (idx === activeCardIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    // Override the existing updateActiveCard function to include mobile menu updates
    const originalUpdateActiveCard = updateActiveCard;
    updateActiveCard = function() {
      originalUpdateActiveCard();
      updateMobileMenuActiveState();
    };

    // Trigger initial update to set first card active
    updateActiveCard();
  }