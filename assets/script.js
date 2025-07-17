document.addEventListener('DOMContentLoaded', () => {
  const thumbnails = document.querySelectorAll('.thumbnails img');
  const mainImage = document.querySelector('.main-image');
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImage.src = thumb.src.replace('small', 'large');
    });
  });

  const subscriptionRadios = document.querySelectorAll('input[name="subscription"]');
  const flavorSelection = document.querySelector('.flavor-selection');
  const addToCartForm = document.querySelector('form[action="/cart/add"]');
  let selectedVariantId = '{{ product.variants.first.id }}';

  subscriptionRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateFlavorSelection(radio.value);
      updatePricing();
    });
  });

  function updateFlavorSelection(mode) {
    const flavorInputs = flavorSelection.querySelectorAll('input[name="flavor"]');
    if (mode === 'double') {
      flavorInputs.forEach(input => input.style.display = 'inline');
    } else {
      flavorInputs.forEach((input, index) => {
        input.checked = index === 0;
        input.style.display = index === 0 ? 'inline' : 'none';
      });
    }
  }

  function updatePricing() {
    const mode = document.querySelector('input[name="subscription"]:checked').value;
    const priceElement = document.querySelector('.price');
    const comparePriceElement = document.querySelector('.compare-at-price');
    const variant = {{ product.variants | json }};
    const basePrice = parseFloat(variant[0].price) / 100;
    let discountPrice = mode === 'single' ? basePrice * 0.75 : basePrice * 1.5 * 0.75;
    let finalPrice = discountPrice * 0.8;
    priceElement.textContent = `$${finalPrice.toFixed(2)}`;
    comparePriceElement.textContent = `$${basePrice.toFixed(2)}`;
  }

  addToCartForm.addEventListener('submit', (e) => {
    const flavorInputs = document.querySelectorAll('input[name="flavor"]:checked');
    if ((subscriptionRadios.value === 'double' && flavorInputs.length < 2) || !flavorInputs.length) {
      e.preventDefault();
      alert('Please select all required flavors.');
    }
  });

  updateFlavorSelection('single');
  updatePricing();
});
