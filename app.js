// Estado da Aplicação
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'popular';
let activeModalProduct = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initCategoryFilters();
  initSearch();
  initSort();
  initCouponForm();
  initCheckoutFlow();
  initCustomQuoteForm();
  initFaqAccordion();
  initMobileMenu();
});

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
    info: 'bg-slate-900/95 border-amber-500/50 text-amber-200'
  };

  const icons = {
    success: '<svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
    error: '<svg class="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
    info: '<svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md animate-toast max-w-sm text-sm font-medium ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Renderização do Catálogo de Produtos
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('products-counter');
  if (!grid) return;

  let filtered = PRODUCTS_DATA.filter(p => {
    const matchesCat = currentCategory === 'all' || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Ordenação
  if (currentSort === 'avaliacao') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (currentSort === 'nome') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // popular
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-200">Nenhum produto encontrado</h3>
        <p class="text-sm text-slate-400 mt-1 max-w-sm mx-auto">Tente ajustar a busca ou limpar os filtros de categoria.</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-sm font-semibold border border-amber-500/30 transition">
          Ver todos os produtos
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    let showcaseBg = 'bg-[#0f141f]';
    let showcasePad = 'p-2';
    let imgClass = '';
    
    if (p.bgTheme === 'white') {
      showcaseBg = 'bg-white';
      showcasePad = 'p-3';
      imgClass = 'drop-shadow-md';
    } else if (p.bgTheme === 'warm') {
      showcaseBg = 'bg-[#f5ede3]';
      showcasePad = 'p-2';
      imgClass = 'drop-shadow-sm';
    } else {
      showcaseBg = 'bg-[#0f141f]';
      showcasePad = 'p-2';
      imgClass = 'drop-shadow-lg';
    }

    return `
      <div class="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden card-hover-effect">
        <!-- Badge Superior -->
        <div class="absolute top-3 left-3 z-10 flex gap-2 pointer-events-none">
          <span class="text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${p.badgeColor}">
            ${p.badge}
          </span>
        </div>

        <!-- Botão Visualização Rápida no Hover -->
        <button onclick="openProductModal('${p.id}')" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center border border-slate-700/60 transition shadow-lg opacity-90 group-hover:opacity-100" title="Ver detalhes do produto">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        </button>

        <!-- Imagem do Produto Padronizada e Enquadrada (Sem Cortes) -->
        <div class="relative w-full aspect-square bg-[#0b0f17] p-2.5 overflow-hidden cursor-pointer flex items-center justify-center border-b border-slate-800/80" onclick="openProductModal('${p.id}')">
          <div class="relative w-full h-full rounded-xl overflow-hidden ${showcaseBg} flex items-center justify-center ${showcasePad} border border-slate-800/40 shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${imgClass}" loading="lazy" />
          </div>
        </div>

        <!-- Conteúdo do Card -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span class="font-medium text-amber-500/90">${p.categoryName}</span>
              <div class="flex items-center gap-1 text-amber-400">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="font-bold text-slate-200">${p.rating.toFixed(1)}</span>
                <span class="text-slate-500 text-[11px]">(${p.reviewsCount})</span>
              </div>
            </div>

            <h3 class="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer" onclick="openProductModal('${p.id}')">
              ${p.name}
            </h3>

            <p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              ${p.shortDesc}
            </p>
          </div>

          <!-- Preço & Botão Adicionar -->
          <div class="pt-4 mt-4 border-t border-slate-800/80 flex items-end justify-between gap-2">
            <div>
              <div class="text-[11px] text-slate-400">Condição</div>
              <div class="text-sm sm:text-base font-black text-amber-400 leading-tight">Valor Sob Consulta</div>
              <div class="text-[10px] text-emerald-400 font-medium mt-0.5">Orçamento sem compromisso</div>
            </div>

            <button onclick="cartManager.addItem('${p.id}')" class="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95" title="Adicionar ao pedido de orçamento">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Filtros de Categoria
function initCategoryFilters() {
  const buttons = document.querySelectorAll('.category-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-lg', 'shadow-amber-500/20');
        b.classList.add('bg-slate-900', 'text-slate-300', 'hover:bg-slate-800');
      });

      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-lg', 'shadow-amber-500/20');
      btn.classList.remove('bg-slate-900', 'text-slate-300', 'hover:bg-slate-800');

      currentCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });
}

function resetFilters() {
  currentCategory = 'all';
  searchQuery = '';
  const searchInput = document.getElementById('search-products-input');
  if (searchInput) searchInput.value = '';
  
  const buttons = document.querySelectorAll('.category-filter-btn');
  buttons.forEach(b => {
    if (b.getAttribute('data-category') === 'all') {
      b.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      b.classList.remove('bg-slate-900', 'text-slate-300');
    } else {
      b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      b.classList.add('bg-slate-900', 'text-slate-300');
    }
  });

  renderProducts();
}

// Busca em Tempo Real
function initSearch() {
  const searchInput = document.getElementById('search-products-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }
}

// Ordenação
function initSort() {
  const sortSelect = document.getElementById('sort-products-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }
}

// Modal de Detalhes do Produto
function openProductModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  activeModalProduct = product;
  const modal = document.getElementById('product-detail-modal');
  const content = document.getElementById('product-modal-content');
  if (!modal || !content) return;

  let selectedColor = product.colors && product.colors[0] ? product.colors[0] : 'Padrão';

  let showcaseBg = 'bg-[#0f141f]';
  let showcasePad = 'p-4';
  let imgClass = 'drop-shadow-xl';

  if (product.bgTheme === 'white') {
    showcaseBg = 'bg-white';
    showcasePad = 'p-6';
    imgClass = 'drop-shadow-md';
  } else if (product.bgTheme === 'warm') {
    showcaseBg = 'bg-[#f5ede3]';
    showcasePad = 'p-4';
    imgClass = 'drop-shadow-sm';
  }

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <!-- Imagem Principal -->
      <div class="relative rounded-2xl overflow-hidden aspect-square ${showcaseBg} ${showcasePad} border border-slate-800 flex items-center justify-center">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full max-h-[380px] object-contain ${imgClass}" />
        <span class="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${product.badgeColor}">
          ${product.badge}
        </span>
      </div>

      <!-- Informações do Produto -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 text-xs text-amber-500 font-medium mb-1">
            <span>${product.categoryName}</span>
            <div class="flex items-center gap-1 text-amber-400">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <span class="font-bold text-white">${product.rating.toFixed(1)}</span>
              <span class="text-slate-400">(${product.reviewsCount} clientes avaliaram)</span>
            </div>
          </div>

          <h2 class="text-xl font-black text-white leading-tight">${product.name}</h2>

          <div class="mt-3 flex items-center gap-3">
            <span class="text-2xl font-black text-amber-400">Valor Sob Consulta</span>
            <span class="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full">Orçamento Rápido via WhatsApp</span>
          </div>

          <p class="text-sm text-slate-300 mt-4 leading-relaxed">${product.fullDesc}</p>

          <!-- Variação de Cores -->
          ${product.colors ? `
            <div class="mt-5">
              <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Selecione a Cor / Acabamento:</label>
              <div class="flex flex-wrap gap-2" id="modal-color-options">
                ${product.colors.map((color, idx) => `
                  <button type="button" onclick="selectModalColor('${color}')" class="modal-color-btn px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${idx === 0 ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'}">
                    ${color}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Especificações Técnicas -->
          <div class="mt-5 pt-4 border-t border-slate-800">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ficha Técnica & Cuidados:</h4>
            <div class="grid grid-cols-2 gap-2 text-xs">
              ${Object.entries(product.specs).map(([key, val]) => `
                <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                  <span class="text-slate-400 capitalize block font-medium">${key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span class="text-slate-200 font-semibold">${val}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Ações do Modal -->
        <div class="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
          <button onclick="handleModalAdd(false)" class="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-plus text-amber-400"></i>
            Adicionar à Lista
          </button>
          <button onclick="handleModalAdd(true)" class="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
            <span>Solicitar Orçamento</span>
            <i class="fa-brands fa-whatsapp text-base"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

let activeSelectedColor = null;

function selectModalColor(color) {
  activeSelectedColor = color;
  const buttons = document.querySelectorAll('.modal-color-btn');
  buttons.forEach(btn => {
    if (btn.textContent.trim() === color) {
      btn.className = 'modal-color-btn px-3 py-1.5 text-xs font-semibold rounded-lg border transition bg-amber-500 text-slate-950 border-amber-400 font-bold';
    } else {
      btn.className = 'modal-color-btn px-3 py-1.5 text-xs font-semibold rounded-lg border transition bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500';
    }
  });
}

function handleModalAdd(openDrawerDirectly) {
  if (!activeModalProduct) return;
  const color = activeSelectedColor || (activeModalProduct.colors ? activeModalProduct.colors[0] : 'Padrão');
  cartManager.addItem(activeModalProduct.id, 1, color);
  closeProductModal();

  if (openDrawerDirectly) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer) drawer.classList.remove('translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
  }
}

function closeProductModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.add('hidden');
  activeModalProduct = null;
  activeSelectedColor = null;
}

// Cupom de Desconto
function initCouponForm() {
  const form = document.getElementById('cart-coupon-form');
  const input = document.getElementById('cart-coupon-input');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      cartManager.applyCoupon(input.value);
      input.value = '';
    }
  });
}

// Fluxo de Checkout e Envio do Orçamento
function initCheckoutFlow() {
  const deliveryRadios = document.querySelectorAll('input[name="delivery-method-choice"]');

  if (deliveryRadios) {
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        cartManager.setDeliveryMethod(e.target.value);
        const addressField = document.getElementById('checkout-address-container');
        if (addressField) {
          if (e.target.value === 'envio') {
            addressField.classList.remove('hidden');
          } else {
            addressField.classList.add('hidden');
          }
        }
      });
    });
  }

  const submitBtn = document.getElementById('cart-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('checkout-name');
      const phoneInput = document.getElementById('checkout-phone');
      const addressInput = document.getElementById('checkout-address');
      const notesInput = document.getElementById('checkout-notes');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (cartManager.items.length === 0) {
        showToast('Sua lista de peças está vazia. Adicione itens do catálogo!', 'info');
        return;
      }

      if (!name) {
        showToast('Por favor, informe seu nome para o orçamento.', 'error');
        if (nameInput) {
          nameInput.focus();
          nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      if (!phone) {
        showToast('Por favor, informe seu WhatsApp de contato.', 'error');
        if (phoneInput) {
          phoneInput.focus();
          phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const waUrl = cartManager.generateWhatsAppUrl({
        name,
        phone,
        address,
        notes
      });
      window.open(waUrl, '_blank');
      showToast('Abrindo WhatsApp oficial da Trezzy 3D...', 'success');
    });
  }
}

// Formulário de Orçamento Sob Medida / STL
function initCustomQuoteForm() {
  const form = document.getElementById('custom-quote-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const projectType = document.getElementById('quote-project-type')?.value;
    const material = document.getElementById('quote-material')?.value;
    const approxSize = document.getElementById('quote-size')?.value;
    const color = document.getElementById('quote-color')?.value;
    const fileUrl = document.getElementById('quote-file')?.value;
    const details = document.getElementById('quote-details')?.value;
    const name = document.getElementById('quote-name')?.value;

    let msg = `⚙️ *SOLICITAÇÃO DE ORÇAMENTO 3D - TREZZY 3D* ⚙️\n`;
    msg += `Olá! Gostaria de um orçamento para impressão 3D personalizada:\n\n`;
    msg += `• *Tipo de Projeto:* ${projectType}\n`;
    msg += `• *Material Desejado:* ${material}\n`;
    msg += `• *Tamanho/Dimensões Aprox.:* ${approxSize || 'A definir'}\n`;
    msg += `• *Cor Preferida:* ${color || 'Qualquer'}\n`;
    if (fileUrl) {
      msg += `• *Link do Arquivo 3D (Thingiverse/Drive/Printables):* ${fileUrl}\n`;
    }
    msg += `• *Descrição / Finalidade:* ${details || 'Conforme fotos ou medidas'}\n`;
    msg += `• *Solicitante:* ${name || 'Cliente'}\n\n`;
    msg += `Aguardo análise para combinarmos o prazo e valor. Obrigado!`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${TREZZY_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
    showToast('Abrindo WhatsApp para enviar seu projeto!', 'success');
  });
}

// FAQ Accordion
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      
      const isOpen = !content.classList.contains('hidden');
      if (isOpen) {
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
      } else {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

// Menu Mobile
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(l => l.addEventListener('click', () => {
    menu.classList.add('hidden');
  }));
}

// Ações para Packs STL Digitais
function buyStlPack(packName, price) {
  const msg = `⚙️ *COMPRA DE PACK STL - TREZZY 3D* ⚙️\nOlá! Gostaria de adquirir o *${packName}* no valor promocional de *${price}* no PIX.\n\nPoderiam me enviar a chave PIX e o link para liberação imediata dos arquivos digitais? Obrigado!`;
  const waUrl = `https://wa.me/${TREZZY_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  showToast(`Abrindo WhatsApp para adquirir o ${packName}!`, 'success');
}

function requestFreeStlPack() {
  const nameInput = document.getElementById('free-stl-name');
  const phoneInput = document.getElementById('free-stl-phone');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!name) {
    showToast('Por favor, informe seu nome para receber o pack gratuito.', 'error');
    if (nameInput) nameInput.focus();
    return;
  }

  if (!phone) {
    showToast('Por favor, informe seu WhatsApp para envio do link.', 'error');
    if (phoneInput) phoneInput.focus();
    return;
  }

  let msg = `🎁 *SOLICITAÇÃO DE PACK GRATUITO (12 STLs) - TREZZY 3D* 🎁\n`;
  msg += `Olá! Vi o *Pack Organização Essencial Gratuito* no site da Trezzy 3D e gostaria de receber o link de download.\n\n`;
  msg += `👤 *Nome:* ${name}\n`;
  msg += `📱 *WhatsApp:* ${phone}\n\n`;
  msg += `Poderiam me enviar o link dos 12 arquivos STL? Muito obrigado!`;

  const waUrl = `https://wa.me/${TREZZY_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  showToast('Abrindo WhatsApp para enviar seu Pack Grátis!', 'success');
}

// Catálogo Detalhado de Modelos para Prévia Interativa
const STL_PACK_PREVIEWS = {
  free: {
    title: 'Pack Organização Essencial (12 STLs)',
    category: '🎁 Presente Exclusivo da Trezzy 3D • 100% Gratuito',
    badge: '12 Arquivos STL • FDM & Resina',
    items: [
      '📱 Suporte de Celular Articulado Dobrável (Desktop Stand)',
      '🔌 Organizadores de Cabos & Dutos com Encaixe Rápido para Mesa',
      '📐 Suporte Hexagonal para Chaves, Ferramentas e Canetas',
      '📦 Mini Gaveteiro Modular de Encaixe para Bancada',
      '🗃️ Caixa Organizadora Multiuso com Tampa Deslizante',
      '🧵 Clip Fixador para Carretel de Filamento 1.75mm',
      '💳 Porta-Cartões de Visita Minimalista para Mesa',
      '🏷️ Suporte Expositor de Crachá & Cartões',
      '🗂️ Organizador Compacto de Cartões SD & MicroSD',
      '📎 Prendedor Articulado para Embalagens de Filamento',
      '📏 Bloco de Teste & Calibragem Rápida de Impressão 3D',
      '🛡️ Protetor de Canto & Batente Anti-Impacto para Móveis'
    ],
    cta: 'requestFreeStlPack()',
    ctaText: 'Baixar Meus 12 STLs Gratuitamente'
  },
  org: {
    title: 'Pack 01 - Organização & Oficina (80 STLs)',
    category: '🧰 Oficina, Bancada & Setup Profissional',
    badge: '80 Arquivos STL • R$ 29,90 no PIX',
    items: [
      '🧰 Sistema Gridfinity Completo: Caixas 1x1, 1x2, 2x2, 2x3 com Divisórias',
      '🔧 Suportes de Parede & Painel Perfurado para Alicates e Chaves',
      '⚙️ Organizador Giratório para Bits de Parafusadeira (1/4")',
      '🔌 Canaletas de Cabos Articuladas com Encaixe Snap-Fit',
      '🎧 Suporte Robusto de Mesa & Parede para Headset Gamer',
      '🧵 Racks Modulares para Armazenamento de Carretéis de Filamento',
      '🗄️ Gaveteiros Industriais Empilháveis com Guias de Encaixe',
      '📐 Gabaritos de Ângulo e Esquadros de Alta Precisão',
      '📦 Caixas Robustas com Travas Articuladas Print-in-Place',
      '🛠️ Suporte Universal para Ferro de Solda, Estanho e Pinças'
    ],
    cta: "buyStlPack('Pack 01 - Organização & Escritório (80 STLs)', 'R$ 29,90')",
    ctaText: 'Comprar Pack Organização (R$ 29,90)'
  },
  toys: {
    title: 'Pack 02 - Brinquedos & Articulados (120 STLs)',
    category: '🔥 Print-in-Place • Sensação Maker • Zero Montagem',
    badge: '120 Arquivos STL • R$ 39,90 no PIX',
    items: [
      '🐉 Dragão Articulado Cristal & Dragão Chinês Flexível (Sucesso Viral)',
      '🐙 Polvo Flexível com Tentáculos Print-in-Place Antiestresse',
      '🦎 Lagarto Gecko e Jacaré Articulados sem Suportes',
      '🦖 T-Rex e Velociraptor Articulados para Crianças e Colecionadores',
      '🦈 Tubarão e Golfinho Flexíveis para Banho e Decoração',
      '⚙️ Cubos Infinitos Mecânicos (Fidget Infinity Cube)',
      '🌀 Fidget Spinners com Rolamento Embutido Imprimível',
      '🦋 Borboletas e Pássaros com Asas Articuladas Móveis',
      '🚗 Carrinhos e Tratores com Rodas Giratórias Montadas na Mesa',
      '🧩 Puzzles 3D de Encaixe Desafiadores e Quebra-Cabeças'
    ],
    cta: "buyStlPack('Pack 02 - Brinquedos & Articulados (120 STLs)', 'R$ 39,90')",
    ctaText: 'Comprar Pack Articulados (R$ 39,90)'
  },
  decor: {
    title: 'Pack 03 - Luminárias & Decoração (60 STLs)',
    category: '💡 Design Contemporâneo, Luxo & Iluminação',
    badge: '60 Arquivos STL • R$ 49,90 no PIX',
    items: [
      '🏮 Cúpula Voronoi Moderna para Lâmpadas LED / Soquete E27',
      '💡 Luminária Diamante Geométrica de Mesa com Passagem de Cabo',
      '🖼️ Caixas Lithophane 3D Curvas para Fotos e Painéis Iluminados',
      '🏺 Vasos Paramétricos Espirais e Geométricos Otimizados (Vase Mode)',
      '🌌 Abajur Hexagonal Modular com Efeito de Luz Difusa',
      '🗿 Esculturas Abstratas Contemporâneas para Sala e Escritório',
      '🌿 Cachepôs Poligonais Minimalistas para Suculentas',
      '✨ Arandelas de Parede com Projeção Geométrica de Sombras'
    ],
    cta: "buyStlPack('Pack 03 - Luminárias & Decoração (60 STLs)', 'R$ 49,90')",
    ctaText: 'Comprar Pack Luminárias (R$ 49,90)'
  },
  combo: {
    title: 'Super Combo VIP Master (Todos os 4 Packs)',
    category: '👑 Acervo Completo Vitalício • 53% OFF',
    badge: '260+ Arquivos STL • R$ 79,90 no PIX',
    items: [
      '🎁 Pack 00: Organização Essencial (12 STLs Gratuitos)',
      '📁 Pack 01: Organização & Oficina Completa (80 STLs)',
      '🔥 Pack 02: Brinquedos & Articulados Print-in-Place (120 STLs)',
      '💡 Pack 03: Luminárias Contemporâneas & Decoração (60 STLs)',
      '📜 Licença Comercial Vitalícia: Liberdade total para vender as peças físicas',
      '☁️ Acesso Vitalício à Pasta Exclusiva no Google Drive / Nuvem',
      '🔄 Novas atualizações e correções de modelos adicionadas sem custo'
    ],
    cta: "buyStlPack('COMBO MASTER - Todos os 4 Packs (260+ STLs)', 'R$ 79,90')",
    ctaText: 'Garantir Combo Completo (R$ 79,90)'
  }
};

function openStlPreview(packKey) {
  const pack = STL_PACK_PREVIEWS[packKey];
  if (!pack) return;

  const modal = document.getElementById('stl-preview-modal');
  const titleEl = document.getElementById('stl-preview-title');
  const badgeEl = document.getElementById('stl-preview-badge');
  const catEl = document.getElementById('stl-preview-category');
  const listEl = document.getElementById('stl-preview-list');
  const ctaBtn = document.getElementById('stl-preview-cta');

  if (titleEl) titleEl.textContent = pack.title;
  if (badgeEl) badgeEl.textContent = pack.badge;
  if (catEl) catEl.textContent = pack.category;

  if (listEl) {
    listEl.innerHTML = pack.items.map(item => `
      <li class="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
        <i class="fa-solid fa-cube text-amber-400 mt-0.5 flex-shrink-0 text-[11px]"></i>
        <span class="leading-relaxed font-medium">${item}</span>
      </li>
    `).join('');
  }

  if (ctaBtn) {
    ctaBtn.setAttribute('onclick', pack.cta);
    ctaBtn.innerHTML = `<i class="fa-brands fa-whatsapp text-lg"></i> <span>${pack.ctaText}</span>`;
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeStlPreview() {
  const modal = document.getElementById('stl-preview-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

