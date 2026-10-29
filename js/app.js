/* ROYAL ATELIER — GitHub Pages front-end prototype.
   Authentication, checkout, inventory and orders use this browser's localStorage only.
   Do not use these demo mechanisms for real customers, passwords or online payments. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const STORE = { products: 'royalAtelier.products.v1', cart: 'royalAtelier.cart.v1', users: 'royalAtelier.users.v1', session: 'royalAtelier.session.v1', orders: 'royalAtelier.orders.v1' };
  const categoryNames = { necklace: 'گردنبند', ring: 'انگشتر', earring: 'گوشواره', bracelet: 'دستبند', set: 'ست جواهر' };
  const defaultProducts = [
    { id:'ra-001', name:'گردنبند هاله', category:'necklace', price:18500000, stock:8, image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85', tag:'امضای مجموعه', description:'طراحی مینیمال با درخشش طلایی؛ مناسب استفاده روزمره.', featured:true },
    { id:'ra-002', name:'انگشتر سپیده', category:'ring', price:24700000, stock:4, image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85', tag:'منتخب', description:'فرمی کلاسیک با جزئیاتی ظریف و ماندگار.', featured:true },
    { id:'ra-003', name:'گوشواره آوید', category:'earring', price:13200000, stock:12, image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85', tag:'تازه رسیده', description:'لمسی از نور برای استایل‌های ساده و رسمی.', featured:true },
    { id:'ra-004', name:'دستبند جنگل', category:'bracelet', price:16900000, stock:6, image:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85', tag:'کالکشن سبز', description:'الهام‌گرفته از خطوط نرم و رنگ‌های طبیعت.', featured:true },
    { id:'ra-005', name:'زنجیر ماه‌تاب', category:'necklace', price:21800000, stock:5, image:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85', tag:'ظرافت روزانه', description:'زنجیری سبک با جلوه‌ای شفاف و آرام.', featured:false },
    { id:'ra-006', name:'انگشتر نشان', category:'ring', price:31900000, stock:3, image:'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=85', tag:'قطعه خاص', description:'فرمی شاخص برای لحظه‌های به‌یادماندنی.', featured:false },
    { id:'ra-007', name:'گوشواره دوشاخه', category:'earring', price:14900000, stock:0, image:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85', tag:'ناموجود', description:'طراحی مدرن با پرداختی براق و دقیق.', featured:false },
    { id:'ra-008', name:'ست شکوفه', category:'set', price:42500000, stock:2, image:'https://images.unsplash.com/photo-1599459183200-59c7687a0277?auto=format&fit=crop&w=900&q=85', tag:'ست هدیه', description:'هماهنگی ظریف برای هدیه‌ای به‌یادماندنی.', featured:true },
    { id:'ra-009', name:'دستبند پیوند', category:'bracelet', price:17400000, stock:9, image:'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85', tag:'پرفروش', description:'پیوندی از خطوط ساده و درخشش کلاسیک.', featured:false },
    { id:'ra-010', name:'گردنبند سلطنتی', category:'necklace', price:38500000, stock:1, image:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85', tag:'تعداد محدود', description:'قطعه‌ای چشمگیر برای مناسبت‌های خاص.', featured:false },
    { id:'ra-011', name:'انگشتر مدار', category:'ring', price:22600000, stock:7, image:'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=900&q=85', tag:'طراحی معاصر', description:'تعادل میان فرم هندسی و ظرافت کلاسیک.', featured:false },
    { id:'ra-012', name:'ست زمردین', category:'set', price:46800000, stock:0, image:'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=85', tag:'در انتظار موجودی', description:'ترکیبی هماهنگ با الهام از سبز سلطنتی.', featured:false }
  ];
  const load = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? structuredClone(fallback); } catch { return structuredClone(fallback); } };
  let products = load(STORE.products, defaultProducts);
  let cart = load(STORE.cart, []);
  let users = load(STORE.users, []);
  let orders = load(STORE.orders, []);
  let currentUser = load(STORE.session, null);
  let activeCategory = 'all';
  let searchQuery = '';
  let adminUnlocked = false;
  let toastTimer;
  const money = value => `${new Intl.NumberFormat('fa-IR').format(Math.max(0, Number(value) || 0))} تومان`;
  const digits = value => new Intl.NumberFormat('fa-IR').format(Number(value) || 0);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const persist = () => { localStorage.setItem(STORE.products, JSON.stringify(products)); localStorage.setItem(STORE.cart, JSON.stringify(cart)); localStorage.setItem(STORE.users, JSON.stringify(users)); localStorage.setItem(STORE.orders, JSON.stringify(orders)); localStorage.setItem(STORE.session, JSON.stringify(currentUser)); };
  const productById = id => products.find(p => p.id === id);
  const getCartTotals = () => cart.reduce((sum, item) => { const p = productById(item.id); if (p) { sum.count += item.quantity; sum.total += p.price * item.quantity; } return sum; }, { count: 0, total: 0 });
  const toast = message => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2500); };
  const openDialog = id => { const el = document.getElementById(id); if (el && !el.open) el.showModal(); };
  const closeDialog = id => { const el = document.getElementById(id); if (el?.open) el.close(); };

  function renderProducts() {
    const min = Number($('#min-price').value) || 0;
    const max = Number($('#max-price').value) || Infinity;
    const stockOnly = $('#in-stock-only').checked;
    let shown = products.filter(p => {
      const q = searchQuery.toLocaleLowerCase().trim();
      const text = [p.name, p.description, p.tag, categoryNames[p.category], p.category].join(' ').toLocaleLowerCase();
      return (activeCategory === 'all' || p.category === activeCategory) && (!q || text.includes(q)) && p.price >= min && p.price <= max && (!stockOnly || p.stock > 0);
    });
    const sort = $('#sort-select').value;
    if (sort === 'price-asc') shown.sort((a,b) => a.price-b.price);
    if (sort === 'price-desc') shown.sort((a,b) => b.price-a.price);
    if (sort === 'name') shown.sort((a,b) => a.name.localeCompare(b.name, 'fa'));
    if (sort === 'featured') shown.sort((a,b) => Number(b.featured)-Number(a.featured));
    $('#product-grid').innerHTML = shown.map((p, i) => `<article class="product-card" style="animation-delay:${Math.min(i,8)*35}ms"><div class="product-visual"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" decoding="async"><span class="product-label ${p.stock < 1 ? 'sold-out' : ''}">${esc(p.stock < 1 ? 'ناموجود' : p.tag || 'منتخب')}</span><button class="quick-add" type="button" data-add="${esc(p.id)}" ${p.stock < 1 ? 'disabled' : ''}>${p.stock < 1 ? 'فعلاً ناموجود' : 'افزودن به سبد  +'}</button></div><div class="product-info"><p class="product-category">${esc(categoryNames[p.category] || 'جواهرات')} · ROYAL EDITION</p><div class="product-title-row"><h3 class="product-title">${esc(p.name)}</h3><span class="product-price">${money(p.price)}</span></div><p class="product-description">${esc(p.description || '')}</p><small class="product-stock ${p.stock > 0 && p.stock < 3 ? 'low' : ''}">${p.stock > 0 ? (p.stock < 3 ? `تنها ${digits(p.stock)} عدد باقی‌مانده` : 'موجود در فروشگاه') : 'در انتظار شارژ مجدد'}</small></div></article>`).join('');
    $('#results-count').textContent = `${digits(shown.length)} محصول از ${digits(products.length)} محصول`;
    $('#no-results').hidden = shown.length > 0;
    $('#product-grid').hidden = shown.length === 0;
  }
  function renderCart() {
    cart = cart.filter(item => productById(item.id) && item.quantity > 0);
    const { count, total } = getCartTotals();
    $('#cart-count').textContent = digits(count);
    $('#drawer-count').textContent = `(${digits(count)})`;
    $('#cart-total').textContent = money(total);
    $('#checkout-total').textContent = money(total);
    $('#cart-bottom').hidden = count === 0;
    $('#cart-items').innerHTML = count ? cart.map(item => { const p = productById(item.id); return `<div class="cart-row"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div><h3>${esc(p.name)}</h3><p>${esc(categoryNames[p.category] || 'جواهرات')}</p><div class="quantity-control"><button type="button" data-qty="${esc(p.id)}" data-delta="-1" aria-label="کم کردن تعداد">−</button><span>${digits(item.quantity)}</span><button type="button" data-qty="${esc(p.id)}" data-delta="1" aria-label="افزایش تعداد" ${item.quantity >= p.stock ? 'disabled' : ''}>+</button></div><button class="remove-item" type="button" data-remove="${esc(p.id)}">حذف از سبد</button></div><strong class="cart-row-price">${money(p.price * item.quantity)}</strong></div>`; }).join('') : `<div class="cart-empty"><span>◇</span><h3>سبد خرید شما خالی است</h3><p>قطعه‌ای را که دوست دارید به انتخاب‌هایتان اضافه کنید.</p><button class="btn btn-outline-dark" id="continue-shopping">مشاهده مجموعه</button></div>`;
    persist();
  }
  function addToCart(id) {
    const p = productById(id); if (!p || p.stock < 1) return toast('این محصول در حال حاضر موجود نیست.');
    const item = cart.find(row => row.id === id);
    if (item && item.quantity >= p.stock) return toast('تعداد انتخابی از موجودی بیشتر است.');
    if (item) item.quantity++; else cart.push({ id, quantity: 1 });
    renderCart(); toast(`${p.name} به سبد خرید اضافه شد.`);
  }
  function openCart() { $('#backdrop').hidden = false; requestAnimationFrame(() => $('#backdrop').classList.add('visible')); $('#cart-drawer').classList.add('is-open'); $('#cart-drawer').setAttribute('aria-hidden','false'); document.body.classList.add('locked'); $('#cart-close').focus(); }
  function closeCart() { $('#cart-drawer').classList.remove('is-open'); $('#cart-drawer').setAttribute('aria-hidden','true'); $('#backdrop').classList.remove('visible'); $('#backdrop').hidden = true; document.body.classList.remove('locked'); }
  function setCategory(category) { activeCategory = category; $$('.filter-chip').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === category)); renderProducts(); }

  function renderAccount(mode = 'login', message = '') {
    const panel = $('#account-panel');
    if (currentUser) {
      const mine = orders.filter(order => order.userEmail === currentUser.email).sort((a,b) => b.createdAt-a.createdAt);
      panel.innerHTML = `<div class="account-welcome"><div><strong>خوش آمدید، ${esc(currentUser.name)}</strong><small>${esc(currentUser.email)}</small></div><button class="btn btn-outline-dark" id="account-logout" type="button">خروج</button></div><div class="order-history"><h3>سفارش‌های من</h3>${mine.length ? mine.map(o => `<div class="order-item"><div><strong>سفارش ${esc(o.id)}</strong><div>${esc(o.createdLabel)} · ${digits(o.items.reduce((n,i)=>n+i.quantity,0))} قلم</div><div>${money(o.total)}</div></div><span class="status-pill">${esc(o.status)}</span></div>`).join('') : '<p class="account-message">هنوز سفارشی ثبت نکرده‌اید. پس از ثبت سفارش نمایشی، جزئیات آن اینجا نمایش داده می‌شود.</p>'}</div><p class="account-message">این حساب آزمایشی فقط در همین مرورگر در دسترس است و ورود امن سروری ندارد.</p>`;
      return;
    }
    panel.innerHTML = `<div class="account-tabs"><button type="button" data-account-mode="login" class="${mode==='login'?'active':''}">ورود</button><button type="button" data-account-mode="register" class="${mode==='register'?'active':''}">ساخت حساب</button></div><form id="account-form" class="account-form">${mode==='register' ? '<label>نام و نام خانوادگی<input name="name" required autocomplete="name" placeholder="نام شما"></label>' : ''}<label>ایمیل<input name="email" type="email" required autocomplete="email" placeholder="name@example.com"></label><label>رمز عبور<input name="password" type="password" required minlength="4" autocomplete="${mode==='login'?'current-password':'new-password'}" placeholder="حداقل ۴ نویسه"></label><button class="btn btn-gold full-width" type="submit">${mode==='login'?'ورود به حساب':'ایجاد حساب آزمایشی'} <span>↙</span></button><p class="form-feedback">${esc(message)}</p></form><p class="account-message">دمو برای تست رابط کاربری است؛ اطلاعات حساب در مرورگر ذخیره می‌شود. برای سایت واقعی باید احراز هویت امن و بک‌اند راه‌اندازی شود.</p>`;
  }
  function registerOrLogin(form) {
    const data = new FormData(form); const email = String(data.get('email') || '').trim().toLowerCase(); const password = String(data.get('password') || '');
    const mode = $('[data-account-mode].active', $('#account-panel'))?.dataset.accountMode || 'login';
    if (mode === 'register') {
      const name = String(data.get('name') || '').trim();
      if (!name || password.length < 4) return renderAccount(mode, 'نام و رمز عبور معتبر وارد کنید.');
      if (users.some(u => u.email === email)) return renderAccount(mode, 'این ایمیل قبلاً ثبت شده است. وارد شوید.');
      users.push({ name, email, password }); currentUser = { name, email }; persist(); renderAccount(); toast('حساب آزمایشی شما ایجاد شد.');
    } else {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) return renderAccount(mode, 'اطلاعات ورود درست نیست یا هنوز حسابی نساخته‌اید.');
      currentUser = { name: user.name, email: user.email }; persist(); renderAccount(); toast('با موفقیت وارد شدید.');
    }
  }

  function renderAdmin() {
    const panel = $('#admin-panel');
    if (!adminUnlocked) {
      panel.innerHTML = `<div class="admin-warning">این بخش یک پنل نمایشی است و احراز هویت آن امنیت واقعی ندارد. اطلاعات تغییر یافته فقط در مرورگر فعلی ذخیره می‌شود.</div><form class="admin-login" id="admin-login-form"><h3>ورود مدیر فروشگاه</h3><p>برای نمایش قابلیت‌های نمونه، از مشخصات آزمایشی زیر استفاده کنید.</p><label>ایمیل مدیر<input name="email" type="email" required value="admin@royal.test"></label><label>رمز عبور<input name="password" type="password" required value="Royal2026!"></label><button class="btn btn-gold" type="submit">ورود به پنل مدیریت</button><small class="form-feedback" id="admin-login-feedback">اطلاعات آزمایشی: admin@royal.test / Royal2026!</small></form>`;
      return;
    }
    panel.innerHTML = `<div class="admin-warning">نسخه نمایشی GitHub Pages: تغییرات در localStorage ذخیره می‌شوند؛ کاربران دیگر یا دستگاه‌های دیگر آن‌ها را نمی‌بینند. برای فروش واقعی به بک‌اند، دیتابیس و درگاه پرداخت نیاز است.</div><div class="admin-stats"><div class="admin-stat"><span>تعداد محصولات</span><strong>${digits(products.length)}</strong></div><div class="admin-stat"><span>موجودی کل</span><strong>${digits(products.reduce((n,p)=>n+Number(p.stock||0),0))}</strong></div><div class="admin-stat"><span>سفارش‌های ثبت‌شده</span><strong>${digits(orders.length)}</strong></div></div><div class="admin-tabs"><button class="active" data-admin-tab="products">محصولات و موجودی</button><button data-admin-tab="orders">مدیریت سفارش‌ها</button><button data-admin-tab="users">مشتری‌ها</button><button id="admin-logout">خروج مدیر</button></div><div id="admin-tab-content">${adminProductsHTML()}</div>`;
  }
  function adminProductsHTML() {
    return `<form class="admin-product-form" id="new-product-form"><h3>افزودن محصول جدید</h3><label>نام محصول<input name="name" required placeholder="مثلاً گردنبند آریا"></label><label>دسته‌بندی<select name="category">${Object.entries(categoryNames).map(([key,val])=>`<option value="${key}">${val}</option>`).join('')}</select></label><label>قیمت (تومان)<input name="price" type="number" min="1" required placeholder="15000000"></label><label>موجودی<input name="stock" type="number" min="0" required value="1"></label><label>لینک تصویر<input name="image" type="url" required placeholder="https://..."></label><label>برچسب کوتاه<input name="tag" placeholder="تازه رسیده"></label><label style="grid-column:1/-1">توضیح کوتاه<input name="description" placeholder="توضیحات محصول"></label><button class="btn btn-gold" type="submit">افزودن محصول +</button></form><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>محصول</th><th>دسته</th><th>قیمت (تومان)</th><th>موجودی</th><th>عملیات</th></tr></thead><tbody>${products.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(categoryNames[p.category])}</td><td><input type="number" min="0" value="${Number(p.price)}" data-edit-price="${esc(p.id)}" aria-label="قیمت ${esc(p.name)}"></td><td><input type="number" min="0" value="${Number(p.stock)}" data-edit-stock="${esc(p.id)}" aria-label="موجودی ${esc(p.name)}"></td><td><button class="mini-btn" data-save-product="${esc(p.id)}">ذخیره</button> <button class="mini-btn danger-btn" data-delete-product="${esc(p.id)}">حذف</button></td></tr>`).join('')}</tbody></table></div>`;
  }
  function adminOrdersHTML() {
    const statuses = ['در انتظار بررسی','تأیید شده','در حال آماده‌سازی','ارسال شده','تحویل شده','لغو شده'];
    if (!orders.length) return '<div class="no-results"><h3>هنوز سفارشی ثبت نشده است</h3><p>سفارش‌های نمایشی مشتریان در این قسمت فهرست می‌شوند.</p></div>';
    return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>شماره</th><th>مشتری</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th><th>جزئیات</th></tr></thead><tbody>${orders.slice().sort((a,b)=>b.createdAt-a.createdAt).map(o=>`<tr><td>${esc(o.id)}</td><td>${esc(o.customer)}<br>${esc(o.phone)}</td><td>${esc(o.createdLabel)}</td><td>${money(o.total)}</td><td><select data-order-status="${esc(o.id)}">${statuses.map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></td><td><button class="mini-btn" data-order-detail="${esc(o.id)}">مشاهده</button></td></tr>`).join('')}</tbody></table></div>`;
  }
  function adminUsersHTML() {
    return users.length ? `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>نام مشتری</th><th>ایمیل</th><th>تعداد سفارش</th></tr></thead><tbody>${users.map(u=>`<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${digits(orders.filter(o=>o.userEmail===u.email).length)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="account-message">هنوز مشتری آزمایشی ثبت‌نام نکرده است.</p>';
  }
  function showAdminTab(tab) {
    $$('.admin-tabs [data-admin-tab]').forEach(b=>b.classList.toggle('active', b.dataset.adminTab===tab));
    $('#admin-tab-content').innerHTML = tab === 'orders' ? adminOrdersHTML() : tab === 'users' ? adminUsersHTML() : adminProductsHTML();
  }

  $('#year').textContent = new Date().getFullYear();
  renderProducts(); renderCart();

  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]'); if (add) return addToCart(add.dataset.add);
    const qty = event.target.closest('[data-qty]'); if (qty) { const item=cart.find(i=>i.id===qty.dataset.qty); const p=productById(qty.dataset.qty); if(!item||!p)return; const next=item.quantity+Number(qty.dataset.delta); if(next<=0)cart=cart.filter(i=>i.id!==item.id);else if(next<=p.stock)item.quantity=next;else toast('موجودی کافی نیست.');renderCart();return; }
    const remove = event.target.closest('[data-remove]'); if(remove){cart=cart.filter(i=>i.id!==remove.dataset.remove);renderCart();toast('محصول از سبد حذف شد.');return;}
    const cat = event.target.closest('[data-filter]'); if(cat){setCategory(cat.dataset.filter);$('#shop').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return;}
    const collection = event.target.closest('[data-category]'); if(collection){setCategory(collection.dataset.category);$('#shop').scrollIntoView({behavior:'smooth'});return;}
    if(event.target.closest('#cart-open'))return openCart();
    if(event.target.closest('#cart-close')||event.target.id==='backdrop'){closeCart();return;}
    if(event.target.closest('#continue-shopping')){closeCart();$('#shop').scrollIntoView({behavior:'smooth'});return;}
    if(event.target.closest('#search-open')){$('#searchbar').hidden=!$('#searchbar').hidden;if(!$('#searchbar').hidden)$('#search-input').focus();return;}
    if(event.target.closest('#search-close')){$('#searchbar').hidden=true;$('#search-input').value='';searchQuery='';renderProducts();return;}
    if(event.target.closest('#advanced-filter-toggle')){const box=$('#advanced-filters');box.hidden=!box.hidden;$('#advanced-filter-toggle').setAttribute('aria-expanded',String(!box.hidden));return;}
    const mode = event.target.closest('[data-account-mode]');if(mode){renderAccount(mode.dataset.accountMode);return;}
    if(event.target.closest('#account-open')||event.target.closest('#mobile-account')){renderAccount();openDialog('account-modal');$('#mobile-nav').hidden=true;return;}
    if(event.target.closest('#account-logout')){currentUser=null;persist();renderAccount();toast('از حساب آزمایشی خارج شدید.');return;}
    const close = event.target.closest('[data-close-modal]');if(close){closeDialog(close.dataset.closeModal);return;}
    if(event.target.closest('#checkout-open')){if(!currentUser){closeCart();renderAccount('login','برای ثبت سفارش بهتر است ابتدا وارد حساب آزمایشی شوید.');openDialog('account-modal');return;}closeCart();$('#checkout-feedback').textContent='';openDialog('checkout-modal');return;}
    if(event.target.closest('#admin-open')){adminUnlocked=false;renderAdmin();openDialog('admin-modal');return;}
    if(event.target.closest('#admin-logout')){adminUnlocked=false;renderAdmin();return;}
    const tab=event.target.closest('[data-admin-tab]');if(tab){showAdminTab(tab.dataset.adminTab);return;}
    const save=event.target.closest('[data-save-product]');if(save){const p=productById(save.dataset.saveProduct);if(!p)return;const price=Number($(`[data-edit-price="${CSS.escape(p.id)}"]`).value);const stock=Number($(`[data-edit-stock="${CSS.escape(p.id)}"]`).value);const name=$(`[data-edit-name="${CSS.escape(p.id)}"]`).value.trim();const category=$(`[data-edit-category="${CSS.escape(p.id)}"]`).value;const image=$(`[data-edit-image="${CSS.escape(p.id)}"]`).value.trim();if(!name||!image||!Number.isFinite(price)||price<0||!Number.isInteger(stock)||stock<0)return toast('نام، تصویر، قیمت و موجودی را بررسی کنید.');p.name=name;p.category=category;p.image=image;p.price=price;p.stock=stock;persist();renderProducts();renderCart();renderAdmin();toast('قیمت و موجودی ذخیره شد.');return;}
    const del=event.target.closest('[data-delete-product]');if(del){if(!confirm('این محصول حذف شود؟'))return;products=products.filter(p=>p.id!==del.dataset.deleteProduct);cart=cart.filter(i=>i.id!==del.dataset.deleteProduct);persist();renderProducts();renderCart();renderAdmin();toast('محصول حذف شد.');return;}
    const detail=event.target.closest('[data-order-detail]');if(detail){const order=orders.find(o=>o.id===detail.dataset.orderDetail);if(order)alert(`سفارش ${order.id}\nمشتری: ${order.customer}\nتلفن: ${order.phone}\nآدرس: ${order.address}\nروش پرداخت: ${order.paymentMethod}\n\n${order.items.map(i=>`${i.name} × ${i.quantity}`).join('\n')}\n\nجمع: ${money(order.total)}\n\nیادداشت: ${order.note||'ندارد'}`);return;}
    const mobile=event.target.closest('#mobile-menu-btn');if(mobile){const nav=$('#mobile-nav');nav.hidden=!nav.hidden;mobile.setAttribute('aria-expanded',String(!nav.hidden));return;}
    if(event.target.closest('#mobile-nav a')){$('#mobile-nav').hidden=true;$('#mobile-menu-btn').setAttribute('aria-expanded','false');}
  });
  $('#search-input').addEventListener('input', e => { searchQuery=e.target.value;renderProducts(); });
  $('#sort-select').addEventListener('change',renderProducts);
  $('#apply-filters').addEventListener('click',renderProducts);
  $('#reset-filters').addEventListener('click',()=>{$('#min-price').value='';$('#max-price').value='';$('#in-stock-only').checked=false;$('#search-input').value='';searchQuery='';setCategory('all');$('#sort-select').value='featured';renderProducts();});
  $('#no-results-reset').addEventListener('click',()=>{$('#reset-filters').click();});
  $('#account-panel').addEventListener('submit', e => { if(e.target.id!=='account-form')return;e.preventDefault();registerOrLogin(e.target); });
  $('#checkout-form').addEventListener('submit', e => {
    e.preventDefault();const totals=getCartTotals();if(!totals.count){$('#checkout-feedback').textContent='سبد خرید خالی است.';return;}
    for(const item of cart){const p=productById(item.id);if(!p||p.stock<item.quantity){$('#checkout-feedback').textContent='موجودی یکی از محصولات تغییر کرده است. سبد خرید را بررسی کنید.';return;}}
    const form=new FormData(e.currentTarget);const order={id:`RA-${Date.now().toString().slice(-7)}`,createdAt:Date.now(),createdLabel:new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium',timeStyle:'short'}).format(new Date()),userEmail:currentUser.email,customer:String(form.get('name')).trim(),phone:String(form.get('phone')).trim(),address:String(form.get('address')).trim(),note:String(form.get('note')||'').trim(),paymentMethod:String(form.get('paymentMethod')||'پرداخت آنلاین (دمو؛ درگاه متصل نیست)'),items:cart.map(item=>({id:item.id,name:productById(item.id).name,quantity:item.quantity,price:productById(item.id).price})),total:totals.total,status:'در انتظار بررسی'};
    orders.push(order);order.items.forEach(item=>{const p=productById(item.id);p.stock-=item.quantity;});cart=[];persist();renderProducts();renderCart();closeDialog('checkout-modal');e.currentTarget.reset();toast(`سفارش آزمایشی ${order.id} ثبت شد.`);renderAccount();
  });
  $('#admin-panel').addEventListener('submit', e => {
    if(e.target.id==='admin-login-form'){e.preventDefault();const data=new FormData(e.target);if(data.get('email')==='admin@royal.test'&&data.get('password')==='Royal2026!'){adminUnlocked=true;renderAdmin();toast('به پنل نمایشی خوش آمدید.');}else $('#admin-login-feedback').textContent='مشخصات واردشده صحیح نیست.';return;}
    if(e.target.id==='new-product-form'){e.preventDefault();const d=new FormData(e.target);const price=Number(d.get('price')),stock=Number(d.get('stock'));if(price<=0||stock<0)return toast('قیمت و موجودی معتبر وارد کنید.');products.unshift({id:`ra-${Date.now()}`,name:String(d.get('name')).trim(),category:String(d.get('category')),price,stock,image:String(d.get('image')).trim(),tag:String(d.get('tag')||'تازه رسیده').trim(),description:String(d.get('description')||'').trim(),featured:false});persist();renderProducts();renderAdmin();toast('محصول جدید اضافه شد.');}
  });
  $('#admin-panel').addEventListener('change', e => {const el=e.target.closest('[data-order-status]');if(!el)return;const order=orders.find(o=>o.id===el.dataset.orderStatus);if(order){order.status=el.value;persist();toast('وضعیت سفارش تغییر کرد.');}});
})();
