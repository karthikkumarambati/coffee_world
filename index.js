const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('navLinks');
    const backTop = document.getElementById('backTop');
    const toast = document.getElementById('toast');
    let toastTimer;

    function closeMenu(){
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open navigation');
      toggle.innerHTML='<i class="fa-solid fa-bars"></i>';
    }
    toggle.addEventListener('click',()=>{
      const isOpen=nav.classList.toggle('open');
      document.body.classList.toggle('menu-open',isOpen);
      toggle.setAttribute('aria-expanded',String(isOpen));
      toggle.setAttribute('aria-label',isOpen?'Close navigation':'Open navigation');
      toggle.innerHTML=isOpen?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';
    });
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));

    function showToast(message){
      toast.textContent=message;toast.classList.add('show');
      clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2500);
    }
    document.querySelectorAll('[data-item]').forEach(button=>button.addEventListener('click',()=>{
      showToast(button.dataset.item+' selected — connect a cart to place an order.');
    }));

    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}});
    },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

    const sectionLinks=[...document.querySelectorAll('.nav-links a')];
    const sections=[...document.querySelectorAll('main section[id]')];
    const sectionObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){sectionLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}});
    },{rootMargin:'-35% 0px -55% 0px'});
    sections.forEach(section=>sectionObserver.observe(section));

    window.addEventListener('scroll',()=>{
      header.classList.toggle('scrolled',window.scrollY>20);
      backTop.classList.toggle('show',window.scrollY>500);
    },{passive:true});
    backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    document.getElementById('year').textContent=new Date().getFullYear();

    document.getElementById('contactForm').addEventListener('submit',event=>{
      event.preventDefault();
      const form=event.currentTarget;
      const status=document.getElementById('formStatus');
      status.style.display='block';
      status.textContent='Your form is validated, but no email has been sent yet. Connect a backend or email service to receive messages.';
      showToast('Form validated — email delivery needs setup.');
      // Connect this form to your backend, Formspree, EmailJS, or a PHP mail handler to send emails.
      form.reset();
    });
