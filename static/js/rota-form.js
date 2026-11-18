/* GAO Gestor — rota-form.js
   Modal de cadastrar/editar rota + confirmação de excluir.
   Uso: GKRota.novo(cb) · GKRota.editar(dados, cb) · GKRota.excluir(nome, onOk) */
(function(){
  var CLI=[['amparo','Hospital Amparo'],['hemu','HEMU'],['santacasa','Santa Casa'],['saolucas','Clínica São Lucas'],['central','Laboratório Central'],['hospitaldia','Hospital Dia']];
  var MOT=[['ronaldo','Ronaldo Araújo'],['thiago','Thiago Nunes'],['marcos','Marcos Lima'],['pedro','Pedro Alves'],['joao','João Mendes']];
  function ic(n,cls){ return '<i data-lucide="'+n+'" class="gk-ic '+(cls||'')+'"></i>'; }
  var html =
  '<div class="gk-overlay" id="ovRota"><div class="gk-scrim" data-close="ovRota"></div>'
  +'<div class="gk-modal is-form has-ms" role="dialog" aria-labelledby="rtTitle">'
  +'<div class="gk-modal-head"><div class="gk-modal-title"><span class="gk-title-ic">'+ic('route')+'</span><h2 class="gk-h2" id="rtTitle">Cadastrar rota</h2></div><button class="gk-btn gk-btn-secondary gk-btn-icon gk-btn-sm" data-close="ovRota" aria-label="Fechar">'+ic('x')+'</button></div>'
  +'<div class="gk-modal-body" style="border-top:1px solid var(--line)"><form class="gk-form" id="rtForm" onsubmit="return false">'
  +'<div class="gk-field"><label class="gk-label" for="rtNome">Nome da rota<span class="gk-req">*</span></label><input class="gk-input" id="rtNome" placeholder="Ex.: Rota Hospitalar"><span class="gk-error" hidden>Dê um nome à rota.</span></div>'
  +'<div class="gk-field"><label class="gk-label">Clientes atendidos</label>'+GK.msHTML('rtCli','Selecione os clientes','Buscar cliente',CLI,true)+'</div>'
  +'<div class="gk-field"><label class="gk-label">Motoristas designados</label>'+GK.msHTML('rtMot','Selecione os motoristas','Buscar motorista',MOT,true)+'<span class="gk-help">Vários motoristas podem fazer a mesma rota.</span></div>'
  +'<div class="gk-logrow" id="rtLog" hidden><span>'+ic('clock')+'Rota criada em 22/10/2026</span><span>'+ic('clock')+'Última edição em 10/11/2026</span></div>'
  +'</form></div>'
  +'<div class="gk-modal-foot"><button class="gk-btn gk-btn-ghost" data-close="ovRota">Cancelar</button><button class="gk-btn gk-btn-primary" id="rtSave">Cadastrar rota</button></div>'
  +'</div></div>'
  +'<div class="gk-overlay" id="ovDelRt"><div class="gk-scrim" data-close="ovDelRt"></div><div class="gk-modal" role="dialog"><div class="gk-modal-body"><div class="gk-modal-icon is-bad">'+ic('trash-2')+'</div><h2 class="gk-h2">Excluir rota?</h2><p id="rtDelText"></p></div>'
  +'<div class="gk-modal-foot"><button class="gk-btn gk-btn-ghost" data-close="ovDelRt">Cancelar</button><button class="gk-btn gk-btn-danger" id="rtDelOk">'+ic('trash-2')+'Excluir</button></div></div></div>';
  var wrap=document.createElement('div'); wrap.innerHTML=html; document.body.appendChild(wrap);
  var $=function(id){ return document.getElementById(id); };
  var mode='novo', onSave=null, onDel=null, initial='';
  function snap(){ return JSON.stringify([$('rtNome').value,cli.get().sort(),mot.get().sort()]); }
  function dirty(){ if(mode==='editar') $('rtSave').disabled=(snap()===initial); }
  var cli=GK.multiselect($('rtCli'),dirty), mot=GK.multiselect($('rtMot'),dirty);
  $('rtNome').addEventListener('input',function(){ var f=this.closest('.gk-field'); f.classList.remove('is-error'); f.querySelector('.gk-error').hidden=true; dirty(); });
  $('rtSave').addEventListener('click',function(){
    var v=$('rtNome').value.trim(), f=$('rtNome').closest('.gk-field');
    if(!v){ f.classList.add('is-error'); f.querySelector('.gk-error').hidden=false; $('rtNome').focus(); return; }
    GK.close('ovRota'); GK.toast(mode==='novo'?'Rota cadastrada':'Alterações salvas'); if(onSave) onSave({ nome:v, cli:cli.get(), mot:mot.get() });
  });
  function abrir(){ GK.open('ovRota'); }
  window.GKRota={
    novo:function(cb){ onSave=cb||null; mode='novo'; $('rtTitle').textContent='Cadastrar rota'; $('rtSave').textContent='Cadastrar rota'; $('rtSave').disabled=false; $('rtLog').hidden=true;
      $('rtNome').value=''; cli.set([]); mot.set([]); cli.close(); mot.close(); var f=$('rtNome').closest('.gk-field'); f.classList.remove('is-error'); f.querySelector('.gk-error').hidden=true; abrir(); $('rtNome').focus(); },
    editar:function(d,cb){ onSave=cb||null; mode='editar'; d=d||{}; $('rtTitle').textContent='Editar rota'; $('rtSave').textContent='Salvar alterações'; $('rtLog').hidden=false;
      $('rtNome').value=d.nome||''; cli.set(d.cli||[]); mot.set(d.mot||[]); cli.close(); mot.close(); var f=$('rtNome').closest('.gk-field'); f.classList.remove('is-error'); f.querySelector('.gk-error').hidden=true;
      initial=snap(); $('rtSave').disabled=true; abrir(); },
    excluir:function(nome,cb){ onDel=cb||null; $('rtDelText').textContent=(nome||'A rota')+' será removida. Os clientes vinculados ficam sem rota até você designar outra.'; GK.open('ovDelRt'); }
  };
  $('rtDelOk').addEventListener('click',function(){ GK.close('ovDelRt'); GK.toast('Rota excluída'); if(onDel) onDel(); });
  GK.popovers(); GK.icons();
})();
