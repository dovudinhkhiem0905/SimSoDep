// Import translations
import translations from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    let currentLanguage = localStorage.getItem('language') || 'vi';
    
    // Language switching function
    function switchLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.dataset.translatePlaceholder;
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Update button values
        document.querySelectorAll('[data-translate-value]').forEach(element => {
            const key = element.dataset.translateValue;
            if (translations[lang][key]) {
                element.value = translations[lang][key];
            }
        });
        
        // Update select options with data-translate
        document.querySelectorAll('select option[data-translate]').forEach(option => {
            const key = option.dataset.translate;
            if (translations[lang][key]) {
                option.textContent = translations[lang][key];
            }
        });
        
        // Refresh all number cards to update their buttons
        document.querySelectorAll('.number-grid').forEach(grid => {
            if (grid.children.length > 0) {
                const category = grid.closest('section').id.replace('sim-', '').replace('-', '');
                displayNumbers(category, grid);
            }
        });
        
        // Update current language display
        const langDisplay = {
            'vi': 'Tiếng Việt',
            'en': 'English',
            'zh': '中文'
        };
        document.querySelector('.current-lang').textContent = langDisplay[lang];
        
        // Update active state in dropdown
        document.querySelectorAll('.lang-dropdown a').forEach(link => {
            link.classList.toggle('active', link.dataset.lang === lang);
        });
    }
    
    // Language switcher button click handler
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });
    
    // Language selection handler
    document.querySelectorAll('.lang-dropdown a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            switchLanguage(lang);
            langDropdown.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-switcher')) {
            langDropdown.classList.remove('active');
        }
    });

    // Initialize with saved language
    switchLanguage(currentLanguage);

    // Initialize cart
    let cart = [];
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCount = document.querySelector('.cart-count');

    // Sample phone number data with state information
    const phoneNumbers = {
        vip: [
            { id: 1, number: '(464) 666-3333', price: 2999, type: 'vip', state: 'IL', city: 'Calumet City' },
            { id: 2, number: '(708) 666-3333', price: 3499, type: 'vip', state: 'IL', city: 'Oak Park' },
            
            // New VIP numbers with "GET IT NOW"
            { id: 3, number: '(464) 999-5555', price: 3999, type: 'vip', state: 'IL', city: 'Harvey' },      // Triple 9, triple 5
            { id: 4, number: '(309) 777-6666', price: 4499, type: 'vip', state: 'IL', city: 'Ipava' },       // Triple 7, triple 6
            { id: 5, number: '(464) 777-6666', price: 4299, type: 'vip', state: 'IL', city: 'Summit' },      // Triple 7, triple 6
            { id: 6, number: '(464) 333-7777', price: 4299, type: 'vip', state: 'IL', city: 'Harvey' },      // Triple 3, triple 7
            { id: 7, number: '(464) 222-9999', price: 3999, type: 'vip', state: 'IL', city: 'Mokena' },      // Triple 2, triple 9
            { id: 8, number: '(224) 333-1111', price: 3799, type: 'vip', state: 'IL', city: 'Algonquin' },   // Triple 3, triple 1
            { id: 9, number: '(464) 333-1111', price: 3799, type: 'vip', state: 'IL', city: 'Harvey' },      // Triple 3, triple 1
            { id: 10, number: '(331) 666-3333', price: 4999, type: 'vip', state: 'IL', city: 'Aurora' },     // Triple 6, triple 3
            { id: 11, number: '(847) 999-6666', price: 5999, type: 'vip', state: 'IL', city: 'Winnetka' },   // Triple 9, triple 6
            { id: 12, number: '(464) 888-4444', price: 4499, type: 'vip', state: 'IL', city: 'Orland' },     // Triple 8, triple 4
            { id: 13, number: '(464) 444-8888', price: 4699, type: 'vip', state: 'IL', city: 'Beecher' },    // Triple 4, triple 8
            { id: 14, number: '(309) 222-0000', price: 4999, type: 'vip', state: 'IL', city: 'Peoria' },     // Triple 2, quad 0
            { id: 15, number: '(779) 999-8888', price: 5999, type: 'vip', state: 'IL', city: 'Newark' },     // Triple 9, triple 8
            { id: 16, number: '(217) 888-4444', price: 4499, type: 'vip', state: 'IL', city: 'Champaign-Urbana' }, // Triple 8, triple 4
            { id: 17, number: '(618) 666-4444', price: 4299, type: 'vip', state: 'IL', city: 'Collinsville' },    // Triple 6, triple 4
            { id: 18, number: '(309) 222-1111', price: 3999, type: 'vip', state: 'IL', city: 'Peoria' },         // Triple 2, triple 1
            { id: 19, number: '(217) 888-6666', price: 4499, type: 'vip', state: 'IL', city: 'Champaign-Urbana' }, // Triple 8, triple 6
            { id: 20, number: '(872) 666-2222', price: 4299, type: 'vip', state: 'IL', city: 'Chicago Zone 09-South Chicago' }, // Triple 6, triple 2
            { id: 21, number: '(779) 222-3333', price: 3999, type: 'vip', state: 'IL', city: 'Sycamore' },       // Triple 2, triple 3
            { id: 22, number: '(872) 444-3333', price: 3999, type: 'vip', state: 'IL', city: 'Chicago Zone 06-Kedzie' }, // Triple 4, triple 3
            { id: 23, number: '(779) 777-4444', price: 4499, type: 'vip', state: 'IL', city: 'De Kalb' },        // Triple 7, triple 4
            { id: 24, number: '(708) 777-2222', price: 4499, type: 'vip', state: 'IL', city: 'Cicero' },         // Triple 7, triple 2
            { id: 25, number: '(708) 777-3333', price: 4499, type: 'vip', state: 'IL', city: 'Cicero' },         // Triple 7, triple 3
            { id: 26, number: '(464) 333-4444', price: 3999, type: 'vip', state: 'IL', city: 'Harvey' },         // Triple 3, triple 4
            { id: 27, number: '(464) 777-5555', price: 4299, type: 'vip', state: 'IL', city: 'Summit' },         // Triple 7, triple 5
            { id: 28, number: '(224) 888-6666', price: 4699, type: 'vip', state: 'IL', city: 'Cary' },           // Triple 8, triple 6
            { id: 29, number: '(464) 999-7777', price: 5499, type: 'vip', state: 'IL', city: 'Harvey' },         // Triple 9, triple 7
            { id: 30, number: '(464) 999-8888', price: 5499, type: 'vip', state: 'IL', city: 'Harvey' },         // Triple 9, triple 8
            { id: 31, number: '(464) 222-0000', price: 4999, type: 'vip', state: 'IL', city: 'Mokena' },         // Triple 2, quad 0
            { id: 32, number: '(618) 777-1111', price: 4299, type: 'vip', state: 'IL', city: 'Staunton' },        // Triple 7, triple 1
            // New VIP numbers with "GET IT NOW" - Higher priced premium numbers
            { id: 66, number: '(312) 444-6666', price: 7999, type: 'vip', state: 'IL', city: 'Chicago Zone 01-Franklin' }, // Chicago proper, triple 4, triple 6
            { id: 67, number: '(331) 999-5555', price: 7499, type: 'vip', state: 'IL', city: 'Oswego' },          // Triple 9, triple 5
            { id: 68, number: '(618) 666-0000', price: 7999, type: 'vip', state: 'IL', city: 'Collinsville' },    // Triple 6, quad 0
            { id: 69, number: '(815) 666-4444', price: 7999, type: 'vip', state: 'IL', city: 'Joliet' },          // Triple 6, triple 4
            { id: 70, number: '(309) 222-4444', price: 7499, type: 'vip', state: 'IL', city: 'Peoria' },          // Triple 2, triple 4
            { id: 71, number: '(708) 888-6666', price: 7999, type: 'vip', state: 'IL', city: 'Riverdale' },       // Triple 8, triple 6
            { id: 72, number: '(708) 222-3333', price: 8999, type: 'vip', state: 'IL', city: 'Cicero' },          // Triple 2, triple 3, prime area
            { id: 73, number: '(630) 333-2222', price: 8999, type: 'vip', state: 'IL', city: 'Elmhurst' },        // Triple 3, triple 2
            { id: 74, number: '(630) 333-7777', price: 8999, type: 'vip', state: 'IL', city: 'Elmhurst' },        // Triple 3, triple 7
            { id: 75, number: '(872) 888-0000', price: 8499, type: 'vip', state: 'IL', city: 'Chicago Zone 02-Edgewater' }, // Triple 8, quad 0
            { id: 76, number: '(773) 444-3333', price: 9999, type: 'vip', state: 'IL', city: 'Chicago Zone 03-Newcastle' },    // Triple 4, triple 3
            { id: 77, number: '(773) 888-6666', price: 11999, type: 'vip', state: 'IL', city: 'Chicago Zone 04-Humboldt' },   // Triple 8, triple 6
            { id: 78, number: '(773) 888-7777', price: 11999, type: 'vip', state: 'IL', city: 'Chicago Zone 04-Humboldt' },   // Triple 8, triple 7
            { id: 79, number: '(847) 999-0000', price: 12999, type: 'vip', state: 'IL', city: 'Winnetka' },                   // Triple 9, quad 0
            { id: 80, number: '(312) 888-7777', price: 13999, type: 'vip', state: 'IL', city: 'Chicago Zone 01-Calumet' },    // Triple 8, triple 7
            { id: 81, number: '(312) 777-9999', price: 13999, type: 'vip', state: 'IL', city: 'Chicago Zone 01-Wabash' },     // Triple 7, triple 9
            { id: 82, number: '(312) 444-2222', price: 14999, type: 'vip', state: 'IL', city: 'Chicago Zone 01-Franklin' },   // Triple 4, triple 2
            { id: 83, number: '(779) 888-9999', price: 15999, type: 'vip', state: 'IL', city: 'Rockford' },                   // Triple 8, triple 9
            { id: 84, number: '(773) 888-0000', price: 19999, type: 'vip', state: 'IL', city: 'Chicago Zone 04-Humboldt' }    // Triple 8, quad 0
        ],
        dep: [
            
        ],
        giare: [
            // Basic sequential 0123, 1234 patterns
            { id: 101, number: '(630) 930-0123', price: 149, type: 'giare', state: 'IL' },
            { id: 102, number: '(815) 519-1234', price: 149, type: 'giare', state: 'IL' },
            { id: 103, number: '(773) 896-0123', price: 149, type: 'giare', state: 'IL' },
            { id: 104, number: '(847) 643-2345', price: 129, type: 'giare', state: 'IL' },
            
            // Basic 2345 endings
            { id: 105, number: '(773) 798-2345', price: 129, type: 'giare', state: 'IL' },
            { id: 106, number: '(773) 389-2345', price: 129, type: 'giare', state: 'IL' },
            { id: 107, number: '(773) 985-2345', price: 129, type: 'giare', state: 'IL' },
            { id: 108, number: '(312) 546-3456', price: 149, type: 'giare', state: 'IL' },
            
            // 4567 sequences
            { id: 109, number: '(312) 728-4567', price: 199, type: 'giare', state: 'IL' },
            { id: 110, number: '(773) 537-4567', price: 199, type: 'giare', state: 'IL' },
            { id: 111, number: '(312) 820-4567', price: 199, type: 'giare', state: 'IL' },
            { id: 112, number: '(847) 752-4567', price: 199, type: 'giare', state: 'IL' },
            { id: 113, number: '(847) 957-4567', price: 199, type: 'giare', state: 'IL' },
            
            // 5678 sequences (premium)
            { id: 114, number: '(847) 443-5678', price: 299, type: 'giare', state: 'IL' },
            { id: 115, number: '(847) 780-5678', price: 299, type: 'giare', state: 'IL' },
            { id: 116, number: '(847) 582-5678', price: 299, type: 'giare', state: 'IL' },
            { id: 117, number: '(773) 916-5678', price: 299, type: 'giare', state: 'IL' },
            
            // 6789 sequences (premium)
            { id: 118, number: '(847) 968-6789', price: 399, type: 'giare', state: 'IL' },
            { id: 119, number: '(773) 726-6789', price: 399, type: 'giare', state: 'IL' },
            { id: 120, number: '(847) 860-6789', price: 399, type: 'giare', state: 'IL' },
            { id: 121, number: '(847) 973-6789', price: 399, type: 'giare', state: 'IL' },
            { id: 122, number: '(773) 830-6789', price: 399, type: 'giare', state: 'IL' },
            
            // 7890 endings
            { id: 123, number: '(847) 447-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 124, number: '(773) 819-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 125, number: '(773) 948-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 126, number: '(847) 796-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 127, number: '(847) 920-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 128, number: '(312) 854-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 129, number: '(773) 800-7890', price: 249, type: 'giare', state: 'IL' }, // Nice 800 middle
            { id: 130, number: '(847) 306-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 131, number: '(847) 861-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 132, number: '(773) 873-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 133, number: '(847) 860-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 134, number: '(847) 925-7890', price: 199, type: 'giare', state: 'IL' },
            { id: 135, number: '(312) 957-7890', price: 199, type: 'giare', state: 'IL' }
        ]
    };

    const numberGrid = document.querySelector('.number-grid');
    const categoryButtons = document.querySelectorAll('.category-filter button');
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

    // Navigation function with smooth transitions
    function navigateToPage(pageId) {
        // First hide all sections
        document.querySelectorAll('.page-section, #home').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            targetSection.style.display = 'block';
            setTimeout(() => {
                targetSection.classList.add('active');
            }, 50);

            // Update active state in navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${pageId}`) {
                    link.classList.add('active');
                }
            });

            // Display appropriate numbers for each section
            switch(pageId) {
                case 'home':
                    document.getElementById('home').style.display = 'block';
                    document.getElementById('home').classList.add('active');
                    break;
                case 'contact':
                    document.getElementById('contact').style.display = 'block';
                    break;
                case 'sim-vip':
                    displayNumbers('vip', targetSection.querySelector('.sim-vip-grid'));
                    break;
                case 'sim-so-dep':
                    displayNumbers('dep', targetSection.querySelector('.sim-dep-grid'));
                    break;
                case 'sim-gia-re':
                    displayNumbers('giare', targetSection.querySelector('.sim-giare-grid'));
                    break;
            }
        }
    }

    // Add this function to calculate discounted price
    function calculateDiscountedPrice(originalPrice) {
        return Math.floor(originalPrice * 0.8); // 20% off
    }

    // Modify the createNumberCard function to show both original and discounted price
    function createNumberCard(number) {
        const discountedPrice = calculateDiscountedPrice(number.price);
        return `
            <div class="number-card" data-price="${number.price}">
                <div class="number">${number.number}</div>
                <div class="price">
                    <span class="original-price">$${number.price}</span>
                    <span class="discounted-price">$${discountedPrice}</span>
                </div>
                <div class="discount-badge">-20%</div>
                <button class="add-to-cart" data-translate="addToCart">${translations[currentLanguage].addToCart}</button>
            </div>
        `;
    }

    // Display numbers function
    function displayNumbers(category, targetElement, state = '') {
        const numbers = phoneNumbers[category] || [];
        const filteredNumbers = state 
            ? numbers.filter(num => num.state === state)
            : numbers;
            
        targetElement.innerHTML = filteredNumbers.map(createNumberCard).join('');
        attachCartListeners();
        // Refresh translations for the newly created elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[currentLanguage][key]) {
                element.textContent = translations[currentLanguage][key];
            }
        });
    }

    // Modify the updateCart function to use discounted prices
    function updateCart() {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-number">${item.number}</div>
                    <div class="cart-item-price">
                        <span class="original-price">$${item.price}</span>
                        <span class="discounted-price">$${calculateDiscountedPrice(item.price)}</span>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + calculateDiscountedPrice(item.price), 0);
        cartTotal.textContent = total;
        cartCount.textContent = cart.length;

        // Animate cart count
        cartCount.style.animation = 'none';
        cartCount.offsetHeight; // Trigger reflow
        cartCount.style.animation = 'addToCartAnimation 0.5s ease';

        // Add remove item listeners
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-item').dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });

        const cartFooter = `
            <div class="cart-total">
                Tổng cộng: $<span id="cartTotal">${total}</span>
            </div>
            <button class="checkout-btn" data-translate="checkout">Thanh Toán</button>
        `;
        
        document.querySelector('.cart-footer').innerHTML = cartFooter;
        
        // Add event listener to the newly created button
        document.querySelector('.checkout-btn').addEventListener('click', showCheckoutInfo);
    }

    // Add cart notification to body
    document.body.insertAdjacentHTML('beforeend', `
        <div class="cart-notification">
            Đã thêm vào giỏ hàng!
        </div>
    `);
    const cartNotification = document.querySelector('.cart-notification');

    // Attach cart listeners
    function attachCartListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.number-card');
                const number = card.querySelector('.number').textContent;
                const price = parseFloat(card.dataset.price); // Get price from data attribute
                
                cart.push({ number, price });
                updateCart();
                
                // Visual feedback
                button.textContent = translations[currentLanguage].added || 'Đã thêm';
                button.classList.add('added');
                
                // Show notification
                cartNotification.textContent = translations[currentLanguage].addedToCart || 'Đã thêm vào giỏ hàng!';
                cartNotification.classList.add('show');
                setTimeout(() => {
                    cartNotification.classList.remove('show');
                }, 2000);
                
                // Reset button
                setTimeout(() => {
                    button.textContent = translations[currentLanguage].addToCart || 'Thêm vào giỏ';
                    button.classList.remove('added');
                }, 2000);
            });
        });
    }

    // Cart toggle functionality
    document.querySelector('.cart').addEventListener('click', (e) => {
        e.preventDefault();
        cartOverlay.classList.add('active');
    });

    document.querySelector('.close-cart').addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    // State filter functionality
    document.querySelectorAll('.state-filter').forEach(filter => {
        filter.addEventListener('change', (e) => {
            const selectedState = e.target.value;
            const section = e.target.closest('section');
            const category = section.id.replace('sim-', '').replace('-', '');
            displayNumbers(category, section.querySelector('.number-grid'), selectedState);
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Đang gửi...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Send email using EmailJS
            emailjs.send('service_47m7hgp', 'template_d3v4ric', {
                from_name: formData.name,
                phone_number: formData.phone,
                email: formData.email,
                message: formData.message,
            })
            .then(() => {
                alert('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // Navigation event listeners
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            navigateToPage(pageId || 'home');
        });
    });

    // Handle "Liên Hệ Tư Vấn" button click
    document.querySelector('.hero-buttons .btn.secondary').addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPage('contact');
    });

    // Initialize home page
    navigateToPage('home');

    // Filter functionality for home page
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.textContent.trim().toLowerCase();
            let filterCategory;
            switch(category) {
                case 'tất cả':
                    filterCategory = 'all';
                    break;
                case 'sim vip':
                    filterCategory = 'vip';
                    break;
                case 'sim số đẹp':
                    filterCategory = 'dep';
                    break;
                case 'sim giá rẻ':
                    filterCategory = 'giare';
                    break;
                default:
                    filterCategory = 'all';
            }
            displayNumbers(filterCategory, document.querySelector('#home .number-grid'));
        });
    });

    // Search functionality
    function searchNumbers(query) {
        const filtered = phoneNumbers.filter(number => 
            number.number.toLowerCase().includes(query.toLowerCase())
        );
        displayNumbers(filtered);
    }

    // Search functionality
    searchButton.addEventListener('click', () => {
        searchNumbers(searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchNumbers(searchInput.value);
        }
    });

    // Mobile menu functionality
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
            navLinks.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Add this at the start of your DOMContentLoaded event listener
    emailjs.init("SMqXcp68aZIs-7BoX"); // Replace with your actual public key

    // Add these functions after your existing cart functionality
    function showCheckoutInfo() {
        const checkoutOverlay = document.getElementById('checkoutOverlay');
        cartOverlay.classList.remove('active');
        checkoutOverlay.classList.add('active');
    }

    // Add this to your DOMContentLoaded event listener
    document.querySelector('.close-checkout').addEventListener('click', () => {
        document.getElementById('checkoutOverlay').classList.remove('active');
    });

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('checkout-name').value,
            phone: document.getElementById('checkout-phone').value,
            email: document.getElementById('checkout-email').value,
            cart: cart // This will include the cart items
        };

        // Send email using EmailJS
        emailjs.send('service_47m7hgp', 'template_d3v4ric', {
            from_name: formData.name,
            phone_number: formData.phone,
            email: formData.email,
            message: `Order details:\n${cart.map(item => `${item.number}: $${item.price}`).join('\n')}`,
        })
        .then(() => {
            alert('Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ sớm nhất có thể!');
            cart = [];
            updateCart();
            document.getElementById('checkoutForm').reset();
            document.getElementById('checkoutOverlay').classList.remove('active');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
        });
    });
}); 