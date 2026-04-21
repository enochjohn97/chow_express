/* PRELOADER */
window.addEventListener('load',function(){setTimeout(function(){document.getElementById('preloader').classList.add('hide');},2200);});

/* SCROLL: navbar + back-to-top + active link */
var navbar=document.getElementById('navbar');
var btt=document.getElementById('btt');
window.addEventListener('scroll',function(){
  var y=window.scrollY;
  navbar.classList.toggle('scrolled',y>60);
  btt.classList.toggle('vis',y>300);
  var secs=document.querySelectorAll('section[id]');
  var links=document.querySelectorAll('.nav-links a');
  var cur='';
  secs.forEach(function(s){if(y>=s.offsetTop-130)cur=s.id;});
  links.forEach(function(l){l.classList.remove('active');if(l.getAttribute('href')==='#'+cur)l.classList.add('active');});
});

/* =====================================================
   MOBILE MENU — FIXED
   Uses max-height transition. display:flex always on
   mobile so the transition can animate properly.
   ===================================================== */
var hbg=document.getElementById('hamburger');
var mob=document.getElementById('mobileMenu');
var menuOpen=false;

function openMenu(){
  menuOpen=true;
  mob.classList.add('open');
  hbg.classList.add('open');
  hbg.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden'; // prevent bg scroll
}

function closeMenu(){
  menuOpen=false;
  mob.classList.remove('open');
  hbg.classList.remove('open');
  hbg.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}

hbg.addEventListener('click',function(e){
  e.stopPropagation();
  menuOpen?closeMenu():openMenu();
});

// Close when any link inside menu is clicked
mob.querySelectorAll('a').forEach(function(a){
  a.addEventListener('click',function(){closeMenu();});
});

// Close when clicking outside the menu
document.addEventListener('click',function(e){
  if(menuOpen&&!mob.contains(e.target)&&!hbg.contains(e.target)){closeMenu();}
});

// Close on resize to desktop
window.addEventListener('resize',function(){
  if(window.innerWidth>900){closeMenu();}
});

/* HERO SLIDESHOW */
var hi=0;
var slides=document.querySelectorAll('.hero-slide');
var hdots=document.querySelectorAll('.hdot');
function goHero(i){
  slides[hi].classList.remove('active');hdots[hi].classList.remove('active');
  hi=i;slides[hi].classList.add('active');hdots[hi].classList.add('active');
}
setInterval(function(){goHero((hi+1)%slides.length);},6000);

/* GALLERY CAROUSEL */
var gTrack=document.getElementById('gTrack');
var gcards=gTrack.querySelectorAll('.gcard');
var gDotsEl=document.getElementById('gDots');
var gi=0;

function getVis(){return window.innerWidth<=600?1:window.innerWidth<=900?2:3;}

function setCardWidths(){
  var vis=getVis(),gap=16;
  var total=gTrack.parentElement.offsetWidth;
  var w=(total-(vis-1)*gap)/vis;
  gcards.forEach(function(c){c.style.width=w+'px';});
  buildGDots();goGallery(0);
}

function buildGDots(){
  gDotsEl.innerHTML='';
  var vis=getVis();
  var pages=Math.ceil(gcards.length/vis);
  for(var i=0;i<pages;i++){
    (function(idx){
      var d=document.createElement('button');
      d.className='gdot'+(idx===0?' active':'');
      d.addEventListener('click',function(){goGallery(idx);});
      gDotsEl.appendChild(d);
    })(i);
  }
}

function goGallery(i){
  var vis=getVis(),pages=Math.ceil(gcards.length/vis);
  gi=Math.max(0,Math.min(i,pages-1));
  var w=gcards[0].offsetWidth+16;
  gTrack.style.transform='translateX(-'+(gi*vis*w)+'px)';
  document.querySelectorAll('.gdot').forEach(function(d,idx){d.classList.toggle('active',idx===gi);});
}

document.getElementById('gPrev').addEventListener('click',function(){goGallery(gi-1);});
document.getElementById('gNext').addEventListener('click',function(){goGallery(gi+1);});

var gAuto=setInterval(function(){goGallery((gi+1)%Math.ceil(gcards.length/getVis()));},4200);
gTrack.addEventListener('mouseenter',function(){clearInterval(gAuto);});
gTrack.addEventListener('mouseleave',function(){gAuto=setInterval(function(){goGallery((gi+1)%Math.ceil(gcards.length/getVis()));},4200);});

// touch swipe
var tsx=0;
gTrack.addEventListener('touchstart',function(e){tsx=e.touches[0].clientX;},{passive:true});
gTrack.addEventListener('touchend',function(e){var d=tsx-e.changedTouches[0].clientX;if(Math.abs(d)>40)d>0?goGallery(gi+1):goGallery(gi-1);});

window.addEventListener('load',function(){setCardWidths();});
window.addEventListener('resize',function(){setCardWidths();});

/* MENU FILTER */
function filterMenu(cat,btn){
  document.querySelectorAll('.mtab').forEach(function(t){t.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('.mitem').forEach(function(item){
    var cats=item.dataset.cat||'';
    var show=cat==='all'||cats.includes(cat);
    if(show){item.style.display='';setTimeout(function(){item.style.opacity='1';},10);}
    else{item.style.opacity='0';setTimeout(function(){item.style.display='none';},300);}
  });
}

/* SCROLL REVEAL */
var rvEls=document.querySelectorAll('.rv,.rvl,.rvr');
new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:0.1}).observe(document.documentElement);
var rvObs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:0.1});
rvEls.forEach(function(el){rvObs.observe(el);});

/* CONTACT FORM */
function submitForm(){
  var name=document.getElementById('fName').value.trim();
  if(!name){
    var inp=document.getElementById('fName');
    inp.style.borderColor='rgba(224,123,57,.7)';
    inp.focus();
    return;
  }
  document.getElementById('cForm').style.display='none';
  document.getElementById('fOk').style.display='block';
  setTimeout(function(){
    var msg=encodeURIComponent('Hello Chef Anne! My name is '+name+'. I just filled the contact form on your website and would like to place an order or make an enquiry. Please get back to me. Thank you!');
    window.open('https://wa.me/2349119509083?text='+msg,'_blank');
  },900);
}
