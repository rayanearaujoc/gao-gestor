/* GAO Gestor — motorista-form.js
   Modal em duas etapas (Dados · Acesso ao app) de cadastrar/editar motorista + modal de excluir.
   Mesmo conteúdo das páginas motorista-novo.html e motorista-editar.html, em painel.
   Uso: GKMot.novo() · GKMot.editar(dados) · GKMot.excluir(nome, onOk) */
(function(){
  var ROTAS=[['hospitalar','Rota Hospitalar'],['centro','Rota Centro'],['norte','Rota Norte'],['sul','Rota Sul']];
  function ic(n,cls){ return '<i data-lucide="'+n+'" class="gk-ic '+(cls||'')+'"></i>'; }

  var html =
  '<div class="gk-overlay" id="ovMot"><div class="gk-scrim" data-close="ovMot"></div>'
  +'<div class="gk-modal is-form has-ms" role="dialog" aria-labelledby="motTitle">'
  +'<div class="gk-modal-head"><div class="gk-modal-title"><span class="gk-title-ic">'+ic('user-round')+'</span><h2 class="gk-h2" id="motTitle">Cadastrar motorista</h2></div><button class="gk-btn gk-btn-secondary gk-btn-icon gk-btn-sm" data-close="ovMot" aria-label="Fechar">'+ic('x')+'</button></div>'
  +'<div class="gk-stepper"><button type="button" class="gk-stepper-i is-active" data-go="1"><span class="gk-step">1</span>Dados do motorista</button><span class="gk-stepper-sep"></span><button type="button" class="gk-stepper-i" data-go="2"><span class="gk-step">2</span>Acesso ao app</button></div>'
  +'<div class="gk-modal-body"><form class="gk-form" id="motForm" onsubmit="return false">'
  // etapa 1
  +'<div class="gk-pane" id="motP1">'
  +'<div class="gk-photo"><div class="gk-photo-slot" id="motFoto">'+ic('user','gk-ic-lg')+'</div>'
  +'<div class="gk-photo-actions"><div class="gk-photo-h">Foto do motorista</div><div class="gk-btns"><button class="gk-btn gk-btn-secondary gk-btn-sm" type="button" id="motFotoAdd">'+ic('upload')+'Enviar foto</button><button class="gk-btn gk-btn-ghost gk-btn-sm" type="button" id="motFotoRm" hidden>Remover</button></div><span class="gk-caption">JPG ou PNG, até 5 MB.</span></div><input type="file" id="motFotoInput" accept="image/*" hidden></div>'
  +'<div class="gk-field"><label class="gk-label" for="motNome">Nome completo<span class="gk-req">*</span></label><input class="gk-input" id="motNome" data-required placeholder="Ex.: Ronaldo Araújo"><span class="gk-error" hidden>Preencha o nome completo.</span></div>'
  +'<div class="gk-grid-2"><div class="gk-field"><label class="gk-label" for="motTel">Telefone de contato<span class="gk-req">*</span></label><input class="gk-input" id="motTel" type="tel" inputmode="tel" data-required placeholder="(11) 99982-4510"><span class="gk-error" hidden>Preencha o telefone.</span></div>'
  +'<div class="gk-field"><label class="gk-label" for="motPerfil">Perfil de escala</label><select class="gk-select" id="motPerfil"><option value="padrao">Padrão</option><option value="folg">Folguista</option></select></div></div>'
  +'<div class="gk-field"><label class="gk-label">Rotas designadas</label><div class="gk-ms is-up" id="motMs"><div class="gk-ms-field" id="motMsField"><span class="gk-ms-ph" id="motMsPh">Selecione as rotas</span></div>'+ic('chevron-down','gk-ms-chev')
  +'<div class="gk-pop gk-menu" id="motMsMenu"><div class="gk-ms-search"><div class="gk-input-wrap">'+ic('search')+'<input class="gk-input gk-input-sm" id="motMsQ" placeholder="Buscar rota" autocomplete="off"></div></div><div class="gk-ms-list" id="motMsList">'+ROTAS.map(function(r){ return '<label class="gk-check gk-menu-item" data-t="'+r[1].toLowerCase()+'"><input type="checkbox" value="'+r[0]+'" data-nm="'+r[1]+'">'+r[1]+'</label>'; }).join('')+'<div class="gk-ms-empty" id="motMsEmpty" hidden>Nenhuma rota encontrada.</div></div></div></div></div>'
  +'<div class="gk-logrow" id="motLog" hidden><span>'+ic('clock')+'Cadastro criado em 22/10/2026</span><span>'+ic('clock')+'Última edição em 10/11/2026</span></div>'
  +'</div>'
  // etapa 2
  +'<div class="gk-pane" id="motP2" hidden><div class="gk-form-section is-flat" id="motSec2" style="border:0;padding:0">'
  +'<div class="gk-form-fields gk-stack">'
  +'<div class="gk-field"><label class="gk-label" for="motUser">Usuário<span class="gk-req">*</span></label><div class="gk-input-wrap">'+ic('at-sign')+'<input class="gk-input" id="motUser" autocapitalize="none" data-required placeholder="Crie um usuário"></div><span class="gk-error" hidden>Crie um usuário.</span><span class="gk-help">O usuário deve ser único. Não use espaços.</span></div>'
  +'<div class="gk-field"><label class="gk-label" for="motSenha">Senha<span class="gk-req" id="motSenhaReq">*</span></label><div class="gk-input-wrap">'+ic('lock')+'<input class="gk-input has-eye" id="motSenha" type="password" placeholder="Crie uma senha segura"><button class="gk-eye" type="button" id="motEye" aria-label="Mostrar senha">'+ic('eye')+'</button></div><span class="gk-error" hidden>Crie uma senha.</span>'
  +'<ul class="gk-pwrules" id="motRules"><li data-r="len">Pelo menos 8 caracteres</li><li data-r="upper">Uma letra maiúscula</li><li data-r="lower">Uma letra minúscula</li><li data-r="num">Um número</li><li data-r="spec">Um caractere especial (recomendado)</li></ul><span class="gk-help" id="motSenhaHint" hidden>Deixe em branco para manter a senha atual.</span></div>'
  +'</div></div>'
  +'<div class="gk-status-row" style="padding-top:var(--space-5);border-top:1px solid var(--line)"><div><h3 class="gk-h3">Status de acesso</h3><div class="gk-caption" id="motStatusDesc"></div></div>'
  +'<div class="gk-inline"><input type="checkbox" class="gk-switch" id="motStatus" checked><span class="gk-on" id="motStatusTxt">Ativo</span></div></div>'
  +'</div>'
  +'</form></div>'
  +'<div class="gk-modal-foot"><div class="gk-left" id="motFootLeft"></div><button class="gk-btn gk-btn-ghost" id="motBack">Cancelar</button><button class="gk-btn gk-btn-primary" id="motNext">Próximo</button></div>'
  +'</div></div>'
  // modal excluir
  +'<div class="gk-overlay" id="ovDel"><div class="gk-scrim" data-close="ovDel"></div><div class="gk-modal" role="dialog"><div class="gk-modal-body"><div class="gk-modal-icon is-bad">'+ic('trash-2')+'</div><h2 class="gk-h2">Excluir motorista?</h2><p id="delText">Este motorista será removido do cadastro. Esta ação não pode ser desfeita.</p></div>'
  +'<div class="gk-modal-foot"><button class="gk-btn gk-btn-ghost" data-close="ovDel">Cancelar</button><button class="gk-btn gk-btn-danger" id="delOk">'+ic('trash-2')+'Excluir</button></div></div></div>';

  var wrap=document.createElement('div'); wrap.innerHTML=html; document.body.appendChild(wrap);
  var $=function(id){ return document.getElementById(id); };
  var mode='novo', onDel=null, onSave=null;

  // multi-select de rotas
  var msMenu=$('motMsMenu'), msField=$('motMsField'), msPh=$('motMsPh');
  function renderChips(){
    msField.querySelectorAll('.gk-ms-chip').forEach(function(c){ c.remove(); });
    var ch=msMenu.querySelectorAll('input[type=checkbox]:checked'); msPh.hidden=!!ch.length;
    ch.forEach(function(inp){
      var chip=document.createElement('span'); chip.className='gk-ms-chip';
      chip.innerHTML='<span>'+inp.getAttribute('data-nm')+'</span><button type="button" aria-label="Remover">'+ic('x')+'</button>';
      chip.querySelector('button').addEventListener('click',function(e){ e.stopPropagation(); inp.checked=false; renderChips(); });
      msField.appendChild(chip);
    });
    GK.icons();
  }
  msField.addEventListener('click',function(e){ e.stopPropagation(); msMenu.classList.toggle('is-open'); });
  msMenu.addEventListener('click',function(e){ e.stopPropagation(); });
  msMenu.addEventListener('change',renderChips);
  function filtrar(){ var q=$('motMsQ').value.toLowerCase().trim(), n=0; msMenu.querySelectorAll('label[data-t]').forEach(function(l){ var ok=!q||l.getAttribute('data-t').indexOf(q)>=0; l.hidden=!ok; if(ok) n++; }); $('motMsEmpty').hidden=n>0; }
  $('motMsQ').addEventListener('input',filtrar);
  msField.addEventListener('click',function(){ $('motMsQ').value=''; filtrar(); setTimeout(function(){ if(msMenu.classList.contains('is-open')) $('motMsQ').focus(); },0); });

  // telefone
  $('motTel').addEventListener('input',function(){ var v=this.value.replace(/\D/g,'').slice(0,11);
    this.value = v.length<=2?(v.length?'('+v:''):v.length<=6?'('+v.slice(0,2)+') '+v.slice(2):v.length<=10?'('+v.slice(0,2)+') '+v.slice(2,6)+'-'+v.slice(6):'('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7); });

  // foto
  var fotoInput=$('motFotoInput'), foto=$('motFoto');
  function setFoto(src,ini){
    foto.innerHTML = src?'<img src="'+src+'" alt="">':(ini?'<span class="gk-strong" style="font-size:16px">'+ini+'</span>':ic('user','gk-ic-lg'));
    foto.classList.toggle('has-photo',!!(src||ini)); $('motFotoRm').hidden=!src; $('motFotoAdd').innerHTML=src?'Trocar foto':ic('upload')+'Enviar foto'; GK.icons();
  }
  foto.addEventListener('click',function(){ fotoInput.click(); }); $('motFotoAdd').addEventListener('click',function(){ fotoInput.click(); });
  fotoInput.addEventListener('change',function(){ var f=fotoInput.files&&fotoInput.files[0]; if(!f) return; var r=new FileReader(); r.onload=function(){ setFoto(r.result); }; r.readAsDataURL(f); });
  $('motFotoRm').addEventListener('click',function(){ fotoInput.value=''; setFoto(null); });

  // senha
  var senha=$('motSenha'), rules=$('motRules');
  $('motEye').addEventListener('click',function(){ var show=senha.type==='password'; senha.type=show?'text':'password'; this.innerHTML=ic(show?'eye-off':'eye'); GK.icons(); });
  function setR(r,ok){ var li=rules.querySelector('[data-r="'+r+'"]'); if(li) li.classList.toggle('ok',ok); }
  senha.addEventListener('focus',function(){ rules.classList.add('is-open'); });
  senha.addEventListener('blur',function(){ if(!senha.value) rules.classList.remove('is-open'); });
  senha.addEventListener('input',function(){ var v=senha.value; setR('len',v.length>=8); setR('upper',/[A-Z]/.test(v)); setR('lower',/[a-z]/.test(v)); setR('num',/[0-9]/.test(v)); setR('spec',/[^A-Za-z0-9]/.test(v)); });

  // status
  var sw=$('motStatus'), stx=$('motStatusTxt');
  sw.addEventListener('change',function(){ stx.textContent=sw.checked?'Ativo':'Inativo'; stx.classList.toggle('off',!sw.checked); $('motSec2').classList.toggle('is-off',!sw.checked); });

  // etapas, validação e salvar
  var step=1;
  function validar(scope){
    var ok=true;
    document.querySelectorAll(scope+' [data-required]').forEach(function(inp){ var bad=!inp.value.trim(); var f=inp.closest('.gk-field'); f.classList.toggle('is-error',bad); f.querySelector('.gk-error').hidden=!bad; if(bad&&ok){ inp.focus(); ok=false; } });
    if(scope==='#motP2' && mode==='novo' && !senha.value){ var f=senha.closest('.gk-field'); f.classList.add('is-error'); f.querySelector('.gk-error').hidden=false; if(ok) senha.focus(); ok=false; }
    return ok;
  }
  function goto(n){
    if(n===2 && !validar('#motP1')) return;
    step=n; $('motP1').hidden=n!==1; $('motP2').hidden=n!==2;
    document.querySelectorAll('.gk-stepper-i').forEach(function(b){ var i=+b.getAttribute('data-go'); b.classList.toggle('is-active',i===n); b.classList.toggle('is-done',i<n); b.querySelector('.gk-step').innerHTML = i<n ? ic('check') : i; });
    $('motBack').textContent = n===1 ? 'Cancelar' : 'Voltar';
    $('motNext').innerHTML = n===1 ? 'Próximo'+ic('arrow-right') : (mode==='novo' ? 'Cadastrar motorista' : 'Salvar alterações');
    GK.icons();
  }
  document.querySelectorAll('.gk-stepper-i').forEach(function(b){ b.addEventListener('click',function(){ goto(+b.getAttribute('data-go')); }); });
  $('motBack').addEventListener('click',function(){ if(step===1) GK.close('ovMot'); else goto(1); });
  $('motNext').addEventListener('click',function(){
    if(step===1){ goto(2); return; }
    if(!validar('#motP2')) return;
    GK.close('ovMot');
    if(onSave){ var fi=foto.querySelector('img');
      onSave({ nome:$('motNome').value.trim(), user:$('motUser').value.trim(), tel:$('motTel').value, perfil:$('motPerfil').value,
        rotas:[].map.call(msMenu.querySelectorAll('input[type=checkbox]:checked'),function(c){return c.value;}),
        status:sw.checked?'ativo':'inativo', foto:fi?fi.getAttribute('src'):null }); }
  });
  document.querySelectorAll('#motForm [data-required]').forEach(function(inp){ inp.addEventListener('input',function(){ var f=inp.closest('.gk-field'); f.classList.remove('is-error'); f.querySelector('.gk-error').hidden=true; }); });
  senha.addEventListener('input',function(){ var f=senha.closest('.gk-field'); f.classList.remove('is-error'); f.querySelector('.gk-error').hidden=true; });

  function reset(){ document.querySelectorAll('#motForm .gk-field').forEach(function(f){ f.classList.remove('is-error'); f.querySelector('.gk-error') && (f.querySelector('.gk-error').hidden=true); }); rules.classList.remove('is-open'); rules.querySelectorAll('li').forEach(function(l){ l.classList.remove('ok'); }); msMenu.classList.remove('is-open'); }

  window.GKMot={
    novo:function(cb){
      onSave=cb||null; mode='novo'; reset();
      $('motTitle').textContent='Cadastrar motorista'; $('motLog').hidden=true;
      $('motNome').value=''; $('motTel').value=''; $('motUser').value=''; senha.value=''; senha.placeholder='Crie uma senha segura'; $('motPerfil').value='padrao';
      msMenu.querySelectorAll('input[type=checkbox]').forEach(function(c){ c.checked=false; }); renderChips(); setFoto(null);
      $('motSenhaReq').hidden=false; $('motSenhaHint').hidden=true;
      sw.checked=true; sw.disabled=true; stx.textContent='Ativo'; stx.classList.remove('off'); $('motSec2').classList.remove('is-off');
      $('motStatusDesc').textContent='O motorista será cadastrado como Ativo. Você poderá alterar o status na edição.';
      $('motFootLeft').innerHTML=''; goto(1);
      GK.open('ovMot'); $('motNome').focus();
    },
    editar:function(d,cb){
      onSave=cb||null; mode='editar'; reset(); d=d||{};
      $('motTitle').textContent='Editar motorista'; $('motLog').hidden=false;
      $('motNome').value=d.nome||''; $('motTel').value=d.tel||''; $('motUser').value=d.user||''; senha.value=''; senha.placeholder='••••••••'; $('motPerfil').value=d.perfil||'padrao';
      msMenu.querySelectorAll('input[type=checkbox]').forEach(function(c){ c.checked=(d.rotas||[]).indexOf(c.value)>=0; }); renderChips(); setFoto(d.foto||null,d.ini||'');
      $('motSenhaReq').hidden=true; $('motSenhaHint').hidden=false;
      sw.disabled=false; sw.checked=d.status!=='inativo'; stx.textContent=sw.checked?'Ativo':'Inativo'; stx.classList.toggle('off',!sw.checked); $('motSec2').classList.toggle('is-off',!sw.checked);
      $('motStatusDesc').textContent='Ao inativar, o motorista perde o acesso ao app.';
      $('motFootLeft').innerHTML=''; goto(1);
      GK.open('ovMot');
    },
    excluir:function(nome,cb){ onDel=cb||null; $('delText').textContent=(nome||'Este motorista')+' será removido do cadastro. Esta ação não pode ser desfeita.'; GK.open('ovDel'); }
  };
  $('delOk').addEventListener('click',function(){ GK.close('ovDel'); if(onDel) onDel(); });
  GK.popovers(); GK.icons();
})();
