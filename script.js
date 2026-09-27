const header=document.querySelector('[data-header]');
const menuButton=document.querySelector('[data-menu-toggle]');
const nav=document.querySelector('[data-nav]');
const closeMenu=()=>{menuButton?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');document.body.classList.remove('menu-open')};
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open);document.body.classList.toggle('menu-open',!open)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('scroll',()=>header?.classList.toggle('is-fixed',window.scrollY>40),{passive:true});

const revealObserver=new IntersectionObserver((entries,observer)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));

const counterObserver=new IntersectionObserver((entries,observer)=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const counter=entry.target,target=Number(counter.dataset.count),start=performance.now();const update=now=>{const progress=Math.min((now-start)/1200,1),eased=1-Math.pow(1-progress,3);counter.textContent=String(Math.floor(target*eased)).padStart(2,'0');if(progress<1)requestAnimationFrame(update)};requestAnimationFrame(update);observer.unobserve(counter)}),{threshold:.7});
document.querySelectorAll('[data-count]').forEach(counter=>counterObserver.observe(counter));

const gallery=document.querySelector('[data-gallery-track]');
if(gallery)gallery.insertAdjacentHTML('beforeend',gallery.innerHTML);
document.querySelectorAll('.accordion details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.accordion details[open]').forEach(other=>{if(other!==item)other.removeAttribute('open')})}));

const dialog=document.querySelector('[data-privacy-dialog]');
document.querySelector('[data-open-privacy]')?.addEventListener('click',()=>dialog?.showModal());
document.querySelector('[data-close-privacy]')?.addEventListener('click',()=>dialog?.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
document.querySelector('[data-year]').textContent=new Date().getFullYear();
