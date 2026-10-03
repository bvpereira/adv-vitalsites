const header=document.querySelector('[data-header]');
const menuButton=document.querySelector('[data-menu-toggle]');
const nav=document.querySelector('[data-nav]');
const closeMenu=()=>{menuButton?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');document.body.classList.remove('menu-open')};
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open);document.body.classList.toggle('menu-open',!open)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('scroll',()=>header?.classList.toggle('is-fixed',window.scrollY>40),{passive:true});

const revealObserver=new IntersectionObserver((entries,observer)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));

const counterTimers=new WeakMap();
const animateCounter=counter=>{const target=Number(counter.dataset.count),suffix=counter.dataset.suffix||'';counter.textContent='0'+suffix;window.setTimeout(()=>{const start=performance.now();const update=now=>{const progress=Math.min((now-start)/2800,1),eased=1-Math.pow(1-progress,3),value=Math.floor(target*eased);counter.textContent=String(value)+suffix;if(progress<1)requestAnimationFrame(update)};requestAnimationFrame(update)},350)};
const startCounterLoop=counter=>{if(counterTimers.has(counter))return;animateCounter(counter);const timer=window.setInterval(()=>animateCounter(counter),7200);counterTimers.set(counter,timer)};
const stopCounterLoop=counter=>{const timer=counterTimers.get(counter);if(timer){clearInterval(timer);counterTimers.delete(counter)}};
const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.isIntersecting?startCounterLoop(entry.target):stopCounterLoop(entry.target)),{threshold:.25});
document.querySelectorAll('[data-count]').forEach(counter=>counterObserver.observe(counter));

const gallery=document.querySelector('[data-gallery-track]');
const timeline=document.querySelector('.process ol');
if(timeline){
  const steps=[...timeline.querySelectorAll('li')];
  const mobileTimeline=window.matchMedia('(max-width:1000px)');
  let timelineTimer,currentStep=0,timelineVisible=false,scrollFrame=0;
  const showStep=()=>steps.forEach((step,index)=>{step.classList.toggle('is-reached',index<=currentStep);step.classList.toggle('is-current',index===currentStep);step.classList.toggle('is-connected',index<=currentStep&&index<steps.length-1)});
  const advance=()=>{showStep();timelineTimer=setTimeout(()=>{if(currentStep===steps.length-1){timeline.classList.add('is-resetting');steps.forEach(step=>step.classList.remove('is-connected','is-reached','is-current'));currentStep=0;timelineTimer=setTimeout(()=>{timeline.classList.remove('is-resetting');advance()},100)}else{currentStep++;advance()}},currentStep===steps.length-1?2000:1800)};
  const updateScrollProgress=()=>{
    scrollFrame=0;
    if(!mobileTimeline.matches)return;
    const focusLine=window.innerHeight*.6;
    const centers=steps.map(step=>{const bounds=step.querySelector('span').getBoundingClientRect();return bounds.top+bounds.height/2});
    currentStep=Math.max(0,centers.findLastIndex(center=>center<=focusLine));
    steps.forEach((step,index)=>{
      step.classList.toggle('is-reached',centers[index]<=focusLine);
      step.classList.toggle('is-current',index===currentStep&&centers[0]<=focusLine);
      step.classList.remove('is-connected');
      const progress=index<steps.length-1?Math.max(0,Math.min(1,(focusLine-centers[index])/(centers[index+1]-centers[index]))):0;
      step.style.setProperty('--scroll-progress',progress);
    });
  };
  const scheduleScrollProgress=()=>{if(mobileTimeline.matches&&!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollProgress)};
  const syncTimelineMode=()=>{
    clearTimeout(timelineTimer);
    timeline.classList.remove('is-resetting');
    timeline.classList.toggle('is-scroll-driven',mobileTimeline.matches);
    if(mobileTimeline.matches)updateScrollProgress();
    else if(timelineVisible)advance();
  };
  window.addEventListener('scroll',scheduleScrollProgress,{passive:true});
  window.addEventListener('resize',scheduleScrollProgress);
  mobileTimeline.addEventListener('change',syncTimelineMode);
  const timelineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{timelineVisible=entry.isIntersecting;clearTimeout(timelineTimer);if(mobileTimeline.matches)scheduleScrollProgress();else if(timelineVisible)advance()}),{threshold:.1});
  syncTimelineMode();
  timelineObserver.observe(timeline);
}
if(gallery)gallery.insertAdjacentHTML('beforeend',gallery.innerHTML);
document.querySelectorAll('.accordion details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.accordion details[open]').forEach(other=>{if(other!==item)other.removeAttribute('open')})}));

const dialog=document.querySelector('[data-privacy-dialog]');
const locationDialog=document.querySelector('[data-location-video-dialog]');
const locationVideo=document.querySelector('[data-location-video]');
document.querySelector('[data-open-location-video]')?.addEventListener('click',()=>{locationDialog.showModal();document.body.classList.add('video-open');locationVideo.play().catch(()=>{})});
document.querySelector('[data-close-location-video]')?.addEventListener('click',()=>locationDialog.close());
locationDialog?.addEventListener('close',()=>{locationVideo.pause();locationVideo.currentTime=0;document.body.classList.remove('video-open')});
locationDialog?.addEventListener('click',event=>{if(event.target===locationDialog){const bounds=locationDialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)locationDialog.close()}});
document.querySelector('[data-open-privacy]')?.addEventListener('click',()=>dialog?.showModal());
document.querySelector('[data-close-privacy]')?.addEventListener('click',()=>dialog?.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
document.querySelector('[data-year]').textContent=new Date().getFullYear();
