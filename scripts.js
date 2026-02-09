// ============================================
// INICIALIZACIÓN Y CONFIGURACIONES GLOBALES
// ============================================

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

// Variable global para controlar el modal
let hasShownModal = false;

// ============================================
// ANIMACIONES DE CARGA Y NAVEGACIÓN
// ============================================

window.addEventListener('load', () => {
  // Animación de la navegación principal
  gsap.to("#main-nav", { 
    y: 0, 
    opacity: 1, 
    duration: 0.8, 
    ease: "expo.out", 
    delay: 0.2 
  });

  // Animación del hero
  const tl = gsap.timeline({ 
    defaults: { ease: "expo.out", duration: 1.5 } 
  });

  tl.to("#main-nav", { y: 0, opacity: 1, duration: 0.8 }, 0.2)
    .to(".hero-img", { scale: 1, duration: 2.5, ease: "power2.inOut" }, 0)
    .fromTo(".hero-title", 
      { y: 100, skewY: 7, opacity: 0 }, 
      { y: 0, skewY: 0, opacity: 1, stagger: 0.1 }, 
      0.4
    )
    .fromTo(".hero-subtitle", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1 }, 
      "-=1.2"
    )
    .to(".hero-description, .hero-cta", { 
      y: 0, 
      opacity: 1, 
      stagger: 0.1, 
      duration: 1 
    }, "-=1")
    .to(".hero-scroll-indicator", { opacity: 1, duration: 0.8 }, "-=0.8")
    .to(".progress-bar", { x: "-75%", duration: 1.5 }, "-=0.5");
});

// ============================================
// TOAST DE STOCK - NOTIFICACIÓN ELEGANTE
// ============================================

const btnComprar = document.getElementById('btn-comprar');
const toast = document.getElementById('toast-stock');

// Sonido opcional para la notificación (puedes eliminar si no quieres)
const playNotificationSound = () => {
  try {
    // Crear un sonido sutil (pitido corto)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (e) {
    // Fallback silencioso si hay error con Audio API
    console.log("Sonido de notificación no disponible");
  }
};

if (btnComprar && toast) {
  btnComprar.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Agregar efecto visual al botón
    btnComprar.classList.add('active:scale-95');
    
    // Pequeña animación de "click" en el botón
    gsap.to(btnComprar, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Mostrar toast
        showToast();
      }
    });
  });
}

function showToast() {
  if (!toast) return;
  
  // Sonido opcional (descomenta si lo quieres)
  // playNotificationSound();
  
  // Reset position
  toast.classList.remove('translate-x-0');
  toast.classList.add('translate-x-[120%]');
  
  // Pequeño delay para reset
  setTimeout(() => {
    // Mostrar con animación suave
    toast.classList.remove('translate-x-[120%]');
    toast.classList.add('translate-x-0');
    
    // Efecto adicional con GSAP para entrada más dinámica
    gsap.fromTo(toast,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
    );
    
    // Ocultar después de 2 segundos
    setTimeout(() => {
      hideToast();
    }, 2000);
  }, 10);
}

function hideToast() {
  if (!toast) return;
  
  // Ocultar con animación
  toast.classList.remove('translate-x-0');
  toast.classList.add('translate-x-[120%]');
  
  // Animación GSAP para salida
  gsap.to(toast, {
    x: 100,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  });
}

// Cerrar toast al hacer click
if (toast) {
  toast.addEventListener('click', hideToast);
  
  // También cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !toast.classList.contains('translate-x-[120%]')) {
      hideToast();
    }
  });
}
// Navegación con scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (window.scrollY > 40) { 
    nav.classList.add('backdrop-blur-xl', 'bg-black/80', 'border-white/5'); 
    nav.classList.remove('border-transparent'); 
  } else { 
    nav.classList.remove('backdrop-blur-xl', 'bg-black/80', 'border-white/5'); 
    nav.classList.add('border-transparent'); 
  }
});

// ============================================
// MENÚ MÓVIL
// ============================================

const mobileBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-mobile-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Estado inicial
if (mobileMenu) {
  gsap.set(mobileMenu, { x: "100%" });
}

// Función para alternar menú
const toggleMenu = (open) => {
  if (!mobileMenu) return;
  
  if (open) {
    // Abrir menú
    gsap.to(mobileMenu, {
      x: "0%",
      duration: 0.6,
      ease: "power3.out",
      overwrite: true
    });
    mobileMenu.classList.add('active');
  } else {
    // Cerrar menú
    gsap.to(mobileMenu, {
      x: "100%",
      duration: 0.5,
      ease: "power3.in",
      overwrite: true,
      onComplete: () => {
        mobileMenu.classList.remove('active');
      }
    });
  }
};

// Event listeners
if (mobileBtn) mobileBtn.addEventListener('click', () => toggleMenu(true));
if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggleMenu(false);
  });
});

// ============================================
// MODAL Y REPRODUCTOR DE AUDIO
// ============================================

const modal = document.getElementById('infoModal');
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const muteIcon = document.getElementById('muteIcon');

// Mostrar modal al hacer scroll
window.addEventListener('scroll', () => {
  if (hasShownModal) return;
  const enviosSection = document.getElementById('envios');
  if (enviosSection) {
    const rect = enviosSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.8) { 
      openModal(); 
      hasShownModal = true; 
    }
  }
});

// Funciones del modal
function openModal() { 
  modal.classList.remove('hidden'); 
  modal.classList.add('flex'); 
  document.body.style.overflow = 'hidden'; 
}

function closeModal() { 
  modal.classList.add('hidden'); 
  modal.classList.remove('flex'); 
  document.body.style.overflow = ''; 
  audio.pause(); 
  audio.currentTime = 0; 
  updatePlayButton(); 
}

function togglePlay() { 
  if (audio.paused) { 
    audio.play(); 
  } else { 
    audio.pause(); 
  } 
  updatePlayButton(); 
}

function updatePlayButton() { 
  if (audio.paused) { 
    playIcon.classList.remove('hidden'); 
    pauseIcon.classList.add('hidden'); 
  } else { 
    playIcon.classList.add('hidden'); 
    pauseIcon.classList.remove('hidden'); 
  } 
}

function skip(seconds) { 
  audio.currentTime += seconds; 
}

function toggleMute() { 
  audio.muted = !audio.muted; 
  if (audio.muted) { 
    volumeIcon.classList.add('hidden'); 
    muteIcon.classList.remove('hidden'); 
  } else { 
    volumeIcon.classList.remove('hidden'); 
    muteIcon.classList.add('hidden'); 
  } 
}

function formatTime(seconds) { 
  if(isNaN(seconds)) return "0:00"; 
  const mins = Math.floor(seconds / 60); 
  const secs = Math.floor(seconds % 60); 
  return `${mins}:${secs.toString().padStart(2, '0')}`; 
}

// Event listeners del audio
audio.addEventListener('timeupdate', () => { 
  if (audio.duration) { 
    const progress = (audio.currentTime / audio.duration) * 100; 
    progressBar.style.width = `${progress}%`; 
    currentTimeEl.textContent = formatTime(audio.currentTime); 
  } 
});

audio.addEventListener('loadedmetadata', () => { 
  durationEl.textContent = formatTime(audio.duration); 
});

progressContainer.addEventListener('click', (e) => { 
  const rect = progressContainer.getBoundingClientRect(); 
  const percent = (e.clientX - rect.left) / rect.width; 
  audio.currentTime = percent * audio.duration; 
});

// ============================================
// BOTÓN DE WHATSAPP
// ============================================

function showWhatsAppBtn() {
  gsap.to("#whatsapp-btn", {
    autoAlpha: 1,
    y: 0,
    duration: 1.8,
    ease: "elastic.out(1, 0.5)",
    delay: 0.5
  });
}

// Mostrar botón de WhatsApp al cerrar el modal
const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"], .close-modal');
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    showWhatsAppBtn();
  });
});

// También detectar cierre del modal por otras vías
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "class" || mutation.attributeName === "style") {
      const isHidden = modal.classList.contains('hidden') || modal.style.display === 'none';
      if (isHidden) {
        showWhatsAppBtn();
      }
    }
  });
});

observer.observe(modal, { attributes: true });

// ============================================
// TIENDA - PRODUCTOS Y FILTROS
// ============================================

const products = [
    { id: 1, brand: 'iPhone', brandName: 'iPhone 15 Pro Max', brandColor: 'text-blue-400', title: 'iPhone 15 Pro Max 256GB', specs: 'Titanio Natural • A17 Pro • Triple Cámara 48MP • Dynamic Island', rating: 5, reviews: 127, price: 42999, oldPrice: 45999, discount: 7, stock: 'En Stock', stockClass: 'stock-badge bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-1.jpg' },

    { id: 2, brand: 'Samsung', brandName: 'Samsung Galaxy', brandColor: 'text-purple-400', title: 'Galaxy S24 Ultra 512GB', specs: 'Titanio Gris • Snapdragon 8 Gen 3 • S Pen • 200MP Camera', rating: 4, reviews: 98, price: 57999, oldPrice: 62999, discount: 8, stock: 'En Stock', stockClass: 'stock-badge bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-2.jpg' },

    { id: 3, brand: 'Xiaomi', brandName: 'Xiaomi', brandColor: 'text-orange-400', title: 'Xiaomi 14 Pro 256GB', specs: 'Negro • Snapdragon 8 Gen 3 • Leica Camera • 120W Fast Charge', rating: 5, reviews: 156, price: 36999, oldPrice: 41999, discount: 12, stock: 'Últimas 3 unidades', stockClass: 'stock-badge bg-yellow-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-3.jpg' },

    { id: 4, brand: 'Google', brandName: 'Google Pixel', brandColor: 'text-green-400', title: 'Pixel 8 Pro 128GB', specs: 'Obsidiana • Google Tensor G3 • AI Camera • 7 años de updates', rating: 4, reviews: 84, price: 39999, oldPrice: 44999, discount: 11, stock: 'En Stock', stockClass: 'stock-badge bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-4.jpg' },

    { id: 5, brand: 'OnePlus', brandName: 'OnePlus', brandColor: 'text-red-400', title: 'OnePlus 12 256GB', specs: 'Verde Flowy • Snapdragon 8 Gen 3 • 120Hz LTPO • 100W Charging', rating: 5, reviews: 203, price: 39999, oldPrice: 44999, discount: 11, stock: 'En Stock', stockClass: 'stock-badge bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-5.jpg' },

    { id: 6, brand: 'iPhone', brandName: 'iPhone 14', brandColor: 'text-blue-400', title: 'iPhone 14 Pro 128GB', specs: 'Morado Oscuro • A16 Bionic • Dynamic Island • Ceramic Shield', rating: 4, reviews: 312, price: 38999, oldPrice: 42999, discount: 9, stock: 'Últimas 5 unidades', stockClass: 'stock-badge bg-yellow-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-6.jpg' },

    { id: 7, brand: 'Samsung', brandName: 'Samsung Galaxy', brandColor: 'text-purple-400', title: 'Galaxy Z Fold 5 512GB', specs: 'Phantom Black • Snapdragon 8 Gen 2 • Plegable • S Pen Integrado', rating: 5, reviews: 89, price: 82999, oldPrice: 89999, discount: 8, stock: 'En Stock', stockClass: 'stock-badge bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-7.jpg' },

    { id: 8, brand: 'iPhone', brandName: 'iPhone 15', brandColor: 'text-blue-400', title: 'iPhone 15 128GB', specs: 'Rosa • A16 Bionic • Cámara 48MP • USB-C • 20 horas batería', rating: 5, reviews: 245, price: 58999, oldPrice: 62999, discount: 6, stock: 'En Stock', stockClass: 'stock-badge bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase', image: 'img/cel-8.jpg' }
  ];

function generateStars(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += `<svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ${i < rating ? 'text-yellow-400' : 'text-gray-600'}" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`;
  }
  return stars;
}

function createProductCard(product) {
  return `
    <div class="product-card bg-zinc-900/50 rounded-xl overflow-hidden" data-brand="${product.brand}">
      <div class="product-image-container relative">
        ${product.discount > 0 ? `<div class="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">-${product.discount}%</div>` : ''}
        <span class="${product.stockClass}">${product.stock}</span>
        <img src="${product.image}" alt="${product.title}" onerror="this.src='https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&crop=center';" class="w-full h-full object-contain">
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold uppercase tracking-wide ${product.brandColor}">${product.brandName}</span><div class="flex gap-1">${generateStars(product.rating)}</div></div>
        <h3 class="text-base font-bold mb-1 leading-tight line-clamp-1">${product.title}</h3>
        <p class="product-specs text-xs text-gray-400 mb-3 leading-relaxed">${product.specs}</p>
        <div class="flex items-baseline justify-between mb-4">
          <div><span class="price text-xl font-bold">RD$${product.price.toLocaleString()}</span>${product.oldPrice ? `<div class="flex items-center gap-1 mt-1"><span class="text-xs text-gray-500 line-through">RD$${product.oldPrice.toLocaleString()}</span><span class="text-xs text-green-400 font-semibold">Ahorras RD$${(product.oldPrice - product.price).toLocaleString()}</span></div>` : ''}</div>
          <span class="text-[0.55rem] text-gray-500">(${product.reviews})</span>
        </div>
        <button class="add-to-cart-btn w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all duration-300 text-sm" data-id="${product.id}">
          <span class="flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Agregar al Carrito</span>
        </button>
      </div>
    </div>`;
}

let currentFilter = 'all';
let visibleProducts = 8;
const productsPerLoad = 4;

function renderProducts(filter = 'all', limit = visibleProducts) {
  const productsGrid = document.getElementById('productsGrid');
  const filterIndicator = document.getElementById('filterIndicator');
  const filterCount = document.getElementById('filterCount');
  const filterBrand = document.getElementById('filterBrand');
  
  let filteredProducts = products;
  if (filter !== 'all') filteredProducts = products.filter(product => product.brand === filter);
  
  const productsToShow = filteredProducts.slice(0, limit);
  
  filterIndicator.classList.toggle('hidden', filter === 'all');
  filterCount.textContent = filteredProducts.length;
  filterBrand.textContent = filter !== 'all' ? ` de ${filter}` : '';

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `<div class="no-results col-span-full"><div class="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div><h3 class="text-lg font-bold mb-2 text-white">No encontramos productos</h3><p class="text-gray-400">Intenta con otra categoría o vuelve más tarde.</p></div>`;
    return;
  }
  
  productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
  document.getElementById('loadMoreBtn').classList.toggle('hidden', limit >= filteredProducts.length);
}

// Inicializar productos
renderProducts();

// Event listeners para filtros
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', function() {
    const filter = this.getAttribute('data-filter');
    document.querySelectorAll('.filter-btn').forEach(b => { 
      b.classList.remove('active-filter'); 
      b.classList.add('bg-zinc-900', 'border', 'border-white/10', 'text-white'); 
    });
    this.classList.remove('bg-zinc-900', 'border', 'border-white/10', 'text-white'); 
    this.classList.add('active-filter');
    currentFilter = filter; 
    visibleProducts = 8;
    renderProducts(filter, visibleProducts);
    document.getElementById('tienda').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Cargar más productos
document.getElementById('loadMoreBtn').addEventListener('click', function() { 
  visibleProducts += productsPerLoad; 
  renderProducts(currentFilter, visibleProducts); 
});

// Agregar al carrito
document.addEventListener('click', function(e) {
  if (e.target.closest('.add-to-cart-btn')) {
    const btn = e.target.closest('.add-to-cart-btn');
    const productId = btn.getAttribute('data-id');
    const product = products.find(p => p.id == productId);
    
    btn.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Agregando...</span>`;
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> ¡Agregado!</span>`;
      btn.classList.remove('from-blue-600', 'to-blue-700'); 
      btn.classList.add('from-green-600', 'to-green-700');
      showNotification(`${product.title} agregado al carrito`);
      
      setTimeout(() => {
        btn.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Agregar al Carrito</span>`;
        btn.classList.remove('from-green-600', 'to-green-700'); 
        btn.classList.add('from-blue-600', 'to-blue-700'); 
        btn.disabled = false;
      }, 2000);
    }, 500);
  }
});

// Notificaciones
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slideIn border border-green-500/20';
  notification.innerHTML = `<div class="flex items-center gap-3"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span class="text-sm font-medium">${message}</span></div>`;
  document.body.appendChild(notification);
  
  setTimeout(() => { 
    notification.classList.add('opacity-0', 'translate-x-full'); 
    setTimeout(() => { notification.remove(); }, 300); 
  }, 2500);
}

// Estilo para animación de notificación
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slideIn { animation: slideIn 0.3s ease-out; }`;
document.head.appendChild(style);

// ============================================
// ANIMACIONES DE SCROLL PARA SECCIONES
// ============================================

// Función para configurar animaciones de scroll sin conflicto
function setupScrollAnimations() {
  // ANIMACIÓN PARA SECCIÓN OFERTAS
  const ofertasSection = document.querySelector('#ofertas');
  if (ofertasSection) {
    // Elemento izquierdo (texto)
    const leftElement = ofertasSection.querySelector('.grid > div:first-child');
    // Elemento derecho (imagen)
    const rightElement = ofertasSection.querySelector('.grid > div:last-child');
    
    // Configurar estado inicial
    gsap.set([leftElement, rightElement], { opacity: 0 });
    
    // Crear ScrollTriggers con configuración segura
    gsap.to(leftElement, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ofertasSection,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
        // IMPORTANTE: Evitar que se revierta
        onEnter: () => {
          leftElement.classList.add('permanent-visible');
        },
        onEnterBack: () => {
          leftElement.classList.add('permanent-visible');
        }
      }
    });
    
    gsap.to(rightElement, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ofertasSection,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
        // IMPORTANTE: Evitar que se revierta
        onEnter: () => {
          rightElement.classList.add('permanent-visible');
        },
        onEnterBack: () => {
          rightElement.classList.add('permanent-visible');
        }
      }
    });
  }
  
  // ANIMACIÓN PARA SECCIÓN CONTACTO
  const contactoSection = document.querySelector('#contacto');
  if (contactoSection) {
    // Título
    const titleElement = contactoSection.querySelector('.text-center');
    // Contenedor del mapa
    const mapElement = contactoSection.querySelector('.max-w-5xl');
    
    // Configurar estado inicial
    gsap.set([titleElement, mapElement], { opacity: 0 });
    
    // Animación del título
    gsap.to(titleElement, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: contactoSection,
        start: 'top 85%',
        toggleActions: 'play none none none',
        // IMPORTANTE: Evitar que se revierta
        onEnter: () => {
          titleElement.classList.add('permanent-visible');
        },
        onEnterBack: () => {
          titleElement.classList.add('permanent-visible');
        }
      }
    });
    
    // Animación del mapa
    gsap.to(mapElement, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: contactoSection,
        start: 'top 75%',
        toggleActions: 'play none none none',
        // IMPORTANTE: Evitar que se revierta
        onEnter: () => {
          mapElement.classList.add('permanent-visible');
        },
        onEnterBack: () => {
          mapElement.classList.add('permanent-visible');
        }
      }
    });
  }
}

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupScrollAnimations);

// Reiniciar animaciones en resize (opcional)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Matar todos los ScrollTriggers existentes
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    // Volver a configurar
    setupScrollAnimations();
  }, 250);
});

// ============================================
// FUNCIONES GLOBALES PARA EL MODAL
// ============================================

// Hacer las funciones disponibles globalmente para los onclick
window.openModal = openModal;
window.closeModal = closeModal;
window.togglePlay = togglePlay;
window.skip = skip;
window.toggleMute = toggleMute;

// ============================================
// ANIMACIONES PARA LAS 3 SECCIONES PRINCIPALES
// ============================================

function setupSectionsAnimations() {
  // Definir las 3 secciones objetivo
  const sections = [
    { id: '#technology', name: 'technology' },
    { id: '#ofertas', name: 'ofertas' },
    { id: '#contacto', name: 'contacto' }
  ];

  // Recorrer cada sección
  sections.forEach(section => {
    const sectionElement = document.querySelector(section.id);
    if (!sectionElement) return;

    // Encontrar elementos dentro de la sección
    const contentElements = sectionElement.querySelectorAll('.section-content');
    const imageElements = sectionElement.querySelectorAll('.section-image');

    // Configurar estado inicial con GSAP (no con CSS)
    gsap.set([...contentElements, ...imageElements], {
      opacity: 0,
      y: 40,
      scale: 0.98
    });

    // Crear animación con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionElement,
        start: 'top 75%', // Empieza cuando el 75% de la sección está visible
        end: 'bottom 25%',
        toggleActions: 'play none none none', // SOLO se anima al entrar
        once: true, // IMPORTANTE: Solo se anima una vez
        markers: false, // Cambia a true para debug
        onEnter: () => {
          // Añadir clase permanente después de la animación
          setTimeout(() => {
            [...contentElements, ...imageElements].forEach(el => {
              el.classList.add('is-visible');
            });
          }, 600);
        }
      }
    });

    // Animación para elementos de contenido
    if (contentElements.length > 0) {
      tl.to(contentElements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2
      }, 0);
    }

    // Animación para imágenes
    if (imageElements.length > 0) {
      tl.to(imageElements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      }, 0.3); // Delay de 0.3s después del contenido
    }
  });
}

// ============================================
// ANIMACIÓN ALTERNATIVA (MÁS SIMPLE) - ELIGE UNA
// ============================================

function setupSimpleSectionsAnimations() {
  // Esta es una versión más simple y robusta
  const sections = document.querySelectorAll('#technology, #ofertas, #contacto');
  
  sections.forEach(section => {
    // Obtener todos los elementos animables dentro de la sección
    const animatables = section.querySelectorAll('.section-content, .section-image, .text-center, .max-w-5xl');
    
    // Configurar estado inicial
    gsap.set(animatables, { opacity: 0, y: 30 });
    
    // Crear ScrollTrigger para cada sección
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      once: true, // Solo una vez
      onEnter: () => {
        // Animación con GSAP (sin timeline)
        gsap.to(animatables, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          onComplete: () => {
            // Añadir clase permanente
            animatables.forEach(el => el.classList.add('is-visible'));
          }
        });
      }
    });
  });
}

// ============================================
// INICIALIZACIÓN - EJECUTAR CUANDO EL DOM ESTÉ LISTO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Esperar un poco para asegurar que todo esté cargado
  setTimeout(() => {
    // ELIGE UNA DE LAS DOS FUNCIONES:
    // Opción 1: Animación más controlada (recomendada)
    setupSectionsAnimations();
    
    // Opción 2: Animación más simple
    // setupSimpleSectionsAnimations();
  }, 500);
});

// ============================================
// REINICIAR ANIMACIONES EN RESIZE (OPCIONAL)
// ============================================

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Matar ScrollTriggers antiguos
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger && 
          (trigger.trigger.id === 'technology' || 
           trigger.trigger.id === 'ofertas' || 
           trigger.trigger.id === 'contacto')) {
        trigger.kill();
      }
    });
    
    // Volver a inicializar
    setupSectionsAnimations();
  }, 250);
});