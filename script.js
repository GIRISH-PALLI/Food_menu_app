// script.js

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------- Mobile Navigation ---------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    /* ---------------- Cart Functionality ---------------- */
    let cart = [];

    const cartIcon = document.getElementById('cart-icon');
    const cartCountElem = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElem = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    function updateCartDisplay() {
        cartCountElem.textContent = cart.length;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-cart-message';
            emptyMsg.textContent = 'Your cart is empty';
            cartItemsContainer.appendChild(emptyMsg);
            cartTotalElem.textContent = '$0.00';
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            const cartItemElem = document.createElement('div');
            cartItemElem.classList.add('cart-item');

            cartItemElem.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x $${item.price.toFixed(2)}</p>
                </div>
                <span class="cart-item-price">$${(item.quantity * item.price).toFixed(2)}</span>
                <button class="remove-item-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            cartItemsContainer.appendChild(cartItemElem);
            total += item.quantity * item.price;
        });

        cartTotalElem.textContent = `$${total.toFixed(2)}`;

        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const index = parseInt(e.currentTarget.dataset.index);
                cart.splice(index, 1);
                updateCartDisplay();
            });
        });
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        updateCartDisplay();
        toggleCartModal(true);
    }

    function toggleCartModal(open) {
        if (open === true) {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else if (open === false) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            cartModal.classList.toggle('active');
            document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
        }
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', e => {
            const card = e.target.closest('.pizza-card');
            if (!card) return;

            const item = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image
            };

            addToCart(item);
        });
    });

    cartIcon.addEventListener('click', () => toggleCartModal());
    closeCartBtn.addEventListener('click', () => toggleCartModal(false));

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items first.');
            return;
        }

        alert('Proceeding to checkout (frontend demo)');
        console.log('Cart:', cart);

        cart = [];
        updateCartDisplay();
        toggleCartModal(false);
    });

    /* ---------------- Build Your Own Pizza ---------------- */
    const byopForm = document.getElementById('byop-form');
    const byopPriceElem = document.getElementById('byop-current-price');
    const byopAddToCartBtn = document.querySelector('.add-to-cart-byop');

    let currentByopPrice = 0;

    function updateByopPrice() {
        let price = 0;

        const crust = byopForm.querySelector('input[name="crust-size"]:checked');
        const sauce = byopForm.querySelector('input[name="sauce"]:checked');
        const cheese = byopForm.querySelector('input[name="cheese"]:checked');

        if (crust) price += parseFloat(crust.dataset.price);
        if (sauce) price += parseFloat(sauce.dataset.price);
        if (cheese) price += parseFloat(cheese.dataset.price);

        byopForm.querySelectorAll('input[name="toppings"]:checked').forEach(t => {
            price += parseFloat(t.dataset.price);
        });

        currentByopPrice = price;
        byopPriceElem.textContent = `$${price.toFixed(2)}`;
    }

    updateByopPrice();
    byopForm.addEventListener('change', updateByopPrice);

    byopAddToCartBtn.addEventListener('click', e => {
        e.preventDefault();

        const customPizza = {
            id: 'byop-' + Date.now(),
            name: 'Custom Pizza',
            price: currentByopPrice,
            image: 'https://via.placeholder.com/60',
            details: []
        };

        ['crust-size', 'sauce', 'cheese'].forEach(type => {
            const selected = byopForm.querySelector(`input[name="${type}"]:checked`);
            if (selected) customPizza.details.push(selected.value);
        });

        byopForm.querySelectorAll('input[name="toppings"]:checked').forEach(t => {
            customPizza.details.push(t.value);
        });

        customPizza.name += ` (${customPizza.details.join(', ')})`;
        addToCart(customPizza);
    });

});
