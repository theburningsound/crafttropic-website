const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
  header.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navLinks.classList.toggle('open', !isOpen);
  header.classList.toggle('menu-open', !isOpen);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton.focus();
  }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target || link.getAttribute('href') === '#') return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const observedLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observedLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-25% 0px -65% 0px' });
sections.forEach(section => observer.observe(section));

function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 20); }
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const form = document.querySelector('#quote-form');
const fields = [...form.querySelectorAll('input[required], select[required], textarea[required]')];
const success = document.querySelector('#form-success');

function showError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  const error = document.querySelector(`#${field.id}-error`);
  if (error) { error.textContent = message; field.setAttribute('aria-describedby', error.id); }
}

function clearError(field) {
  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
  const error = document.querySelector(`#${field.id}-error`);
  if (error) error.textContent = '';
}

function validateField(field) {
  clearError(field);
  if (!field.value.trim()) { showError(field, 'Please complete this field.'); return false; }
  if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) { showError(field, 'Enter a valid email address.'); return false; }
  if (field.type === 'number' && Number(field.value) < 1) { showError(field, 'Enter at least one guest.'); return false; }
  return true;
}

fields.forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  success.hidden = true;
  const validFields = fields.map(validateField).every(Boolean);
  const checkedServices = form.querySelectorAll('input[name="service"]:checked');
  const serviceError = document.querySelector('#service-error');
  serviceError.textContent = checkedServices.length ? '' : 'Select at least one beverage service.';

  if (!validFields || !checkedServices.length) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]') || form.querySelector('input[name="service"]');
    firstInvalid.focus();
    return;
  }

  const formData = new FormData(form);
  const submission = Object.fromEntries(formData);
  submission.service = formData.getAll('service');

  success.hidden = false;
  form.reset();
  success.focus();
});

document.querySelectorAll('input[name="service"]').forEach(box => box.addEventListener('change', () => {
  if (form.querySelector('input[name="service"]:checked')) document.querySelector('#service-error').textContent = '';
}));

document.querySelector('#year').textContent = new Date().getFullYear();
