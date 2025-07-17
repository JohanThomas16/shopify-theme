document.addEventListener('DOMContentLoaded', () => {
  const thumbnails = document.querySelectorAll('.thumbnails img');
  const mainImage = document.querySelector('.main-image');
  const dots = document.querySelectorAll('.dots span');
  let currentIndex = 0;

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      mainImage.src = thumb.dataset.large;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    });
  });

  const navButtons = document.querySelectorAll('.carousel-nav button');
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentIndex = button.textContent === '>' ? (currentIndex + 1) % thumbnails.length : (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      mainImage.src = thumbnails[currentIndex].dataset.large;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    });
  });

  const subscriptionRadios = document.querySelectorAll('input[name="subscription"]');
  const flavorSelection = document.querySelector('#flavor-selection');
  const addToCartForm = document.querySelector('form[action="/cart/add"]');
  let selectedVariantId = '{{ product.variants.first.id }}';

  subscriptionRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const flavorGroups = flavorSelection.querySelectorAll('.flavor-group');
      flavorGroups.forEach(group => group.style.display = 'none');
      flavorSelection.querySelector(`.flavor-group[data-for="${radio.value}"]`).style.display = 'block';
      updatePricing();
    });
  });

  function updatePricing() {
    const mode = document.querySelector('input[name="subscription"]:checked').value;
    const priceElement = document.querySelector('.price');
    const comparePriceElement = document.querySelector('.compare-at-price');
    const basePrice = parseFloat('{{ product.variants.first.price | money_without_currency }}') || 1000;
    let discountPrice = mode === 'single' ? basePrice * 0.6 : basePrice * 1.2 * 0.6;
    let finalPrice = discountPrice * 0.8;
    priceElement.textContent = `$${finalPrice / 100}`;
    comparePriceElement.textContent = `$${basePrice / 100}`;
  }

  addToCartForm.addEventListener('submit', (e) => {
    const flavor1 = document.querySelector('input[name="flavor1"]:checked');
    const flavor2 = document.querySelector('input[name="flavor2"]:checked');
    if (document.querySelector('input[value="double"]:checked') && (!flavor1 || !flavor2)) {
      e.preventDefault();
      alert('Please select both flavors.');
    } else if (!document.querySelector('input[name="flavor"]:checked') && !flavor1) {
      e.preventDefault();
      alert('Please select a flavor.');
    }
  });

  updatePricing();
});
