// Configuração Geral da Loja Trezzy 3D
const TREZZY_CONFIG = {
  storeName: 'Trezzy 3D - Impressão 3D',
  instagram: '@trezzy.3d',
  instagramUrl: 'https://instagram.com/trezzy.3d',
  location: 'Ribeirão Preto - SP',
  // Número de WhatsApp para fechamento de pedidos (formato DDI + DDD + Telefone)
  // Altere para o número oficial da Trezzy quando desejar:
  whatsappNumber: '5511990035253', 
  activeCoupons: {
    'TREZZY10': { discount: 0.10, label: '10% de Desconto Boas-Vindas' },
    'RIBEIRAO': { discount: 0.15, label: '15% de Desconto Local RP' }
  },
  shippingRates: {
    retirada: { label: 'Retirada em Ribeirão Preto - SP', price: 0.00 },
    envio: { label: 'Envio Seguro Correios / Transportadora (Brasil)', price: 19.90 }
  }
};

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.coupon = null;
    this.deliveryMethod = 'retirada';
    this.initEventListeners();
    this.updateCartBadge();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('trezzy_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erro ao ler carrinho do localStorage', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('trezzy_cart_v1', JSON.stringify(this.items));
      this.updateCartBadge();
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage', e);
    }
  }

  addItem(productId, quantity = 1, selectedColor = null) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const color = selectedColor || (product.colors && product.colors[0]) || 'Padrão';
    const existingIndex = this.items.findIndex(i => i.id === productId && i.color === color);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        pixPrice: product.pixPrice,
        image: product.image,
        color: color,
        bgTheme: product.bgTheme || 'dark',
        quantity: quantity
      });
    }

    this.saveCart();
    this.renderDrawer();
    showToast(`"${product.name}" adicionado ao carrinho!`, 'success');
  }

  updateQuantity(productId, color, delta) {
    const index = this.items.findIndex(i => i.id === productId && i.color === color);
    if (index > -1) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
        showToast('Item removido do carrinho.', 'info');
      }
      this.saveCart();
      this.renderDrawer();
    }
  }

  removeItem(productId, color) {
    this.items = this.items.filter(i => !(i.id === productId && i.color === color));
    this.saveCart();
    this.renderDrawer();
    showToast('Item removido do carrinho.', 'info');
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.renderDrawer();
  }

  applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();
    if (TREZZY_CONFIG.activeCoupons[cleanCode]) {
      this.coupon = {
        code: cleanCode,
        discount: TREZZY_CONFIG.activeCoupons[cleanCode].discount,
        label: TREZZY_CONFIG.activeCoupons[cleanCode].label
      };
      this.renderDrawer();
      showToast(`Cupom ${cleanCode} aplicado com sucesso!`, 'success');
      return true;
    } else {
      showToast('Cupom inválido ou expirado. Tente "TREZZY10"', 'error');
      return false;
    }
  }

  removeCoupon() {
    this.coupon = null;
    this.renderDrawer();
    showToast('Cupom removido.', 'info');
  }

  setDeliveryMethod(method) {
    if (TREZZY_CONFIG.shippingRates[method]) {
      this.deliveryMethod = method;
      this.renderDrawer();
    }
  }

  getTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = this.coupon ? subtotal * this.coupon.discount : 0;
    const shipping = subtotal > 0 ? TREZZY_CONFIG.shippingRates[this.deliveryMethod].price : 0;
    const total = Math.max(0, subtotal - discountAmount + shipping);
    const pixTotal = total * 0.90; // 10% adicional à vista no PIX

    return {
      subtotal,
      discountAmount,
      shipping,
      total,
      pixTotal,
      itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  updateCartBadge() {
    const count = this.items.reduce((sum, i) => sum + i.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
      b.textContent = count;
      if (count > 0) {
        b.classList.remove('hidden');
      } else {
        b.classList.add('hidden');
      }
    });
  }

  renderDrawer() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const checkoutSection = document.getElementById('cart-checkout-section');
    const footer = document.getElementById('cart-drawer-footer');
    const countText = document.getElementById('cart-items-count-text');
    if (!container) return;

    const totalQty = this.items.reduce((sum, item) => sum + item.quantity, 0);

    if (this.items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (checkoutSection) checkoutSection.classList.add('hidden');
      if (footer) footer.classList.add('hidden');
      if (countText) countText.textContent = '0';
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (checkoutSection) checkoutSection.classList.remove('hidden');
    if (footer) footer.classList.remove('hidden');
    if (countText) countText.textContent = totalQty;

    container.innerHTML = this.items.map(item => {
      const prod = typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA.find(p => p.id === item.id) : null;
      const theme = item.bgTheme || (prod && prod.bgTheme) || 'dark';
      const thumbBg = theme === 'white' ? 'bg-white' : (theme === 'warm' ? 'bg-[#f5ede3]' : 'bg-slate-950');

      return `
      <div class="flex items-center gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 hover:border-amber-500/30 transition">
        <div class="w-16 h-16 rounded-lg ${thumbBg} p-1 flex-shrink-0 border border-slate-700/60 flex items-center justify-center overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-xs sm:text-sm font-semibold text-slate-100 truncate">${item.name}</h4>
          <p class="text-xs text-amber-400 font-medium mt-0.5">Cor: <span class="text-slate-300">${item.color}</span></p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Sob Consulta</span>
            <div class="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <button onclick="cartManager.updateQuantity('${item.id}', '${item.color}', -1)" class="text-slate-400 hover:text-white px-1.5 font-bold leading-none text-sm">−</button>
              <span class="text-xs font-semibold text-white px-1">${item.quantity}</span>
              <button onclick="cartManager.updateQuantity('${item.id}', '${item.color}', 1)" class="text-slate-400 hover:text-white px-1.5 font-bold leading-none text-sm">+</button>
            </div>
          </div>
        </div>
        <button onclick="cartManager.removeItem('${item.id}', '${item.color}')" class="text-slate-500 hover:text-rose-400 p-1.5 transition ml-1" title="Remover item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
      `;
    }).join('');
  }

  generateWhatsAppUrl(customerData) {
    const deliveryMethodLabel = this.deliveryMethod === 'envio' 
      ? 'Envio Correios / Transportadora (Brasil)' 
      : 'Retirada em Ribeirão Preto - SP (Grátis)';

    let msg = `⚙️ *PEDIDO DE ORÇAMENTO - TREZZY 3D* ⚙️\n`;
    msg += `Olá! Selecionei estas peças no site da *Trezzy 3D* e gostaria de solicitar uma cotação:\n\n`;
    msg += `📦 *PEÇAS SELECIONADAS:*\n`;

    this.items.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}*\n`;
      msg += `   └ Variação / Cor: ${item.color}\n`;
      msg += `   └ Quantidade: ${item.quantity} unidade(s)\n`;
      msg += `   └ Valor: Sob Consulta\n\n`;
    });

    msg += `📍 *FORMA DE ENTREGA:* ${deliveryMethodLabel}\n`;
    msg += `👤 *SOLICITANTE:* ${customerData.name || 'Não informado'}\n`;
    msg += `📱 *WHATSAPP:* ${customerData.phone || 'Não informado'}\n`;
    
    if (this.deliveryMethod === 'envio' && customerData.address) {
      msg += `📮 *DESTINO (CIDADE/CEP):* ${customerData.address}\n`;
    }

    if (customerData.notes) {
      msg += `💬 *OBSERVAÇÕES / PERSONALIZAÇÃO:*\n${customerData.notes}\n`;
    }

    msg += `\nPoderiam me passar os valores e o prazo estimado de produção? Muito obrigado!`;

    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${TREZZY_CONFIG.whatsappNumber}?text=${encoded}`;
  }

  initEventListeners() {
    // Drawer close/open handlers
    const openBtns = document.querySelectorAll('.open-cart-btn');
    const closeBtns = document.querySelectorAll('.close-cart-btn');
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');

    openBtns.forEach(b => b.addEventListener('click', () => {
      this.renderDrawer();
      if (drawer) drawer.classList.remove('translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
    }));

    const closeCart = () => {
      if (drawer) drawer.classList.add('translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
    };

    closeBtns.forEach(b => b.addEventListener('click', closeCart));
    if (backdrop) backdrop.addEventListener('click', closeCart);
  }
}

// Instância global do carrinho
const cartManager = new CartManager();
