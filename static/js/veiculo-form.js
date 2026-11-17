/* GAO Gestor — veiculo-form.js
   Modal de cadastrar/editar veículo + confirmação de excluir.
   Uso: GKVeic.novo(cb) · GKVeic.editar(dados, cb) · GKVeic.excluir(rotulo, onOk) */
(function(){
  var TIPOS=['Van','Furgão','Caminhão','Utilitário'];
  function ic(n,cls){ return '<i data-lucide="'+n+'" class="gk-ic '+(cls||'')+'"></i>'; }
  function campo(id,label,req,inner,err){ return '<div class="gk-field"><label class="gk-label" for="'+id+'">'+label+(req?'<span class="gk-req">*</span>':'')+'</label>'+inner+(err?'<span class="gk-error" hidden>'+err+'</span>':'')+'</div>'; }
  var html =
  '<div class="gk-overlay" id="ovVeic"><div class="gk-scrim" data-close="ovVeic"></div>'
  +'<div class="gk-modal is-form" role="dialog" aria-labelledby="vcTitle">'
  +'<div class="gk-modal-head"><div class="gk-modal-title"><span class="gk-title-ic">'+ic('truck')+'</span><h2 class="gk-h2" id="vcTitle">Cadastrar veículo</h2></div><button class="gk-btn gk-btn-secondary gk-btn-icon gk-btn-sm" data-close="ovVeic" aria-label="Fechar">'+ic('x')+'</button></div>'
  +'<div class="gk-modal-body" style="border-top:1px solid var(--line)"><form class="gk-form" id="vcForm" onsubmit="return false">'
  +campo('vcPlaca','Placa',true,'<input class="gk-input" id="vcPlaca" data-required maxlength="8" autocapitalize="characters" placeholder="ABC-1D23">','Informe a placa.')
  +'<div class="gk-grid-2">'
  +campo('vcModelo','Modelo',true,'<input class="gk-input" id="vcModelo" data-required placeholder="Ex.: Fiat Ducato">','Informe o modelo.')
  +campo('vcAno','Ano',false,'<input class="gk-input" id="vcAno" inputmode="numeric" maxlength="4" placeholder="Ex.: 2022">')
  +campo('vcCap','Capacidade (gaiolas)',true,'<input class="gk-input" id="vcCap" data-required inputmode="numeric" maxlength="3" placeholder="Ex.: 40">','Informe a capacidade.')
  +campo('vcTipo','Tipo',false,'<select class="gk-select" id="vcTipo"><option value="">Selecione</option>'+TIPOS.map(function(t){ return '<option>'+t+'</option>'; }).join('')+'</select>')
  +'</div>'
  +'<div class="gk-status-row" style="padding-top:var(--space-5);border-top:1px solid var(--line)"><div><h3 class="gk-h3">Situação</h3><div class="gk-caption" id="vcStatusDesc"></div></div>'
  +'<div class="gk-inline"><input type="checkbox" class="gk-switch" id="vcStatus" checked><span class="gk-on" id="vcStatusTxt">Ativo</span></div></div>'
  +'<div class="gk-logrow" id="vcLog" hidden><span>'+ic('clock')+'Veículo criado em 22/10/2026</span><span>'+ic('clock')+'Última edição em 10/11/2026</span></div>'
  +'</form></div>'
  +'<div class="gk-modal-foot"><button class="gk-btn gk-btn-ghost" data-close="ovVeic">Cancelar</button><button class="gk-btn gk-btn-primary" id="vcSave">Cadastrar veículo</button></div>'
  +'</div></div>'
  +'<div class="gk-overlay" id="ovDelVc"><div class="gk-scrim" data-close="ovDelVc"></div><div class="gk-modal" role="dialog"><div class="gk-modal-body"><div class="gk-modal-icon is-bad">'+ic('trash-2')+'</div><h2 class="gk-h2">Excluir veículo?</h2><p id="vcDelText"></p></div>'
  +'<div class="gk-modal-foot"><button class="gk-btn gk-btn-ghost" data-close="ovDelVc">Cancelar</button><button class="gk-btn gk-btn-danger" id="vcDelOk">'+ic('trash-2')+'Excluir</button></div></div></div>';
  var wrap=document.createElement('div'); wrap.innerHTML=html; document.body.appendChild(wrap);
  var $=function(id){ return document.getElementById(id); };
  var mode='novo', onSave=null, onDel=null, initial='', sw=$('vcStatus'), stx=$('vcStatusTxt');
  function dados(){ return { placa:$('vcPlaca').value.trim(), modelo:$('vcModelo').value.trim(), cap:$('vcCap').value.trim(), tipo:$('vcTipo').value, ano:$('vcAno').value.trim(), status:sw.checked?'ativo':'inativo' }; }
  function snap(){ return JSON.stringify(dados()); }
  function dirty(){ if(mode==='editar') $('vcSave').disabled=(snap()===initial); }
  function limpaErro(inp){ var f=inp.closest('.gk-field'); f.classList.remove('is-error'); var e=f.querySelector('.gk-error'); if(e) e.hidden=true; }
  $('vcPlaca').addEventListener('input',function(){ var v=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,7); this.value=v.length>3?v.slice(0,3)+'-'+v.slice(3):v; });
  ['vcCap','vcAno'].forEach(function(id){ $(id).addEventListener('input',function(){ this.value=this.value.replace(/\D/g,''); }); });
  document.querySelectorAll('#vcForm .gk-input,#vcForm .gk-select').forEach(function(el){ el.addEventListener('input',function(){ limpaErro(el); dirty(); }); el.addEventListener('change',dirty); });
  function setStatus(on){ sw.checked=on; stx.textContent=on?'Ativo':'Inativo'; stx.classList.toggle('off',!on); }
  sw.addEventListener('change',function(){ setStatus(sw.checked); dirty(); });
  $('vcSave').addEventListener('click',function(){
    var ok=true;
    document.querySelectorAll('#vcForm [data-required]').forEach(function(inp){ var bad=!inp.value.trim() || (inp.id==='vcPlaca'&&inp.value.replace('-','').length<7); var f=inp.closest('.gk-field'); f.classList.toggle('is-error',bad); f.querySelector('.gk-error').hidden=!bad; if(bad&&ok){ inp.focus(); ok=false; } });
    if(!ok) return; GK.close('ovVeic'); if(onSave) onSave(dados());
  });
  function reset(){ document.querySelectorAll('#vcForm .gk-field').forEach(function(f){ f.classList.remove('is-error'); var e=f.querySelector('.gk-error'); if(e) e.hidden=true; }); }
  window.GKVeic={
    novo:function(cb){ onSave=cb||null; mode='novo'; reset(); $('vcTitle').textContent='Cadastrar veículo'; $('vcSave').textContent='Cadastrar veículo'; $('vcSave').disabled=false; $('vcLog').hidden=true;
      ['vcPlaca','vcModelo','vcCap','vcAno'].forEach(function(id){ $(id).value=''; }); $('vcTipo').value=''; setStatus(true); sw.disabled=true;
      $('vcStatusDesc').textContent='O veículo será cadastrado como Ativo. Você poderá alterar a situação na edição.'; GK.open('ovVeic'); $('vcPlaca').focus(); },
    editar:function(d,cb){ onSave=cb||null; mode='editar'; d=d||{}; reset(); $('vcTitle').textContent='Editar veículo'; $('vcSave').textContent='Salvar alterações'; $('vcLog').hidden=false;
      $('vcPlaca').value=d.placa||''; $('vcModelo').value=d.modelo||''; $('vcCap').value=d.cap||''; $('vcTipo').value=d.tipo||''; $('vcAno').value=d.ano||''; sw.disabled=false; setStatus(d.status!=='inativo');
      $('vcStatusDesc').textContent='Ao inativar, o veículo deixa de aparecer para escolha nas viagens. O histórico é mantido.';
      initial=snap(); $('vcSave').disabled=true; GK.open('ovVeic'); },
    excluir:function(rotulo,cb){ onDel=cb||null; $('vcDelText').textContent=(rotulo||'Este veículo')+' será removido do cadastro. Para manter o histórico de viagens, inative o veículo em vez de excluir.'; GK.open('ovDelVc'); }
  };
  $('vcDelOk').addEventListener('click',function(){ GK.close('ovDelVc'); if(onDel) onDel(); });
  GK.popovers(); GK.icons();
})();
