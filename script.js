/**
 * Персональний сайт-візитка: Скрипти (Vanilla JavaScript)
 * Не містить зовнішніх залежностей або бібліотек.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Керування темою (Світла / Темна)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  // Визначення початкової теми: з пам'яті або за системними налаштуваннями
  const savedTheme = localStorage.getItem('site-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeToggle.setAttribute('title', 'Увімкнути світлу тему');
    } else {
      themeIcon.textContent = '🌙';
      themeToggle.setAttribute('title', 'Увімкнути темну тему');
    }
  }

  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // 2. Мобільне меню (Hamburger)
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Закриття мобільного меню при кліку на посилання
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Підсвічування активного пункту меню під час прокручування
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink();

  // 4. Обробка форми зворотного зв'язку
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccessMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        date: new Date().toLocaleString('uk-UA')
      };

      // Збереження повідомлення в LocalStorage для демонстрації
      try {
        const storedMessages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        storedMessages.push(formData);
        localStorage.setItem('portfolio_messages', JSON.stringify(storedMessages));
      } catch (err) {
        console.warn('Не вдалося зберегти в LocalStorage:', err);
      }

      // Показ повідомлення про успішне надсилання
      formSuccess.classList.remove('hidden');
      contactForm.reset();

      setTimeout(() => {
        formSuccess.classList.add('hidden');
      }, 5000);
    });
  }

  // 5. Анімація смужок прогресу у предметах під час скролу
  const progressBars = document.querySelectorAll('.progress-fill');

  if ('IntersectionObserver' in window && progressBars.length > 0) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 100);
          progressObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(bar => progressObserver.observe(bar));
  }
});
