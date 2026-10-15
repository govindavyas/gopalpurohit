/**
 * Jyotish Margdarshan - Interactive JavaScript
 * Astrologer: Pandit Gopal Purohit (Gopal)
 * Profile and contact details are loaded from profile.json.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initLiveHours();
  initRashiExplorer();
  initNumerologyCalculator();
  initBookingForms();
  initReviewSystem();
  initFaqAccordion();
});

/* ==========================================================================
   1. HEADER SCROLL & ACTIVE NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.innerHTML = '☰';
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   3. LIVE BUSINESS HOURS STATUS
   ========================================================================== */
function initLiveHours() {
  const statusPills = document.querySelectorAll('.live-status-pill');
  if (!statusPills.length) return;

  function checkStatus() {
    // Current IST Time calculation
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (3600000 * 5.5)); // IST is UTC + 5:30

    const day = ist.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const currentMins = hours * 60 + minutes;

    // Monday (1) to Friday (5): 9:00 AM (540 mins) to 7:00 PM (1140 mins)
    const isWeekday = day >= 1 && day <= 5;
    const isSaturday = day === 6;
    const isOpenHours = currentMins >= 540 && currentMins < 1140;

    let isOpen = false;
    let label = '';

    if (isWeekday && isOpenHours) {
      isOpen = true;
      label = '🟢 Open Now • Available';
    } else if (isSaturday && currentMins >= 600 && currentMins < 960) {
      isOpen = true;
      label = '🟢 Open (Special Appointment)';
    } else {
      isOpen = false;
      label = '🟠 Closed Now • Opens 9:00 AM';
    }

    statusPills.forEach(pill => {
      pill.textContent = label;
      if (isOpen) {
        pill.classList.remove('closed');
      } else {
        pill.classList.add('closed');
      }
    });
  }

  checkStatus();
  setInterval(checkStatus, 60000); // Check every minute
}

/* ==========================================================================
   4. INTERACTIVE RASHI / ZODIAC EXPLORER
   ========================================================================== */
const rashiData = {
  mesh: {
    nameEn: "Mesh (Aries)",
    nameHi: "मेष राशि",
    symbol: "♈",
    planet: "Mangal (Mars)",
    element: "Fire (अग्नि)",
    gemstone: "Red Coral (मूंगा)",
    luckyNum: "9, 1",
    luckyColor: "Crimson Red & Coral",
    advice: "Today brings dynamic energy and leadership confidence. Avoid hasty financial decisions in business dealings. Chanting Hanuman Chalisa brings auspicious blessings.",
    dos: "Focus on planned goals, chant Gayatri Mantra, start new initiatives with clarity.",
    donts: "Avoid impatience, anger during arguments, and unnecessary confrontation."
  },
  vrishabh: {
    nameEn: "Vrishabh (Taurus)",
    nameHi: "वृषभ राशि",
    symbol: "♉",
    planet: "Shukra (Venus)",
    element: "Earth (पृथ्वी)",
    gemstone: "Diamond / White Opal",
    luckyNum: "6, 2",
    luckyColor: "White, Cream & Silver",
    advice: "Harmonious planetary alignment for family peace, art, and investments. Good day for real estate and business negotiations. Offer white flowers to Goddess Lakshmi.",
    dos: "Cultivate artistic pursuits, maintain stability in partnerships, respect elders.",
    donts: "Avoid excessive stubbornness and delaying critical financial paperwork."
  },
  mithun: {
    nameEn: "Mithun (Gemini)",
    nameHi: "मिथुन राशि",
    symbol: "♊",
    planet: "Budha (Mercury)",
    element: "Air (वायु)",
    gemstone: "Emerald (पन्ना)",
    luckyNum: "5, 3",
    luckyColor: "Emerald Green & Light Yellow",
    advice: "Sharp intellect and fruitful communications. Ideal day for writing, trade, and learning. Excellent opportunities for intellectual discussions.",
    dos: "Communicate clearly, feed green grass to cows, organize pending accounts.",
    donts: "Avoid multitasking too many unverified tasks or speaking hastily."
  },
  kark: {
    nameEn: "Kark (Cancer)",
    nameHi: "कर्क राशि",
    symbol: "♋",
    planet: "Chandra (Moon)",
    element: "Water (जल)",
    gemstone: "Pearl (मोती)",
    luckyNum: "2, 7",
    luckyColor: "Pearl White & Silver",
    advice: "Intuition runs deep today. Focus on domestic harmony and health wellbeing. Offer water to Lord Shiva (Jalabhishek) for mental peace and prosperity.",
    dos: "Spend quality time with mother/family, trust inner instincts, practice meditation.",
    donts: "Avoid overthinking emotional matters and hasty spending on comforts."
  },
  singh: {
    nameEn: "Singh (Leo)",
    nameHi: "सिंह राशि",
    symbol: "♌",
    planet: "Surya (Sun)",
    element: "Fire (अग्नि)",
    gemstone: "Ruby (माणिक्य)",
    luckyNum: "1, 4",
    luckyColor: "Golden Yellow, Saffron & Gold",
    advice: "Natural radiance and prestige rise. Government and administrative tasks see positive progress. Offer Arghya (water) to Lord Surya in the morning.",
    dos: "Lead with compassion, support colleagues, honor father and mentors.",
    donts: "Keep ego in check, avoid arrogance in team discussions."
  },
  kanya: {
    nameEn: "Kanya (Virgo)",
    nameHi: "कन्या राशि",
    symbol: "♍",
    planet: "Budha (Mercury)",
    element: "Earth (पृथ्वी)",
    gemstone: "Emerald (पन्ना)",
    luckyNum: "5, 8",
    luckyColor: "Green & Navy Blue",
    advice: "Analytical precision and attention to detail bring professional commendations. Health requires balanced diet and adequate rest.",
    dos: "Solve complex tasks methodically, chant Vishnu Sahasranama, save systematically.",
    donts: "Avoid over-criticizing loved ones and worrying over uncontrollable factors."
  },
  tula: {
    nameEn: "Tula (Libra)",
    nameHi: "तुला राशि",
    symbol: "♎",
    planet: "Shukra (Venus)",
    element: "Air (वायु)",
    gemstone: "Opal / Diamond",
    luckyNum: "6, 9",
    luckyColor: "Sky Blue & Pastel Pink",
    advice: "Balance, justice, and diplomatic partnerships bring lucrative results. Ideal time for relationship consultations and resolving disputes gracefully.",
    dos: "Maintain fair negotiations, create beautiful living spaces, seek mutual respect.",
    donts: "Avoid indecisiveness and letting others take advantage of your gentle nature."
  },
  vrishchik: {
    nameEn: "Vrishchik (Scorpio)",
    nameHi: "वृश्चिक राशि",
    symbol: "♏",
    planet: "Mangal (Mars) & Ketu",
    element: "Water (जल)",
    gemstone: "Red Coral (मूंगा)",
    luckyNum: "9, 3",
    luckyColor: "Dark Red & Maroon",
    advice: "Profound transformative energy. Secrets and hidden insights unlock new growth pathways. Courage helps overcome competitors smoothly.",
    dos: "Focus determination on deep research, practice pranayama, protect confidences.",
    donts: "Avoid harboring past grudges or suspicious thoughts."
  },
  dhanu: {
    nameEn: "Dhanu (Sagittarius)",
    nameHi: "धनु राशि",
    symbol: "♐",
    planet: "Guru (Jupiter)",
    element: "Fire (अग्नि)",
    gemstone: "Yellow Sapphire (पुखराज)",
    luckyNum: "3, 7",
    luckyColor: "Bright Yellow & Turmeric Gold",
    advice: "Cosmic blessings of wisdom, higher learning, and spiritual clarity. Pilgrimage or philosophical discussions bring tremendous joy.",
    dos: "Seek blessings of Guru/teachers, study sacred texts, donate yellow fruits.",
    donts: "Avoid over-promising beyond capacity or reckless speculative risks."
  },
  makar: {
    nameEn: "Makar (Capricorn)",
    nameHi: "मकर राशि",
    symbol: "♑",
    planet: "Shani (Saturn)",
    element: "Earth (पृथ्वी)",
    gemstone: "Blue Sapphire (नीलम)",
    luckyNum: "8, 4",
    luckyColor: "Navy Blue & Charcoal Gray",
    advice: "Diligent hard work bears lasting fruit. Perseverance in professional career brings high respect. Light a sesame oil lamp near Peepal tree on Saturdays.",
    dos: "Remain patient, support underprivileged individuals, stick to long-term discipline.",
    donts: "Avoid pessimism, cynicism, or neglecting personal rest."
  },
  kumbh: {
    nameEn: "Kumbh (Aquarius)",
    nameHi: "कुंभ राशि",
    symbol: "♒",
    planet: "Shani (Saturn) & Rahu",
    element: "Air (वायु)",
    gemstone: "Amethyst / Blue Sapphire",
    luckyNum: "8, 7",
    luckyColor: "Electric Blue & Violet",
    advice: "Innovative ideas and social philanthropy bring fulfilment. Great day for community connections and technology solutions.",
    dos: "Embrace creative thinking, meditate for spiritual grounding, help community.",
    donts: "Avoid emotional detachment and unpredictable decisions."
  },
  meen: {
    nameEn: "Meen (Pisces)",
    nameHi: "मीन राशि",
    symbol: "♓",
    planet: "Guru (Jupiter)",
    element: "Water (जल)",
    gemstone: "Yellow Sapphire (पुखराज)",
    luckyNum: "3, 2",
    luckyColor: "Sea Green, Saffron & Gold",
    advice: "Spiritual intuition and empathy peak. Creative imagination shines. Meditative practices and holy charity bestow divine grace.",
    dos: "Engage in charitable acts, listen to devotional mantras, protect peaceful energy.",
    donts: "Avoid escapism and signing contracts without thorough review."
  }
};

function initRashiExplorer() {
  const rashiBtns = document.querySelectorAll('.rashi-btn');
  const card = document.querySelector('.rashi-card');
  if (!rashiBtns.length || !card) return;

  function renderRashi(key) {
    const data = rashiData[key];
    if (!data) return;

    card.querySelector('.rashi-big-icon').textContent = data.symbol;
    card.querySelector('.rashi-name-en').textContent = data.nameEn;
    card.querySelector('.rashi-name-hi').textContent = data.nameHi;
    card.querySelector('.rashi-val-planet').textContent = data.planet;
    card.querySelector('.rashi-val-element').textContent = data.element;
    card.querySelector('.rashi-val-gem').textContent = data.gemstone;
    card.querySelector('.rashi-val-num').textContent = data.luckyNum;
    card.querySelector('.rashi-guidance-text').textContent = data.advice;
    card.querySelector('.rashi-tip-dos').textContent = data.dos;
    card.querySelector('.rashi-tip-donts').textContent = data.donts;

    rashiBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.rashi === key);
    });
  }

  rashiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderRashi(btn.dataset.rashi);
    });
  });

  // Initial render: Mesh
  renderRashi('mesh');
}

/* ==========================================================================
   5. NUMEROLOGY CALCULATOR (MULANK & BHAGYANK)
   ========================================================================== */
function initNumerologyCalculator() {
  const calcForm = document.getElementById('numerology-form');
  const resultBox = document.getElementById('calc-result');
  if (!calcForm || !resultBox) return;

  function reduceToSingleDigit(num) {
    while (num > 9) {
      num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return num;
  }

  const numerologyDescriptions = {
    1: { planet: "Surya (Sun)", trait: "Natural leader, independent, ambitious, and pioneer." },
    2: { planet: "Chandra (Moon)", trait: "Intuitive, gentle, diplomatic, artistic, and peaceful." },
    3: { planet: "Guru (Jupiter)", trait: "Wise, expressive, creative, optimistic, and spiritual teacher." },
    4: { planet: "Rahu", trait: "Organized, disciplined, unconventional, persistent, and grounded." },
    5: { planet: "Budha (Mercury)", trait: "Dynamic, communicative, adaptable, quick-witted, and adventurous." },
    6: { planet: "Shukra (Venus)", trait: "Loving, harmonious, artistic, responsible, and compassionate." },
    7: { planet: "Ketu", trait: "Deep thinker, mystical, philosophical, analytical, and seeker of truth." },
    8: { planet: "Shani (Saturn)", trait: "Resilient, authoritative, karmic master, enduring, and pragmatic." },
    9: { planet: "Mangal (Mars)", trait: "Courageous, humanitarian, energetic, passionate, and visionary." }
  };

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dobInput = document.getElementById('calc-dob').value;
    if (!dobInput) return;

    const parts = dobInput.split('-'); // [YYYY, MM, DD]
    if (parts.length !== 3) return;

    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);

    const mulank = reduceToSingleDigit(day);

    const totalDigits = (parts[0] + parts[1] + parts[2]).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const bhagyank = reduceToSingleDigit(totalDigits);

    const mulankInfo = numerologyDescriptions[mulank] || numerologyDescriptions[1];
    const bhagyankInfo = numerologyDescriptions[bhagyank] || numerologyDescriptions[1];

    document.getElementById('res-mulank-val').textContent = mulank;
    document.getElementById('res-bhagyank-val').textContent = bhagyank;
    document.getElementById('res-planet-val').textContent = `${mulankInfo.planet} & ${bhagyankInfo.planet}`;
    document.getElementById('res-traits-val').textContent = `Mulank ${mulank}: ${mulankInfo.trait} Bhagyank ${bhagyank}: Destiny guided by ${bhagyankInfo.planet}.`;

    resultBox.classList.add('active');
  });
}

/* ==========================================================================
   6. CONSULTATION BOOKING & WHATSAPP GENERATION
   ========================================================================== */
function initBookingForms() {
  const bookingForms = document.querySelectorAll('.booking-form-action');
  const modalOverlay = document.getElementById('consultation-modal');
  const modalClose = document.getElementById('modal-close-btn');

  // Trigger modal from any button with data-modal="consultation"
  document.querySelectorAll('[data-modal="consultation"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'General Astrology Reading';
      if (modalOverlay) {
        const selectElem = modalOverlay.querySelector('#modal-service');
        if (selectElem) {
          selectElem.value = serviceName;
        }
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle Form Submission for both on-page and modal forms
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value.trim() || 'Client';
      const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
      const dob = form.querySelector('[name="dob"]')?.value.trim() || 'Not specified';
      const tob = form.querySelector('[name="tob"]')?.value.trim() || 'Not specified';
      const pob = form.querySelector('[name="pob"]')?.value.trim() || '';
      const service = form.querySelector('[name="service"]')?.value || 'Astrology Reading';
      const message = form.querySelector('[name="message"]')?.value.trim() || 'Seeking horoscope consultation.';

      // Use dynamic profile details from profile.json
      const profile = window.CURRENT_PROFILE;
      if (!profile?.contact?.phone || !profile.astrologer?.name || !profile.business?.name) {
        alert('Profile details are not loaded yet. Please try again in a moment.');
        return;
      }
      const astroName = profile.astrologer.name;
      const bizName = profile.business.name;
      const waNumber = profile.contact.phone.replace(/\D/g, '');

      // Construct formatted WhatsApp message
      const text = `Namaste ${astroName} ji,
I would like to request an Astrology Consultation with ${bizName}.

*Client Details:*
• Name: ${name}
• Contact: ${phone}
• Date of Birth: ${dob}
• Time of Birth: ${tob}
• Place of Birth: ${pob}
• Consultation Topic: ${service}

*Query / Message:*
${message}

Looking forward to your guidance and available appointment slot. Dhanyawad!`;

      const encodedText = encodeURIComponent(text);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

      // Open WhatsApp directly
      window.open(waUrl, '_blank');

      // Feedback on form
      alert(`Dhanyawad ${name}! Your consultation request is prepared. WhatsApp is opening to connect directly with ${astroName}.`);

      if (modalOverlay && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      form.reset();
    });
  });
}

/* ==========================================================================
   7. REVIEWS SYSTEM & MODAL SUBMISSION
   ========================================================================== */
function initReviewSystem() {
  const addReviewBtn = document.getElementById('add-review-btn');
  const reviewModal = document.getElementById('review-modal');
  const reviewCloseBtn = document.getElementById('review-modal-close');
  const reviewForm = document.getElementById('review-form');
  const reviewsContainer = document.getElementById('reviews-container');

  if (!addReviewBtn || !reviewModal || !reviewForm) return;

  addReviewBtn.addEventListener('click', () => {
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (reviewCloseBtn) {
    reviewCloseBtn.addEventListener('click', () => {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  reviewModal.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rev-name').value.trim() || 'Devotee';
    const location = document.getElementById('rev-loc').value.trim() || window.CURRENT_PROFILE?.location?.city || '';
    const text = document.getElementById('rev-text').value.trim();
    const rating = document.getElementById('rev-rating').value || '5';

    if (!text) return;

    // Create review card HTML
    const initial = name.charAt(0).toUpperCase();
    const stars = '★'.repeat(parseInt(rating, 10)) + '☆'.repeat(5 - parseInt(rating, 10));

    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-card-top">
        <div class="reviewer-profile">
          <div class="reviewer-avatar">${initial}</div>
          <div>
            <div class="reviewer-name">${name}</div>
            <div class="review-date">Just now • ${location}</div>
          </div>
        </div>
        <div class="stars-row">${stars}</div>
      </div>
      <p class="review-body">${text}</p>
      <div class="verified-tag">✓ Verified Client Experience</div>
    `;

    reviewsContainer.prepend(card);

    alert('Thank you for sharing your experience! Your review has been added.');
    reviewModal.classList.remove('active');
    document.body.style.overflow = '';
    reviewForm.reset();
  });
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
