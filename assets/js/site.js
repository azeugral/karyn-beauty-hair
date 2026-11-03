(function(){
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var toque=matchMedia('(hover:none),(max-width:820px)').matches,calmo=matchMedia('(prefers-reduced-motion:reduce)').matches;

// fundo de fios: shader no desktop, MP4 no toque
function fundo(sec,o){
 var el=$('.fundo',sec),cv=$('canvas',sec);
 if(toque||calmo||!window.KFios){
  if(cv)cv.remove();
  if(!el||calmo)return;
  new IntersectionObserver(function(e){
   if(e[0].isIntersecting){if(!el.getAttribute('src'))el.src=el.dataset.src;el.play().catch(function(){});}
   else if(el.getAttribute('src'))el.pause();
  },{rootMargin:'200px'}).observe(sec);
  return;
 }
 if(el)el.remove();
 var f=KFios.inicia(cv,{forca:o.forca,dpr:o.dpr});
 if(!f)return;
 var vis=false,t0=performance.now(),ult=0,passo=1000/(o.fps||60);
 new IntersectionObserver(function(e){vis=e[0].isIntersecting;}).observe(sec);
 (function lp(n){requestAnimationFrame(lp);if(!vis||n-ult<passo)return;ult=n;f.desenha((n-t0)/1000*6.28318530718/16);})(0);
}
fundo($('.hero'),{forca:1,dpr:2});
fundo($('.agenda'),{forca:.8,dpr:1,fps:30});

// topo
var topo=$('.topo');function rola(){topo.classList.toggle('fixo',scrollY>40);}addEventListener('scroll',rola,{passive:true});rola();

// menu do celular
var gav=$('.gaveta');function fecha(){gav.hidden=true;document.body.style.overflow='';}
$('.abre').addEventListener('click',function(){gav.hidden=false;document.body.style.overflow='hidden';});
$('.fecha').addEventListener('click',fecha);

// rolagem animada dos links internos
function rolarAte(y){if(calmo){scrollTo(0,y);return;}var i=scrollY,d=y-i,t0=performance.now(),D=Math.min(1100,420+Math.abs(d)*.28);
 (function p(n){var k=Math.min(1,(n-t0)/D),e=1-Math.pow(1-k,4);scrollTo(0,i+d*e);if(k<1)requestAnimationFrame(p);})(t0);}
$$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var h=a.getAttribute('href'),al=h.length>1&&$(h);if(!al&&h!=='#')return;e.preventDefault();fecha();
 rolarAte(al?al.getBoundingClientRect().top+scrollY-66:0);});});

// entrada por rolagem
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
$$('.rv').forEach(function(x){io.observe(x);});

// aviso da agenda vence sozinho
var av=$('.aviso');if(av&&new Date()>new Date(av.dataset.ate+'T23:59:59'))av.hidden=true;

// comparador
$$('.comp').forEach(function(c){
 var inp=$('input',c),ativo=false;
 var pos=function(x){var r=c.getBoundingClientRect(),p=Math.max(2,Math.min(98,(x-r.left)/r.width*100));c.style.setProperty('--p',p+'%');inp.value=p;};
 c.addEventListener('pointerdown',function(e){ativo=true;c.setPointerCapture(e.pointerId);pos(e.clientX);});
 c.addEventListener('pointermove',function(e){if(ativo)pos(e.clientX);});
 ['pointerup','pointercancel'].forEach(function(n){c.addEventListener(n,function(){ativo=false;});});
 inp.addEventListener('input',function(){c.style.setProperty('--p',inp.value+'%');});
});

// filtros da galeria
var bts=$$('.filtros button'),itens=$$('.grade button'),base=innerWidth<=820?6:12,abertos=base,cat='todos';
function aplica(){var vis=itens.filter(function(i){return cat==='todos'||i.dataset.cat===cat;});
 itens.forEach(function(i){i.hidden=true;});vis.forEach(function(i,k){i.hidden=k>=abertos;});
 $('.mais').hidden=vis.length<=abertos;}
bts.forEach(function(b){b.addEventListener('click',function(){bts.forEach(function(x){x.setAttribute('aria-pressed',x===b);});cat=b.dataset.f;abertos=base;aplica();});});
$('.mais button').addEventListener('click',function(){abertos=99;aplica();});aplica();

// galeria aberta
var cx=$('.caixa'),ci=$('img',cx),atual=-1;
function lista(){return itens.filter(function(i){return !i.hidden;});}
function mostra(n){var l=lista();atual=(n+l.length)%l.length;var im=$('img',l[atual]);ci.src=im.currentSrc||im.src;ci.alt=im.alt;}
itens.forEach(function(i){i.addEventListener('click',function(){cx.hidden=false;document.body.style.overflow='hidden';mostra(lista().indexOf(i));});});
function fechaCx(){cx.hidden=true;document.body.style.overflow='';}
$('.f',cx).addEventListener('click',fechaCx);
$('.an',cx).addEventListener('click',function(){mostra(atual-1);});
$('.pr',cx).addEventListener('click',function(){mostra(atual+1);});
cx.addEventListener('click',function(e){if(e.target===cx)fechaCx();});
addEventListener('keydown',function(e){if(cx.hidden)return;if(e.key==='Escape')fechaCx();if(e.key==='ArrowLeft')mostra(atual-1);if(e.key==='ArrowRight')mostra(atual+1);});

// reels tocam só quando aparecem
var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){if(!v.getAttribute('src'))v.src=v.dataset.src;v.play().catch(function(){});}else v.pause();});},{threshold:.35});
$$('.reel video').forEach(function(v){vio.observe(v);});

// botão fixo sai de cima do formulário
new IntersectionObserver(function(e){$('.zap').hidden=e[0].isIntersecting;}).observe($('#agendar'));

// pedido pelo WhatsApp
$('#pedido').addEventListener('submit',function(e){e.preventDefault();var f=e.target,d=function(n){return f.elements[n].value.trim();};
 var t='Olá, Karyn! Vim pelo site e gostaria de agendar.\n\nNome: '+d('nome')+'\nServiço: '+d('servico')+'\nPeríodo: '+d('periodo');
 if(d('quimica'))t+='\nQuímica no cabelo: '+d('quimica');if(d('obs'))t+='\nObservação: '+d('obs');
 window.open('https://wa.me/5519992298053?text='+encodeURIComponent(t),'_blank','noopener');});
})();
