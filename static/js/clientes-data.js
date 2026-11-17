/* Dados de exemplo dos clientes (protótipo) — GAO é de Goiânia. */
(function(){
  window.GAO_CLI=[
    {nome:'Hospital Amparo',doc:'12.345.678/0001-90',rota:'Rota Hospitalar',wpp:'(62) 99456-7801',status:'ativo',cep:'74115-030',logradouro:'Avenida T-4',numero:'1200',bairro:'Setor Bueno',cidade:'Goiânia',uf:'GO'},
    {nome:'HEMU',doc:'23.456.789/0001-01',rota:'Rota Oeste',wpp:'(62) 99456-7802',status:'ativo',cep:'74125-010',logradouro:'Rua 9',numero:'800',bairro:'Setor Oeste',cidade:'Goiânia',uf:'GO'},
    {nome:'Santa Casa',doc:'34.567.890/0001-12',rota:'Rota Centro',wpp:'(62) 99456-7803',status:'ativo',cep:'74013-010',logradouro:'Avenida Goiás',numero:'112',bairro:'Setor Central',cidade:'Goiânia',uf:'GO'},
    {nome:'Clínica São Lucas',doc:'45.678.901/0001-23',rota:'Rota Sul',wpp:'(62) 99456-7804',status:'ativo',cep:'74823-010',logradouro:'Avenida T-63',numero:'2400',bairro:'Setor Bueno',cidade:'Goiânia',uf:'GO'},
    {nome:'Laboratório Central',doc:'56.789.012/0001-34',rota:'Rota Norte',wpp:'(62) 99456-7805',status:'ativo',cep:'74535-010',logradouro:'Rua 3',numero:'300',bairro:'Setor Central',cidade:'Goiânia',uf:'GO'},
    {nome:'Hospital Dia',doc:'67.890.123/0001-45',rota:'Rota Leste',wpp:'(62) 99456-7806',status:'ativo',cep:'74605-010',logradouro:'Avenida Anhanguera',numero:'950',bairro:'Setor Leste Universitário',cidade:'Goiânia',uf:'GO'},
    {nome:'Clínica Vida Plena',doc:'78.901.234/0001-56',rota:'',wpp:'',status:'pendente'},
    {nome:'Hospital Santa Marta',doc:'89.012.345/0001-67',rota:'',wpp:'',status:'pendente'},
    {nome:'Clínica Bem Estar',doc:'90.123.456/0001-78',rota:'Rota Centro',wpp:'(62) 99456-7809',status:'inativo',cep:'74210-010',logradouro:'Rua 7',numero:'700',bairro:'Setor Marista',cidade:'Goiânia',uf:'GO'},
    {nome:'Hotel Le Jardin',doc:'27.182.818/0001-28',rota:'Rota Sul',wpp:'(64) 99456-7811',status:'ativo',cep:'75690-000',logradouro:'Avenida Orcalino Santos',numero:'350',bairro:'Centro',cidade:'Caldas Novas',uf:'GO',ini:'08:00',fim:'12:00'},
    {nome:'Albert Einstein',doc:'31.415.926/0001-53',rota:'Rota Hospitalar',wpp:'(62) 99456-7810',status:'ativo',cep:'74175-120',logradouro:'Avenida T-10',numero:'1500',bairro:'Setor Bueno',cidade:'Goiânia',uf:'GO',ini:'07:00',fim:'11:00'},
  ];
  var CAT={'Hospital Amparo':'Hospital','HEMU':'Hospital','Santa Casa':'Hospital','Clínica São Lucas':'Clínica médica','Laboratório Central':'Laboratório de análises','Hospital Dia':'Hospital','Clínica Vida Plena':'Clínica médica','Hospital Santa Marta':'Hospital','Clínica Bem Estar':'Clínica médica','Albert Einstein':'Hospital','Hotel Le Jardin':'Hotel'};
  GAO_CLI.forEach(function(c){ c.cat=CAT[c.nome]||''; c.origem=(c.nome==='Hospital Dia'||c.nome==='Clínica Bem Estar')?'manual':'crm'; c.tel='(62) 3000-0000'; if(c.cep) c.pin={x:.5,y:.62}; });
  GAO_CLI.forEach(function(c){ if(c.nome==='Albert Einstein') c.foto='static/img/albert-einstein.jpg'; if(c.nome==='Hotel Le Jardin') c.foto='static/img/le-jardin.jpg'; });
})();
