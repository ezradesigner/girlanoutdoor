class CartManager {
  constructor() {
    this.CART_KEY = 'girlan_outdoor_cart_v2';
    this.initCart();
    this.updateCartCount();
    this.setupEventListeners();
  }

  initCart() {
    if (!localStorage.getItem(this.CART_KEY)) {
      localStorage.setItem(this.CART_KEY, JSON.stringify([]));
    }
  }

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    this.updateCartCount();
    this.updateCartButtons();
  }

  isInCart(itemId, city) {
    return this.getCart().some(item => item.id === itemId && item.city === city);
  }

  toggleItem(item) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(cartItem => 
      cartItem.id === item.id && cartItem.city === item.city
    );

    if (itemIndex >= 0) {
      // Remove item if already in cart
      cart.splice(itemIndex, 1);
    } else {
      // Add item if not in cart
      item.quantity = 1;
      cart.push(item);
    }

    this.saveCart(cart);
  }

  updateCartCount() {
    const count = this.getCart().length;
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }

  updateCartButtons() {
    document.querySelectorAll('.add-cart-button').forEach(button => {
      const card = button.closest('.midia-card');
      if (!card) return;

      const itemId = card.dataset.midiaId;
      const city = document.querySelector('.section-title')?.textContent.replace('Mídias em ', '') || 'Salvador';
      const icon = button.querySelector('i');
      const text = button.querySelector('span');

      if (this.isInCart(itemId, city)) {
        if (icon) icon.className = 'fas fa-check';
        if (text) text.textContent = 'Mídia adicionada';
        button.classList.add('in-cart');
      } else {
        if (icon) icon.className = 'fas fa-cart-shopping';
        if (text) text.textContent = 'Adicionar ao carrinho';
        button.classList.remove('in-cart');
      }
    });
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.add-cart-button');
      if (!button) return;

      e.preventDefault();
      const card = button.closest('.midia-card');
      if (!card) return;

      const item = {
        id: card.dataset.midiaId,
        title: card.querySelector('.midia-adress p').textContent,
        image: card.querySelector('.midia-image').src,
        city: document.querySelector('.section-title')?.textContent.replace('Mídias em ', '') || 'Salvador',
        type: card.querySelector('li:nth-child(2) a').textContent
      };

      this.toggleItem(item);
    });

    window.addEventListener('storage', (e) => {
      if (e.key === this.CART_KEY) {
        this.updateCartCount();
        this.updateCartButtons();
      }
    });
  }
}

// Initialize cart manager
const cart = new CartManager();

// Cart page specific functionality
if (window.location.pathname.includes('cart.html')) {
  function displayCartItems() {
    const cartItems = cart.getCart();
    const cartContainer = document.getElementById('cart-items');
    
    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
      return;
    }

    cartContainer.innerHTML = cartItems.map(item => `
      <div class="cart-item" data-id="${item.id}" data-city="${item.city}">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p><strong>Cidade:</strong> ${item.city}</p>
          <p><strong>Tipo:</strong> ${item.type}</p>
          <button class="remove-item">Remover</button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const itemElement = this.closest('.cart-item');
        cart.toggleItem({
          id: itemElement.dataset.id,
          city: itemElement.dataset.city
        });
        displayCartItems();
      });
    });
  }

  document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.getCart().length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    this.querySelector('#cart-data').value = JSON.stringify({
      items: cart.getCart(),
      clientInfo: {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        whatsapp: this.querySelector('[name="whatsapp"]').value,
        agency: this.querySelector('[name="agency"]').value
      }
    });

    this.submit();
    cart.clearCart();
    alert('Pedido enviado com sucesso!');
  });

  document.getElementById('clear-cart')?.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar seu carrinho?')) {
      cart.clearCart();
      displayCartItems();
    }
  });

  displayCartItems();
}
