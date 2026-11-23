/* Painel lateral da rota (mapa esquemático + linha do tempo). Usado em Operação e em Viagens.
   Tudo aqui é simulado: no app real vem dos eventos e do GPS do celular. */
(function(){
  var $=function(id){ return document.getElementById(id); };
  function first(n){ return n.split(' ')[0]; }
  function fmtP(min){ return min>=60?Math.floor(min/60)+'h'+('0'+min%60).slice(-2):min+' min'; }
  function dados(){
    var R=[
    {nome:'Rota Norte',cli:6,lib:2,tot:5,col:1,par:[0,6],st:'Carregando',m:[{n:'Felipe Moraes',c:3,e:0}]},
    {nome:'Rota Hospitalar',cli:8,lib:1,tot:6,col:2,par:[5,8],st:'Em andamento',m:[{n:'Ronaldo Araújo',c:3,e:2,cl:[0]},{n:'Gustavo Lima',c:2,e:1,cl:[0]}]},
    {nome:'Rota Centro',cli:5,lib:0,tot:4,col:1,par:[3,5],st:'Em andamento',m:[{n:'Carlos Henrique',c:2,e:1,cl:[0]},{n:'Rodrigo Alves',c:2,e:1,cl:[],pmin:130}]},
    {nome:'Rota Jardins',cli:4,lib:0,tot:3,col:1,par:[1,4],st:'Em andamento',m:[{n:'Bruno Castro',c:3,e:1,cl:[0],pmin:45}]},
    {nome:'Rota Sul',cli:4,lib:0,tot:3,col:0,par:[4,4],st:'Concluída',m:[{n:'Mariana Lopes',c:3,e:3}]},
    {nome:'Rota Oeste',cli:3,lib:3,tot:3,col:1,par:[0,3],st:'Aguardando início',m:[{n:'Paulo César',c:0,e:0,hoje:true}]},
    {nome:'Rota Leste',cli:4,lib:3,tot:3,col:0,par:[0,4],st:'Aguardando início',m:[{n:'Anderson Souza',c:0,e:0}]}
    ];
    return R;
  }
  function criar(R){
  var NOW=12*60;
  var STOPS={
    'Rota Hospitalar':[['Hospital Amparo','Setor Bueno'],['Hospital Dia','Setor Leste Universitário'],['Hospital Santa Genoveva','Setor Oeste'],['Maternidade Nascer','Setor Marista'],['Hospital Ortopédico','Setor Bueno'],['Hospital do Coração','Setor Sul'],['Clínica Vida Plena','Setor Central'],['Hospital Oncológico','Setor Universitário']],
    'Rota Centro':[['Santa Casa','Setor Central'],['Clínica Central','Setor Central'],['Hospital São Salvador','Setor Oeste'],['Laboratório Vida','Setor Central'],['Clínica Dermato','Setor Marista']],
    'Rota Norte':[['Laboratório Central','Setor Central'],['Hospital Norte','Jardim Guanabara'],['Clínica Bem Estar','Vila Nova'],['Hospital Infantil','Setor Norte Ferroviário'],['UPA Norte','Jardim Guanabara'],['Clínica Renal','Setor Central']],
    'Rota Jardins':[['Clínica Jardim Goiás','Jardim Goiás'],['Hospital Jardim América','Jardim América'],['Laboratório Alphaville','Alphaville'],['Clínica Flamboyant','Jardim Goiás']],
    'Rota Sul':[['Clínica São Lucas','Setor Bueno'],['Hospital Sul','Jardim América'],['Clínica Ortopédica','Setor Bueno'],['Pronto Socorro Sul','Jardim América']],
    'Rota Oeste':[['HEMU','Setor Oeste'],['Hospital Oeste','Setor Oeste'],['Clínica Oeste','Setor Oeste']],
    'Rota Leste':[['Hospital Dia','Setor Leste Universitário'],['Laboratório Leste','Setor Leste Universitário'],['Clínica Leste','Setor Leste Universitário'],['Hospital Leste','Setor Leste Universitário']]
  };
  function hm(t){ return ('0'+Math.floor(t/60)).slice(-2)+':'+('0'+(t%60)).slice(-2); }
  var PLACA=['GAO-2847','GAO-1234','GAO-0981','GAO-2210','GAO-3105','GAO-0764'], RECEB=['Mariana Lopes','Carlos Henrique','Juliana Prado','Ricardo Nunes'], SETOR=['Rouparia','Centro cirúrgico','Governança','Recepção'];
  /* eventos do jeito que o app do motorista registra: início da viagem (check-in do veículo), carregamento por comanda,
     entregas (todas primeiro), coletas, check-out e fim da viagem */
  function evts(r,mi){
    var m=r.m[mi], S=STOPS[r.nome], idx=R.indexOf(r), out=[];
    if(r.st==='Aguardando início'||(m.c===0&&m.e===0&&r.st!=='Carregando')) return out;
    var t0=400+mi*12+idx*3, cli=function(k){ return S[(mi*3+k)%S.length]; }, id=function(k){ return 42300+idx*10+mi*5+k; }, gai=function(k){ return (k*3+idx)%4+3; };
    out.push({t:t0,k:'sai',a:'Iniciou a viagem',l:'Veículo '+PLACA[(idx+mi*3)%6]+' · check-in feito'});
    for(var k=0;k<m.c;k++){
      out.push({t:t0+10+k*6,k:'car',a:'Confirmou o carregamento',l:'Comanda #'+id(k)+' · '+cli(k)[0],x:gai(k)+' gaiolas'});
      if(idx===0&&mi===0&&k===1) out.push({t:t0+10+k*6+3,k:'oc',a:'Registrou um problema',l:'Etiqueta ilegível · 1 gaiola'});
    }
    if(r.st==='Carregando'){ out.push({t:NOW,k:'now',a:'Carregando',l:'Conferindo as gaiolas de '+cli(m.c)[0],x:'carregamento'}); return out; }
    var sai=t0+10+m.c*6+8, pm=m.pmin||0, ult=pm?NOW-pm:sai+35+(m.e-1)*55;
    out.push({t:sai,k:'sai',a:'Iniciou as entregas',l:'Rota calculada · '+m.c+(m.c>1?' paradas':' parada')});
    for(k=0;k<m.e;k++) out.push({t:ult-(m.e-1-k)*55,k:'ent',a:'Confirmou a entrega',l:'Comanda #'+id(k)+' · '+cli(k)[0],x:'Recebido por '+RECEB[(k+idx)%4]+' · '+SETOR[(k+mi)%4]});
    if(r.st==='Concluída'){
      out.push({t:ult+45,k:'col',a:'Confirmou a coleta',l:cli(0)[0],x:'Entregue por '+RECEB[(idx+1)%4]+' · '+SETOR[1]});
      out.push({t:ult+95,k:'sai',a:'Fez o check-out do veículo',l:'Higienização registrada'});
      out.push({t:ult+107,k:'sai',a:'Finalizou a viagem',l:'38 km rodados',end:1}); return out;
    }
    var prox=m.e<m.c?cli(m.e)[0]:'a coleta';
    if(pm) out.push({t:NOW,k:'now',stop:1,a:'Parado',l:'Perto de '+cli(m.e-1)[0],x:'Sem confirmar parada há '+fmtP(pm).replace('h',' h ')});
    else out.push({t:NOW,k:'now',a:'Em trânsito',l:'Indo para '+prox,x:'Em trânsito para '+prox});
    return out;
  }
  var cur={r:null}, COR=['var(--primary)','var(--fg)','var(--muted)','var(--bad)'], INK=['var(--primary-ink)','var(--fg)','var(--fg)','var(--bad-ink)'];
  function cs(i){ return COR[i%4]+';--di:'+INK[i%4]; }
  function ini(n){ var q=n.split(' '); return q[0][0]+q[q.length-1][0]; }
  /* monta um motorista: eventos, pontos do mapa e caminho (g.n numera os eventos de todos juntos) */
  function build(r,mi,g){
    var m=r.m[mi], E=evts(r,mi), o={m:m,mi:mi,E:E,T:[],seq:[],P:[]}; if(!E.length) return o;
    E.forEach(function(e){ e.i=g.n++; e.mi=mi; });
    var car=E.filter(function(e){ return e.k==='car'; }), oc=E.filter(function(e){ return e.k==='oc'; }).length, ini0=E.filter(function(e){ return e.a==='Iniciou a viagem'; })[0], T=o.T;
    if(car.length) T.push({mi:mi,t:ini0.t,k:'car',a:'Início e carregamento',l:'Carregou '+car.length+(car.length>1?' comandas':' comanda')+(oc?' · '+oc+(oc>1?' problemas':' problema'):''),x:'Viagem iniciada',ids:[ini0.i].concat(car.map(function(c){ return c.i; }),E.filter(function(e){ return e.k==='oc'; }).map(function(c){ return c.i; }))});
    E.forEach(function(e){ if(e.k!=='car'&&e.k!=='oc'&&!(car.length&&e===ini0)) T.push({mi:mi,t:e.t,k:e.k,a:e.a,l:e.l,x:e.x,ids:[e.i],stop:e.stop,end:e.end,now:e.k==='now'}); });
    T.sort(function(a,b){ return a.t-b.t; });
    var S=STOPS[r.nome], DOTS=T.filter(function(e){ return e.k==='car'||e.k==='ent'||e.k==='col'||e.k==='now'||e.end; });
    o.fimE=DOTS.filter(function(e){ return e.end; })[0]; o.nowE=DOTS.filter(function(e){ return e.now; })[0];
    var done=DOTS.filter(function(e){ return !e.now&&!e.end; }), pend=[];
    var ridx=R.indexOf(r), pcli=function(k){ return S[(mi*3+k)%S.length][0]; };
    if(!o.fimE){
      for(var q=m.e;q<m.c;q++) pend.push({mi:mi,k:'pend',a:'Entregar',l:pcli(q),x:'Comanda #'+(42300+ridx*10+mi*5+q)+' · '+((q*3+ridx)%4+3)+' gaiolas',ids:[g.n++]});
      (m.cl||[]).forEach(function(q){ if(q<m.e) pend.push({mi:mi,k:'pend',a:'Coletar',l:pcli(q),x:'Entregue · coleta marcada',ids:[g.n++]}); });
    }
    var seq=o.seq=done.concat(pend), n=seq.length+(o.fimE?1:0), P=o.P;
    seq.forEach(function(e,i){ P.push(i===0?[70,178-mi*22]:[70+470*i/Math.max(n,2),Math.max(40,Math.min(206,118+(mi%2?36:-36)+38*Math.sin(i*1.9+R.indexOf(r)*.7+mi*3.1)))]); });
    o.lastD=done.length-1; o.cp=null;
    if(o.nowE){ var nx=P[o.lastD+1], a0=P[o.lastD]; o.cp=nx?[a0[0]+(nx[0]-a0[0])*.45,a0[1]+(nx[1]-a0[1])*.45]:[a0[0]+40,a0[1]-26]; }
    o.fimP=[96+mi*34,208];
    o.solid=P.slice(0,o.lastD+1); if(o.cp) o.solid.push(o.cp); if(o.fimE) o.solid.push(o.fimP);
    o.dash=o.cp?[o.cp].concat(P.slice(o.lastD+1)):[];
    return o;
  }
  function curve(Q){ if(Q.length<2) return ''; var d='M'+Q[0][0]+' '+Q[0][1]; for(var i=0;i<Q.length-1;i++){ var p0=Q[i-1]||Q[i],p1=Q[i],p2=Q[i+1],p3=Q[i+2]||p2; d+=' C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+' '+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+' '+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1].toFixed(1); } return d; }
  function pintar(){
    var r=cur.r, g={n:0}, D=r.m.map(function(x,i){ return build(r,i,g); }), multi=r.m.length>1, ativos=D.filter(function(o){ return o.E.length; });
    $('rAv').hidden=!r.m.some(function(x){ return x.pmin; });
    var h='';
    if(!ativos.length){ $('rB').innerHTML='<div class="gk-tl-empty">Ainda não começou. Quando o motorista iniciar a viagem no app, os registros aparecem aqui.</div>'; return wireTL(); }
    /* mapa esquemático: a posição de cada parada é simulada (no app real vem do GPS) */
    var rd=''; [28,80,134,186,226].forEach(function(y,i){ rd+='<path d="M0 '+y+' L600 '+(y+(i%2?10:-8))+'" stroke-width="'+(i%2?5:8)+'"/>'; });
    [58,150,248,342,436,528].forEach(function(x,i){ rd+='<path d="M'+x+' 0 L'+(x+(i%2?14:-10))+' 240" stroke-width="'+(i%2?8:5)+'"/>'; });
    rd+='<path d="M0 206 L250 0" stroke-width="6"/><path d="M290 240 L600 36" stroke-width="6"/>';
    var ini0=Math.min.apply(null,ativos.map(function(o){ return o.E[0].t; })), todos=ativos.every(function(o){ return o.fimE; }), fimT=todos?Math.max.apply(null,ativos.map(function(o){ return o.fimE.t; })):NOW, tm=fimT-ini0, tmTxt=Math.floor(tm/60)+' h '+('0'+tm%60).slice(-2);
    var ents=ativos.reduce(function(a,o){ return a+o.m.e; },0), cars=ativos.reduce(function(a,o){ return a+o.m.c; },0);
    var svg='', dots='', DT=[];
    function dotHTML(e,x,y,cls,txt,dc){ var i=DT.push(e)-1; return '<button type="button" class="gk-tl-d '+cls+'" style="left:'+(x/6)+'%;top:'+(y/2.4)+'%'+(dc?';--dc:'+dc:'')+'" data-ids="'+e.ids.join(' ')+'" data-ti="'+i+'" aria-label="'+(e.t!=null?hm(e.t)+' · ':'')+e.a+'">'+(txt||'')+'</button>'; }
    ativos.forEach(function(o){ var dc=cs(o.mi);
      svg+='<path class="gk-mp-p is-rest" d="'+curve(o.dash)+'"/><path class="gk-mp-p" style="--dc:'+dc+'" d="'+curve(o.solid)+'"/>';
      o.seq.forEach(function(e,i){ dots+=dotHTML(e,o.P[i][0],o.P[i][1],e.k==='pend'?'is-pend':'is-'+({ent:'ent',col:'col',car:'car'}[e.k])); });
      if(o.fimE) dots+=dotHTML(o.fimE,o.fimP[0],o.fimP[1],'is-av',ini(o.m.n),dc);
      if(o.nowE) dots+=dotHTML(o.nowE,o.cp[0],o.cp[1],'is-av is-now',ini(o.m.n),dc);
    });
    cur.T=DT;
    h+='<div class="gk-mp"><svg viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><g class="gk-mp-r" fill="none" stroke-linecap="round">'+rd+'</g>'+svg+'</svg>'
      +'<div class="gk-mp-s"><span>Tempo de viagem</span><b>'+tmTxt+'</b></div><div class="gk-mp-s is-r"><span>Entregas</span><b>'+ents+' de '+cars+'</b></div>'+dots+'</div>';
    h+='<div class="gk-tl-lg">'+(multi?D.map(function(o,i){ return '<span><i class="is-ln" style="background:'+COR[i%4]+'"></i><b>'+first(o.m.n)+'</b>'+(o.E.length?'':' · não iniciou')+'</span>'; }).join(''):'')+'<span><i style="background:var(--read)"></i>Carregamento</span><span><i style="background:var(--ok)"></i>Entrega</span><span><i class="is-ring"></i>Coleta</span><span><i class="is-pend"></i>Próxima parada</span></div>';
    var L=[]; ativos.forEach(function(o){ L=L.concat(o.E); }); L.sort(function(a,b){ return a.t-b.t||a.i-b.i; });
    var PN=[]; ativos.forEach(function(o){ PN=PN.concat(o.seq.filter(function(e){ return e.k==='pend'; })); });
    var pendH=PN.map(function(e){ return '<div class="gk-tl-i is-pend" data-i="'+e.ids[0]+'"><time>—</time><i></i><div><b>'+(multi?'<em style="--dc:'+cs(e.mi)+'">'+first(r.m[e.mi].n)+'</em>'+GK.sep:'')+e.a+'</b><br><span>'+GK.sp(e.l)+GK.sep+e.x+'</span></div></div>'; }).join('');
    h+='<div class="gk-tl-list">'+pendH+L.reverse().map(function(e){ return '<div class="gk-tl-i is-'+e.k+(e.stop?' is-stop':'')+'" data-i="'+e.i+'"><time>'+hm(e.t)+'</time><i></i><div><b>'+(multi?'<em style="--dc:'+cs(e.mi)+'">'+first(r.m[e.mi].n)+'</em>'+GK.sep:'')+e.a+'</b><br><span>'+GK.sp(e.l)+(e.x&&!e.stop&&e.k!=='now'?GK.sep+GK.sp(e.x):'')+'</span></div></div>'; }).join('')+'</div>';
    $('rB').innerHTML=h; wireTL();
  }
  function wireTL(){
    var B=$('rB'); GK.icons();
    B.querySelectorAll('.gk-tl-d').forEach(function(d){
      var e=cur.T[+d.getAttribute('data-ti')], pre=cur.r.m.length>1?first(cur.r.m[e.mi].n)+' · ':''; GK.tip.bind(d,pre+e.a,e.l,(e.k==='pend'?'Ainda não confirmada':(e.x&&!e.now?e.x+' · ':'')+(e.now?'agora, ':'às ')+hm(e.t)));
      d.addEventListener('mouseenter',function(){ hot(d.getAttribute('data-ids').split(' '),true); }); d.addEventListener('mouseleave',function(){ hot(d.getAttribute('data-ids').split(' '),false); });
    });
    B.querySelectorAll('.gk-tl-i').forEach(function(it){
      it.addEventListener('mouseenter',function(){ dot(it.getAttribute('data-i'),true); }); it.addEventListener('mouseleave',function(){ dot(it.getAttribute('data-i'),false); });
    });
  }
  function hot(ids,on){ ids.forEach(function(i){ var n=$('rB').querySelector('.gk-tl-i[data-i="'+i+'"]'); if(n) n.classList.toggle('is-hot',on); }); }
  function dot(i,on){ $('rB').querySelectorAll('.gk-tl-d').forEach(function(d){ if((' '+d.getAttribute('data-ids')+' ').indexOf(' '+i+' ')>=0) d.classList.toggle('is-hot',on); }); }
  function ver(r){
    $('rT').textContent=r.nome; cur.r=r;
    if(!r.m.length){ $('rAv').hidden=true; $('rB').innerHTML='<div class="gk-tl-empty">Nenhum motorista designado hoje.</div>'; }
    else pintar();
    GK.open('ovR'); GK.icons();
  }
    return {ver:ver,cur:cur,NOW:NOW,hm:hm,evts:evts};
  }
  window.RotaPanel={dados:dados,criar:criar,first:first,fmtP:fmtP};
})();
