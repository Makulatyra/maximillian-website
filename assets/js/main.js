// Минимальный скрипт: мобильное меню и простая корзина (localStorage)
(function(){
  const CART_KEY = 'maxipet_cart_v1';

  function readCart(){
    try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }catch(_){ return []; }
  }
  function writeCart(items){
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }
  function addToCart(item){
    const cart = readCart();
    const idx = cart.findIndex(x => x.id === item.id);
    if(idx >= 0){ cart[idx].qty += item.qty || 1; } else { cart.push({ ...item, qty: item.qty || 1 }); }
    writeCart(cart);
    toast('Добавлено в корзину');
  }
  function toast(message){
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#2f7d32;color:#fff;padding:10px 14px;border-radius:10px;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,.12)';
    document.body.appendChild(el);
    setTimeout(()=>{ el.remove(); }, 1600);
  }

  // Красивое анимированное уведомление (модальное)
  function showAnimatedNotice(title, subtitle){
    // Добавляем стили один раз
    if(!document.getElementById('maxipet-ui-styles')){
      const style = document.createElement('style');
      style.id = 'maxipet-ui-styles';
      style.textContent = '\n@keyframes mp-fade { from { opacity: 0 } to { opacity: 1 } }\n@keyframes mp-pop { 0% { transform: scale(.94) } 60% { transform: scale(1.02) } 100% { transform: scale(1) } }\n';
      document.head.appendChild(style);
    }
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center;z-index:10000;animation:mp-fade .18s ease-out';

    const card = document.createElement('div');
    card.style.cssText = 'width:min(420px,92%);background:#fff;border:1px solid #e3e8ef;border-radius:16px;padding:22px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.18);animation:mp-pop .22s ease-out';

    const icon = document.createElement('div');
    icon.textContent = '✅';
    icon.style.cssText = 'font-size:34px;margin-bottom:8px';

    const h = document.createElement('div');
    h.textContent = title || 'Спасибо за заказ!';
    h.style.cssText = 'font-weight:800;color:#233040;margin-bottom:4px;font-size:20px';

    const p = document.createElement('div');
    p.textContent = subtitle || 'Мы свяжемся с вами в ближайшее время.';
    p.style.cssText = 'color:#6b7a90;font-size:14px';

    const close = document.createElement('button');
    close.textContent = 'Хорошо';
    close.className = 'btn primary';
    close.style.cssText = 'margin-top:14px';

    close.addEventListener('click', ()=> overlay.remove());
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) overlay.remove(); });

    card.appendChild(icon); card.appendChild(h); card.appendChild(p); card.appendChild(close);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Автозакрытие через 2.2с
    setTimeout(()=>{ overlay.remove(); }, 2200);
  }

  // Делегирование на кнопки .js-add-to-cart
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.js-add-to-cart');
    if(!btn) return;
    const item = {
      id: btn.getAttribute('data-id') || String(Date.now()),
      name: btn.getAttribute('data-name') || 'Товар',
      price: Number(btn.getAttribute('data-price') || 0),
      qty: Number(btn.getAttribute('data-qty') || 1),
    };
    addToCart(item);
  });

  // Экспорт в window для страниц корзины
  window.MaxiCart = { readCart, writeCart };
  window.MaxiUI = { showAnimatedNotice };
})();