$(document).ready(function() {
	let searchParams = new URLSearchParams(window.location.search);
	let id = searchParams.get('id');
	let deputado = carregarDeputado(id);
	$('title').html(`Deputado: ${deputado.nome}`);
	imprimeDeputado(deputado);
});

function carregarDeputado(id){
	// URL da requisição
	let url = `https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`;
	
	// Requisição dos dados dos deputados federais
	let dataJSON = $.parseJSON($.ajax({
		url: url,
		dataType: "json",
		async: false
	}).responseText);

	// Preenchimento do array de Deputado
	return new DeputadoDTO(dataJSON.dados.id, dataJSON.dados.ultimoStatus.nome, dataJSON.dados.ultimoStatus.siglaPartido, dataJSON.dados.ultimoStatus.email, dataJSON.dados.ultimoStatus.siglaUf, dataJSON.dados.ultimoStatus.uriPartido, dataJSON.dados.ultimoStatus.urlFoto, dataJSON.dados.ultimoStatus.uri);	
}

function imprimeDeputado(deputado){
	imprimeApresentacao(deputado);

	$('#deputado').append(`
		<div class="accordion" id="accordionExample" style="width: 100%">
		</div>
	`);

	imprimeDetalhes(deputado);
	imprimeDespesas(deputado);
	imprimeDiscursos(deputado);
	imprimeEventos(deputado);
	imprimeFrentes(deputado);
	imprimeOrgaos(deputado);
	imprimeNoticias(deputado);
}

function imprimeApresentacao(deputado){
	let detalhes = deputado.obterDetalhes();
	let ano = detalhes.dataNascimento.slice(0, 4); 
	let mes = detalhes.dataNascimento.slice(5, 7); 
	let dia = detalhes.dataNascimento.slice(8, 11);

	let apresentacao = `
		<div class="container mb-3" style="margin-top: 7%;">
			<div class="row">
				<div class="col-12 col-md-4 d-sm-flex justify-content-center">
					<img src="${deputado.URLFoto}" class="img-fluid" alt="${deputado.nome}" style="height:100%; width:80%;">
				</div>
				<div class="col-12 col-md-8">
					<h3 class="h1">${deputado.nome} <small class="text-muted"><a href="partido.html?sigla=${deputado.partido}">${deputado.partido}</a></small></h3>
					<hr>
					<ul style="list-style-type: none; padding: 0;">`;
						if(detalhes.nomeCivil) {
							apresentacao += `
								<li>
									<p><strong class="h6">Nome civil:</strong> ${detalhes.nomeCivil}</p>
								</li>
							`;
						}
						if(detalhes.ultimoStatus.email) {
							apresentacao += `
								<li>
									<p><strong class="h6">E-mail:</strong> ${detalhes.ultimoStatus.email}</p>
								</li>
							`;
						}
						if(detalhes.ultimoStatus.gabinete.telefone) {
							apresentacao += `
								<li>
									<p><strong class="h6">Telefone:</strong> ${detalhes.ultimoStatus.gabinete.telefone}</p>
								</li>
							`;
						}
						if(detalhes.ultimoStatus.gabinete.andar || detalhes.ultimoStatus.gabinete.predio || detalhes.ultimoStatus.gabinete.sala) {
							apresentacao += `
								<li>
									<p><strong class="h6">Endereço:</strong>
									${detalhes.ultimoStatus.gabinete.predio ? `Anexo ${detalhes.ultimoStatus.gabinete.predio}` : ''}
									${detalhes.ultimoStatus.gabinete.predio && (detalhes.ultimoStatus.gabinete.andar || detalhes.ultimoStatus.gabinete.sala) ? ' - ' : ''}
									${detalhes.ultimoStatus.gabinete.andar ? `Andar ${detalhes.ultimoStatus.gabinete.andar}` : ''}
									${detalhes.ultimoStatus.gabinete.andar && detalhes.ultimoStatus.gabinete.sala ? ' - ' : ''}
									${detalhes.ultimoStatus.gabinete.sala ? `Gabinete ${detalhes.ultimoStatus.gabinete.sala}` : ''}</p>
								</li>
							`;
						}
						if(dia && mes && ano) {
							apresentacao += `
								<li>
									<p><strong class="h6">Data de nascimento:</strong> ${dia}/${mes}/${ano}</p>
								</li>
							`;
						}
						if(detalhes.municipioNascimento || detalhes.ufNascimento) {
							apresentacao += `
								<li>
									<p><strong class="h6">Naturalidade:</strong> ${detalhes.municipioNascimento} - ${detalhes.ufNascimento}</p>
								</li>
							`;
						}
	apresentacao += `</ul>
					<hr>
					<button type="button" class="btn btn-warning justify-content-end">Seguir deputad${detalhes.sexo == 'M'? 'o' : 'a'}</button>
				</div>
			</div>
		</div>
	`;

	$('#deputado').append(apresentacao);
}

function imprimeDetalhes(deputado){
	let detalhes = deputado.obterDetalhes();

	let detalhesCard = `
		<!-- Detalhes -->
		<div class="card" style="width: 100%">
			<div class="card-header" id="headingOne">
				<h2 class="mb-0">
				<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
					<h5 style="text-transform: uppercase;" class="text-secondary">Detalhes</h5>
				</button>
				</h2>
			</div>
			<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;

	let detalhesConteudo = `
		<ul style="list-style-type: none; padding: 0;">
			<li>
				<p><strong class="h6">Nome eleitoral:</strong> ${detalhes.ultimoStatus.nomeEleitoral}</p>
			</li>
			<li>
				<p><strong class="h6">CPF:</strong> ${detalhes.cpf}</p>
			</li>
			<li>
				<p><strong class="h6">Escolaridade:</strong> ${detalhes.escolaridade}</p>
			</li>
			<li>
				<p><strong class="h6">Sexo:</strong> ${detalhes.sexo == 'M'? 'Masculino' : 'Feminino'}</p>
			</li>
			<li>
				<p><strong class="h6">Condição eleitoral:</strong> ${detalhes.ultimoStatus.condicaoEleitoral}</p>
			</li>
			<li>
				<p><strong class="h6">Situação atual:</strong> ${detalhes.ultimoStatus.situacao}</p>
			</li>
		</ul>
	`;

	$('#accordionExample').append(detalhesCard);
	$('#collapseOne div').html(detalhesConteudo);
}

function imprimeDespesas(deputado) {
	let despesas = deputado.obterDespesas();
	
	let despesasMap = new Map();
	despesas.forEach(depesa => {
		if(despesasMap.has(depesa.tipoDespesa)) {
			despesasMap.set(depesa.tipoDespesa, despesasMap.get(depesa.tipoDespesa) + depesa.valorLiquido);
		} else {
			despesasMap.set(depesa.tipoDespesa, depesa.valorLiquido);
		}
	});

	let despesasArray = new Array();
	despesasMap.forEach((value, key) => {
		despesasArray.push(key);
	});
	despesasArray.sort();

	let despesasCard = `
		<!-- Despesas -->
		<div class="card">
			<div class="card-header" id="headingTwo">
				<h2 class="mb-0">
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
						<h5 style="text-transform: uppercase;" class="text-secondary">Despesas</h5>
					</button>
				</h2>
			</div>
			<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;
	
	let despesasConteudo = `
		<ul style="list-style-type: none; padding: 0;">
	`;

	despesasArray.forEach(depesa => {
		despesasConteudo += `
			<li>
				<p><strong class="h6">${depesa}:</strong> ${despesasMap.get(depesa).toFixed(2)}</p>
			</li>
		`;
	});
	
	despesasConteudo += `
		</ul>
	`;	

	$('#accordionExample').append(despesasCard);
	$('#collapseTwo div').html(despesasConteudo);
}

function imprimeDiscursos(deputado) {
	let discursos = deputado.obterDiscursos();

	let discursosCard = `
		<!-- Discursos -->
		<div class="card">
			<div class="card-header" id="headingThree">
				<h2 class="mb-0">
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
						<h5 style="text-transform: uppercase;" class="text-secondary">Discursos</h5>
					</button>
				</h2>
			</div>
			<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;

	let discursosConteudo = `Aqui irão os discursos`;

	$('#accordionExample').append(discursosCard);
	$('#collapseThree div').html(discursosConteudo);
}

function imprimeEventos(deputado) {
	let eventos = deputado.obterEventos();

	let eventosMap = new Map();
	eventos.forEach(evento => {
		if(eventosMap.has(evento.descricaoTipo)) {
			eventosMap.get(evento.descricaoTipo).push(evento.descricao);
			eventosMap.get(evento.descricaoTipo).sort();
		} else {
			let eventosArray = new Array();
			eventosMap.set(evento.descricaoTipo, eventosArray);
			eventosMap.get(evento.descricaoTipo).push(evento.descricao);
		}
	});

	let eventosArray = new Array();
	eventosMap.forEach((value, key) => {
		eventosArray.push(key);
	});
	eventosArray.sort();

	let eventosCard = `
		<!-- Eventos -->
		<div class="card">
			<div class="card-header" id="headingFour">
				<h2 class="mb-0">
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
						<h5 style="text-transform: uppercase;" class="text-secondary">Eventos</h5>
					</button>
				</h2>
			</div>
			<div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;

	let eventosConteudo = `
		<ul style="list-style-type: none; padding: 0;">
	`;

	eventosArray.forEach(descricaoTipo => {
		eventosMap.get(descricaoTipo).forEach(descricao => {
			eventosConteudo += `
				<li>
					<p><strong class="h6">${descricaoTipo}:</strong> ${descricao}</p>
				</li>
			`;
		});
	});

	eventosConteudo += `
		</ul>
	`;	

	$('#accordionExample').append(eventosCard);
	$('#collapseFour div').html(eventosConteudo);
}

function imprimeFrentes(deputado) {
	let frentes = deputado.obterFrentes();
	
	let frentesCard = `
		<!-- Frentes -->
		<div class="card">
			<div class="card-header" id="headingFive">
				<h2 class="mb-0">
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
						<h5 style="text-transform: uppercase;" class="text-secondary">Frentes</h5>
					</button>
				</h2>
			</div>
			<div id="collapseFive" class="collapse" aria-labelledby="headingFive" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;

	let frentesConteudo = `Aqui irão as frentes`;

	$('#accordionExample').append(frentesCard);
	$('#collapseFive div').html(frentesConteudo);
}

function imprimeOrgaos(deputado) {
	let orgaos = deputado.obterOrgaos();

	let orgaosMap = new Map();
	orgaos.forEach(element => {
		orgaosMap.set(element.nomeOrgao, element.titulo);
	});

	let orgaosArray = new Array();
	orgaosMap.forEach((value, key) => {
		orgaosArray.push(key);
	});
	orgaosArray.sort();
	
	let orgaosCard = `
		<!-- Órgãos -->
		<div class="card">
			<div class="card-header" id="headingSeven">
				<h2 class="mb-0">
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
						<h5 style="text-transform: uppercase;" class="text-secondary">Órgãos</h5>
					</button>
				</h2>
			</div>
			<div id="collapseSeven" class="collapse" aria-labelledby="headingSeven" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;

	let orgaosConteudo = `
		<ul style="list-style-type: none; padding: 0;">
	`;

	orgaosArray.forEach(orgao => {
		orgaosConteudo += `
			<li>
				<p><strong class="h6">${orgao}:</strong> ${orgaosMap.get(orgao)}</p>
			</li>
		`;
	});

	orgaosConteudo += `
		</ul>
	`;	

	$('#accordionExample').append(orgaosCard);
	$('#collapseSeven div').html(orgaosConteudo);
}

function imprimeNoticias(deputado) {
	let noticiasCard = `
		<!-- Notícias -->
		<div class="card">
			<div class="card-header" id="headingEight">
				<h2 class="mb-0">
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
						<h5 style="text-transform: uppercase;" class="text-secondary">Notícias</h5>
					</button>
				</h2>
			</div>
			<div id="collapseEight" class="collapse" aria-labelledby="headingEight" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;

	let noticiasConteudo = `Aqui irão as notícias`;

	$('#accordionExample').append(noticiasCard);
	$('#collapseEight div').html(noticiasConteudo);
}
