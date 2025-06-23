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
    this.dispatchCartUpdateEvent();
  }

  addItem(item) {
    const cart = this.getCart();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.id === item.id && cartItem.city === item.city
    );

    if (existingItemIndex >= 0) {
      // Item exists
      this.showToastMessage("Esta mídia já está no seu carrinho", "info");
    } else {
      // Add new item
      item.quantity = 1;
      cart.push(item);
    }

    this.saveCart(cart);
    return true;
  }

  removeItem(itemId, city) {
    const cart = this.getCart().filter(item => 
      !(item.id === itemId && item.city === city)
    );
    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart([]);
  }

  updateCartCount() {
    const count = this.getCart().reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }

  dispatchCartUpdateEvent() {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  setupEventListeners() {
    // Handle cart button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart') || e.target.closest('.add-cart-button')) {
        e.preventDefault();
        const card = e.target.closest('.midia-card');
        
        if (card) {
          const item = {
            id: card.dataset.midiaId,
            title: card.querySelector('.midia-adress p').textContent,
            image: card.querySelector('.midia-image').src,
            city: document.querySelector('.section-title')?.textContent.replace('Mídias em ', '') || 'Salvador',
            type: card.querySelector('li:nth-child(2) a').textContent
          };
          
          if (this.addItem(item)) {
            alert('Mídia adicionada ao carrinho!');
          }
        }
      }
    });

    // Update cart when storage changes in other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.CART_KEY) {
        this.updateCartCount();
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
    const totalElement = document.getElementById('cart-total');
    
    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
      totalElement.textContent = '0';
      return;
    }

    let html = '';
    cartItems.forEach(item => {
      html += `
        <div class="cart-item" data-id="${item.id}" data-city="${item.city}">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-details">
            <h3>${item.title}</h3>
            <p><strong>Cidade:</strong> ${item.city}</p>
            <p><strong>Tipo:</strong> ${item.type}</p>
            <p><strong>Quantidade:</strong> ${item.quantity || 1}</p>
            <button class="remove-item">Remover</button>
          </div>
        </div>
      `;
    });

    cartContainer.innerHTML = html;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const itemElement = this.closest('.cart-item');
        cart.removeItem(itemElement.dataset.id, itemElement.dataset.city);
        displayCartItems();
      });
    });
  }

  // Handle form submission
  document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cartItems = cart.getCart();
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Prepare cart data for email
    const cartData = {
      items: cartItems,
      clientInfo: {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        whatsapp: this.querySelector('[name="whatsapp"]').value,
        agency: this.querySelector('[name="agency"]').value
      },
      totalItems: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    };

    // Set hidden field with cart data
    this.querySelector('#cart-data').value = JSON.stringify(cartData);

    // Submit form (using FormSubmit.co)
    this.submit();
    
    // Clear cart after successful submission
    cart.clearCart();
    displayCartItems();
    
    // Show success message
    alert('Pedido enviado com sucesso! Entraremos em contato em breve.');
  });

  // Clear cart button
  document.getElementById('clear-cart')?.addEventListener('click', function() {
    if (confirm('Tem certeza que deseja limpar seu carrinho?')) {
      cart.clearCart();
      displayCartItems();
    }
  });

  // Initial display
  displayCartItems();
}