/* GAO Gestor — cliente-form.js
   Modal em 4 etapas (Dados · Endereço · Logística · Revisão) de cadastrar/completar/editar cliente.
   Com CRM: nome, documento e telefone só para leitura. Endereço, WhatsApp para contato e rota são completados pelo gestor.
   O cliente vira Ativo quando tudo está preenchido; senão fica Pendente.
   Uso: GKCli.novo(cb) · GKCli.editar(dados, cb) */
(function(){
  var CATS=["Hospital", "Clínica médica", "Clínica de hemodiálise", "Clínica de imagem", "Clínica de estética", "Clínica odontológica", "Clínica veterinária", "Laboratório de análises", "Banco de sangue", "Maternidade", "Pronto-socorro / UPA", "Centro cirúrgico ambulatorial", "Home care", "Casa de repouso / ILPI", "Operadora de saúde", "Hotel", "Pousada", "Resort", "Hostel", "Motel", "Spa", "Restaurante", "Buffet e eventos", "Catering aéreo", "Salão de beleza", "Academia", "Clube", "Condomínio", "Escola", "Universidade", "Indústria alimentícia", "Indústria farmacêutica", "Funerária", "Presídio / unidade prisional", "Órgão público", "Forças armadas", "Embarcação / cruzeiro", "Revenda de lavanderia", "Outro"];
  var ROTAS=['Rota Hospitalar','Rota Centro','Rota Norte','Rota Sul','Rota Leste','Rota Oeste'];
  var CEPS={'74013010':['Avenida Goiás','Setor Central'],'74115030':['Avenida T-4','Setor Bueno'],'74125010':['Rua 9','Setor Oeste'],'74210010':['Rua 7','Setor Marista']};
  function ic(n,cls){ return '<i data-lucide="'+n+'" class="gk-ic '+(cls||'')+'"></i>'; }
  function campo(id,label,req,inner,err){ return '<div class="gk-field"><label class="gk-label" for="'+id+'">'+label+(req?'<span class="gk-req">*</span>':'')+'</label>'+inner+(err?'<span class="gk-error" hidden>'+err+'</span>':'')+'</div>'; }
  function inp(id,ph,extra){ return '<input class="gk-input" id="'+id+'" placeholder="'+(ph||'')+'" '+(extra||'')+'>'; }
  var STEPS=['Dados','Endereço','Logística','Revisão'];

  var html =
  '<div class="gk-overlay" id="ovCli"><div class="gk-scrim" data-close="ovCli"></div>'
  +'<div class="gk-modal is-form" role="dialog" aria-labelledby="clTitle">'
  +'<div class="gk-modal-head"><div class="gk-modal-title"><span class="gk-title-ic">'+ic('building-2')+'</span><h2 class="gk-h2" id="clTitle">Cadastrar cliente</h2></div><button class="gk-btn gk-btn-secondary gk-btn-icon gk-btn-sm" data-close="ovCli" aria-label="Fechar">'+ic('x')+'</button></div>'
  +'<div class="gk-stepper">'+STEPS.map(function(t,i){ return (i?'<span class="gk-stepper-sep"></span>':'')+'<button type="button" class="gk-stepper-i'+(i?'':' is-active')+'" data-go="'+(i+1)+'"><span class="gk-step">'+(i+1)+'</span>'+t+'</button>'; }).join('')+'</div>'
  +'<div class="gk-modal-body"><form class="gk-form" id="clForm" onsubmit="return false">'
  // 1 dados
  +'<div class="gk-pane" id="clP1">'
  +'<div class="gk-caption" id="clCrm" hidden style="display:flex;align-items:center;gap:var(--space-2)">'+ic('lock')+'Dados importados do CRM GAO. Somente leitura.</div>'
  +'<div class="gk-photo"><div class="gk-photo-slot" id="clFoto">'+ic('building-2','gk-ic-lg')+'</div>'
  +'<div class="gk-photo-actions"><div class="gk-photo-h">Foto do cliente</div><div class="gk-btns"><button class="gk-btn gk-btn-secondary gk-btn-sm" type="button" id="clFotoAdd">'+ic('upload')+'Enviar foto</button><button class="gk-btn gk-btn-ghost gk-btn-sm" type="button" id="clFotoRm" hidden>Remover</button></div><span class="gk-caption" id="clFotoCap">JPG ou PNG, até 5 MB.</span></div><input type="file" id="clFotoInput" accept="image/*" hidden></div>'
  +campo('clNome','Nome do cliente',true,inp('clNome','Ex.: Hospital Amparo','data-required'),'Informe o nome do cliente.')
  +campo('clCatF','Categoria',true,GK.ssHTML('clCatSS','Selecione a categoria','Buscar categoria',CATS)+'<input type="hidden" id="clCat" data-required>','Selecione a categoria do cliente.')
  +'<div class="gk-field-row">'
  +campo('clDoc','Documento (CNPJ)',true,inp('clDoc','00.000.000/0000-00','data-required inputmode="numeric"'),'Informe o documento.')
  +campo('clTel','Telefone',true,inp('clTel','(62) 3000-0000','data-required type="tel" inputmode="tel"'),'Informe o telefone.')
  +'</div></div>'
  // 2 endereço
  +'<div class="gk-pane" id="clP2" hidden>'
  +'<div class="gk-field-row">'
  +campo('clCep','CEP',true,inp('clCep','74000-000','data-end inputmode="numeric"'),'Informe o CEP.')
  +campo('clNum','Número',true,inp('clNum','Ex.: 1200','data-end'),'Informe o número.')
  +'</div>'
  +campo('clRua','Logradouro',true,inp('clRua','Ex.: Avenida Goiás','data-end'),'Informe o logradouro.')
  +'<div class="gk-field-row">'
  +campo('clBairro','Bairro',true,inp('clBairro','Ex.: Setor Central','data-end'),'Informe o bairro.')
  +campo('clCompl','Complemento',false,inp('clCompl','Ex.: Bloco B'))
  +'</div>'
  +'<div class="gk-field-row">'
  +campo('clCidade','Cidade',true,inp('clCidade','Goiânia','data-end'),'Informe a cidade.')
  +campo('clUf','UF',true,inp('clUf','GO','data-end maxlength="2"'),'Informe a UF.')
  +'</div>'
  +'</div>'
  // 3 logística
  +'<div class="gk-pane" id="clP3" hidden>'
  +'<div class="gk-field-row">'
  +campo('clWpp','WhatsApp para contato',false,inp('clWpp','(62) 99999-0000','type="tel" inputmode="tel"')+'<span class="gk-caption">Quem recebe os avisos de enxoval limpo e entregas.</span>')
  +campo('clRota','Rota',false,'<select class="gk-select" id="clRota"><option value="">Selecione</option>'+ROTAS.map(function(r){ return '<option>'+r+'</option>'; }).join('')+'</select><span class="gk-caption">Cada cliente pertence a uma única rota.</span>')
  +'</div>'
  +'<div class="gk-field-row">'
  +campo('clIni','Janela de atendimento · início',false,inp('clIni','','type="time"'))
  +campo('clFim','Janela de atendimento · fim',false,inp('clFim','','type="time"'))
  +'</div></div>'
  // 4 revisão
  +'<div class="gk-pane" id="clP4" hidden>'
  +'<div class="gk-dl">'
  +'<div class="gk-dl-row"><div class="gk-dl-l">Cliente</div><div class="gk-dl-v" id="rvNome"></div></div>'
  +'<div class="gk-dl-row"><div class="gk-dl-l">Categoria</div><div class="gk-dl-v" id="rvCat"></div></div>'
  +'<div class="gk-dl-row"><div class="gk-dl-l">Documento</div><div class="gk-dl-v" id="rvDoc"></div></div>'
  +'<div class="gk-dl-row"><div class="gk-dl-l">Endereço</div><div class="gk-dl-v" id="rvEnd"></div></div>'
  +'<div class="gk-dl-row"><div class="gk-dl-l">WhatsApp</div><div class="gk-dl-v" id="rvWpp"></div></div>'
  +'<div class="gk-dl-row"><div class="gk-dl-l">Rota</div><div class="gk-dl-v" id="rvRota"></div></div>'
  +'<div class="gk-dl-row"><div class="gk-dl-l">Janela de atendimento</div><div class="gk-dl-v" id="rvJan"></div></div>'
  +'<div class="gk-dl-row"><div class="gk-dl-l">Status</div><div class="gk-dl-v"><div class="gk-inline" style="justify-content:space-between;flex-wrap:nowrap;gap:var(--space-4)"><span class="gk-caption" id="clStatusDesc" style="display:block;font-weight:400"></span><span class="gk-inline" style="flex:none"><span id="clBadge"></span><span id="clSwWrap" hidden class="gk-inline"><input type="checkbox" class="gk-switch" id="clSw" checked><span class="gk-on" id="clSwTxt">Ativo</span></span></span></div></div></div>'
  +'</div>'
  +'<div class="gk-logrow" id="clLog" hidden style="margin-top:var(--space-4)"><span>'+ic('clock')+'Cliente criado em 22/10/2026</span><span>'+ic('clock')+'Última edição em 10/11/2026</span></div>'
  +'</div>'
  +'</form></div>'
  +'<div class="gk-modal-foot"><button class="gk-btn gk-btn-ghost" id="clBack">Cancelar</button><button class="gk-btn gk-btn-primary" id="clNext">Próximo</button></div>'
  +'</div></div>'
  +'<div class="gk-overlay" id="ovDelCli"><div class="gk-scrim" data-close="ovDelCli"></div><div class="gk-modal" role="dialog"><div class="gk-modal-body"><div class="gk-modal-icon is-bad">'+ic('trash-2')+'</div><h2 class="gk-h2">Excluir cliente?</h2><p id="clDelText"></p></div>'
  +'<div class="gk-modal-foot"><button class="gk-btn gk-btn-ghost" data-close="ovDelCli">Cancelar</button><button class="gk-btn gk-btn-danger" id="clDelOk">'+ic('trash-2')+'Excluir</button></div></div></div>';
  var wrap=document.createElement('div'); wrap.innerHTML=html; document.body.appendChild(wrap);
  var $=function(id){ return document.getElementById(id); };
  var mode='novo', onSave=null, step=1, origem='manual', original='pendente', initial='', N=STEPS.length;

  function mask(id,fn){ $(id).addEventListener('input',function(){ this.value=fn(this.value); }); }
  function fone(s){ var v=s.replace(/\D/g,'').slice(0,11); return v.length<=2?(v.length?'('+v:''):v.length<=6?'('+v.slice(0,2)+') '+v.slice(2):v.length<=10?'('+v.slice(0,2)+') '+v.slice(2,6)+'-'+v.slice(6):'('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7); }
  function cnpj(s){ var v=s.replace(/\D/g,'').slice(0,14), o=''; for(var i=0;i<v.length;i++){ o+=v[i]; if(i===1||i===4)o+='.'; if(i===7)o+='/'; if(i===11)o+='-'; } return o; }
  function cep(s){ var v=s.replace(/\D/g,'').slice(0,8); return v.length>5?v.slice(0,5)+'-'+v.slice(5):v; }
  mask('clTel',fone); mask('clWpp',fone); mask('clDoc',cnpj); mask('clCep',cep);
  $('clUf').addEventListener('input',function(){ this.value=this.value.toUpperCase().replace(/[^A-Z]/g,''); });

  // CEP preenche o endereço (protótipo: base de exemplo de Goiânia)
  $('clCep').addEventListener('input',function(){
    var v=this.value.replace(/\D/g,''); if(v.length!==8) return;
    var r=CEPS[v]||['Avenida Anhanguera','Setor Central'];
    $('clRua').value=r[0]; $('clBairro').value=r[1]; $('clCidade').value='Goiânia'; $('clUf').value='GO'; $('clNum').focus();
  });

  function endCompleto(){ return ['clCep','clRua','clNum','clBairro','clCidade','clUf'].every(function(id){ return $(''+id+'').value.trim(); }) && $('clCep').value.replace(/\D/g,'').length===8; }

  function dados(){
    var d={ nome:$('clNome').value.trim(), doc:$('clDoc').value, tel:$('clTel').value, cep:$('clCep').value, logradouro:$('clRua').value.trim(), numero:$('clNum').value.trim(), complemento:$('clCompl').value.trim(), bairro:$('clBairro').value.trim(), cidade:$('clCidade').value.trim(), uf:$('clUf').value.trim(),
      cat:$('clCat').value, wpp:$('clWpp').value, rota:$('clRota').value, ini:$('clIni').value, fim:$('clFim').value, origem:origem, foto:(function(){ var i=$('clFoto').querySelector('img'); return i?i.getAttribute('src'):null; })() };
    var falta=[]; if(!(d.nome&&d.doc&&d.tel&&d.cat)) falta.push('dados do cliente'); if(!endCompleto()) falta.push('endereço'); if(!d.wpp) falta.push('WhatsApp para contato'); if(!d.rota) falta.push('rota');
    d.falta=falta;
    d.status = ($('clSwWrap').hidden===false && !$('clSw').checked) ? 'inativo' : (falta.length ? 'pendente' : 'ativo');
    return d;
  }
  function snap(){ var d=dados(); return JSON.stringify([d.nome,d.cat,d.doc,d.tel,d.cep,d.logradouro,d.numero,d.complemento,d.bairro,d.cidade,d.uf,d.wpp,d.rota,d.ini,d.fim,d.status,d.foto]); }
  function dirty(){ if(mode==='editar' && step===N) $('clNext').disabled=(snap()===initial); }

  var BADGE={ativo:'<span class="gk-badge gk-badge-ok gk-badge-plain">Ativo</span>',pendente:'<span class="gk-badge gk-badge-warn gk-badge-plain">Pendente</span>',inativo:'<span class="gk-badge gk-badge-plain">Inativo</span>'};
  function dash(v){ return v||'<span class="gk-caption">—</span>'; }
  function revisao(){
    var d=dados();
    $('rvNome').textContent=d.nome||'—'; $('rvDoc').innerHTML=dash(d.doc); $('rvCat').innerHTML=dash(d.cat);
    $('rvEnd').innerHTML=dash(endCompleto()?(d.logradouro+', '+d.numero+(d.complemento?' · '+d.complemento:'')+', '+d.bairro+' · '+d.cidade+'/'+d.uf+' · <span style="white-space:nowrap">CEP '+d.cep+'</span>'):'');
    $('rvWpp').innerHTML=dash(d.wpp); $('rvRota').innerHTML=dash(d.rota);
    $('rvJan').innerHTML=(d.ini&&d.fim)?(d.ini+' às '+d.fim):'<span class="gk-caption">—</span>';
    var sw=original!=='pendente' && mode==='editar';
    $('clSwWrap').hidden=!sw; $('clBadge').innerHTML=sw?'':BADGE[d.status];
    $('clStatusDesc').textContent = d.status==='pendente' ? ('Fica Pendente até completar: '+d.falta.join(', ')+'.') : (sw ? 'Ao inativar, o cliente deixa de receber comandas. O histórico é mantido.' : 'Tudo preenchido: o cliente será ativado e passa a receber comandas.');
    $('clSwTxt').textContent=$('clSw').checked?'Ativo':'Inativo'; $('clSwTxt').classList.toggle('off',!$('clSw').checked);
  }
  $('clSw').addEventListener('change',function(){ revisao(); dirty(); });

  function validar(n){
    var ok=true, sel = n===1 ? (origem==='crm'?'':'#clP1 [data-required]') : '';
    if(!sel) return true;
    document.querySelectorAll(sel).forEach(function(i){ var bad=!i.value.trim(); var f=i.closest('.gk-field'); f.classList.toggle('is-error',bad); f.querySelector('.gk-error').hidden=!bad; if(bad&&ok){ i.focus(); ok=false; } });
    return ok;
  }
  function goto(n){
    if(n>step && !validar(step)) return;
    step=n; for(var i=1;i<=N;i++) $('clP'+i).hidden=i!==n;
    document.querySelectorAll('#ovCli .gk-stepper-i').forEach(function(b){ var i=+b.getAttribute('data-go'); b.classList.toggle('is-active',i===n); b.classList.toggle('is-done',i<n); b.querySelector('.gk-step').innerHTML = i<n ? ic('check') : i; });
    $('clBack').textContent = n===1 ? 'Cancelar' : 'Voltar';
    $('clNext').disabled=false;
    if(n===N) revisao();
    $('clNext').innerHTML = n<N ? 'Próximo'+ic('arrow-right') : (mode==='novo' ? 'Cadastrar cliente' : 'Salvar alterações');
    dirty(); GK.icons();
  }
  document.querySelectorAll('#ovCli .gk-stepper-i').forEach(function(b){ b.addEventListener('click',function(){ goto(+b.getAttribute('data-go')); }); });
  $('clBack').addEventListener('click',function(){ if(step===1) GK.close('ovCli'); else goto(step-1); });
  $('clNext').addEventListener('click',function(){ if(step<N){ goto(step+1); return; } var d=dados(); GK.close('ovCli'); if(onSave) onSave(d); });
  document.querySelectorAll('#clForm .gk-input,#clForm .gk-select').forEach(function(el){ el.addEventListener('input',function(){ var f=el.closest('.gk-field'); f.classList.remove('is-error'); var e=f.querySelector('.gk-error'); if(e) e.hidden=true; dirty(); }); el.addEventListener('change',dirty); });

  var ssCat=GK.searchSelect($('clCatSS'),function(v){ $('clCat').value=v; var f=$('clCat').closest('.gk-field'); f.classList.remove('is-error'); var e=f.querySelector('.gk-error'); if(e) e.hidden=true; dirty(); });
  var fotoInput=$('clFotoInput'), fotoEl=$('clFoto');
  function setFoto(src){
    fotoEl.innerHTML=src?'<img src="'+src+'" alt="">':ic('building-2','gk-ic-lg'); fotoEl.classList.toggle('has-photo',!!src);
    $('clFotoRm').hidden=!src||origem==='crm'; $('clFotoAdd').innerHTML=src?'Trocar foto':ic('upload')+'Enviar foto'; $('clFotoAdd').hidden=(origem==='crm'); $('clFotoCap').hidden=(origem==='crm'); GK.icons(); dirty();
  }
  fotoEl.addEventListener('click',function(){ if(origem!=='crm') fotoInput.click(); }); $('clFotoAdd').addEventListener('click',function(){ fotoInput.click(); });
  fotoInput.addEventListener('change',function(){ var f=fotoInput.files&&fotoInput.files[0]; if(!f) return; var r=new FileReader(); r.onload=function(){ setFoto(r.result); }; r.readAsDataURL(f); });
  $('clFotoRm').addEventListener('click',function(){ fotoInput.value=''; setFoto(null); });
  function preencher(d){
    d=d||{}; origem=d.origem||'manual'; document.querySelectorAll('#clForm .gk-field').forEach(function(f){ f.classList.remove('is-error'); var e=f.querySelector('.gk-error'); if(e) e.hidden=true; });
    var m={clNome:'nome',clDoc:'doc',clTel:'tel',clCep:'cep',clRua:'logradouro',clNum:'numero',clCompl:'complemento',clBairro:'bairro',clWpp:'wpp',clRota:'rota',clIni:'ini',clFim:'fim'};
    for(var id in m) $(id).value=d[m[id]]||'';
    $('clCidade').value=d.cidade||'Goiânia'; $('clUf').value=d.uf||'GO';
    ['clNome','clDoc','clTel'].forEach(function(id){ $(id).disabled=(origem==='crm'); }); $('clCrm').hidden=origem!=='crm';
    document.querySelectorAll('#clP1 .gk-req').forEach(function(r){ r.hidden=(origem==='crm'); });
    $('clSw').checked=d.status!=='inativo'; original=d.status||'pendente'; setFoto(d.foto||null); $('clCat').value=d.cat||''; ssCat.set(d.cat||''); ssCat.disable(origem==='crm');
  }
  var onDel=null;
  $('clDelOk').addEventListener('click',function(){ GK.close('ovDelCli'); if(onDel) onDel(); });
  window.GKCli={
    excluir:function(nome,cb){ onDel=cb||null; $('clDelText').textContent=(nome||'Este cliente')+' será removido do cadastro e deixa de receber comandas. Para manter o histórico de entregas, inative o cliente em vez de excluir.'; GK.open('ovDelCli'); },
    novo:function(cb){ onSave=cb||null; mode='novo'; $('clTitle').textContent='Cadastrar cliente'; $('clLog').hidden=true; preencher({origem:'manual',status:'pendente'}); step=1; goto(1); GK.open('ovCli'); $('clNome').focus(); },
    editar:function(d,cb){ onSave=cb||null; mode='editar'; $('clTitle').textContent=(d.status==='pendente'?'Completar cadastro':'Editar cliente'); $('clLog').hidden=false; preencher(d); initial=snap(); var alvo=1; if(d.status==='pendente'){ var fl=dados().falta; alvo=fl.indexOf('dados do cliente')>=0?1:(fl.indexOf('endereço')>=0?2:3); } step=alvo; goto(alvo); GK.open('ovCli'); }
  };
  GK.popovers(); GK.icons();
})();
