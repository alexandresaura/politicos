$(document).ready(function() {
	new Dados().carregarDeputados(1);
});

class Dados {
	carregarDeputados(page){
		// Array para armazenar os objetos do tipo Deputado
		let deputados = Array();

		// URL da requisição
		let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?pagina=${page}&itens=24&ordem=ASC&ordenarPor=nome`;
		
		// Requisição dos dados dos deputados federais
		let dataJSON = $.parseJSON($.ajax({
			url: url,
			dataType: "json",
			async: false
		}).responseText);

		// Preenchimento do array de Deputado
		dataJSON.dados.forEach(function(dados){
			let deputado = new Deputado(dados.id, dados.nome, dados.siglaPartido, dados.email, dados.siglaUf, dados.uriPartido, dados.urlFoto, dados.uri);
			deputados.push(deputado);
		});

		$('#listaDeputados').html(`
			<div class="col-12 pt-5">
				<h3 class="display-4 text-left">Deputados Federais</h3>
			</div>
			<div class="col-12 d-flex justify-content-center">
				<nav aria-label="Page navigation example">
					<ul class="pagination">
				</nav>
			</div>
		`);
		let i = 1;
		for(let indice in deputados){
			let deputado = deputados[indice];
			$('#listaDeputados').append(`
				<div class="card mb-2 col-12 col-md-4 col-lg-2">
					<img src="${deputado.URLFoto}" class="card-img-top img-fluid px-2" alt="${deputado.nome}">
					<div class="card-body">
						<h5 class="card-title"><a href="deputado.html?id=${deputado.id}" class="text-dark">${deputado.nome}</a></h5>
					</div>
					<div class="card-footer">
						<small class="text-muted">Partido: <a href="partido.html?partido=${deputado.partido}" class="text-dark">${deputado.partido}</a></small>
					</div>
				</div>
			`);
		}

		for(let i = 1; i <= 22; i++){
			$('.pagination').append(`
				<li class="page-item">
					<a onclick="new Dados().carregarDeputados(${i})" class="page-link text-dark" id="page${i}-tab" data-toggle="tab" href="#page${i}" role="tab" aria-controls="page${i}" aria-selected="false">${i}</a>
				</li>
			`);
		}

		return deputados;
	}

	carregarEventos(){
		// Array para armazenar os objetos do tipo Evento
		let eventos = Array();

		// URL da requisição
		let url = 'https://dadosabertos.camara.leg.br/api/v2/eventos/';
		
		// Requisição dos dados dos eventos
		let dataJSON = $.parseJSON($.ajax({
			url: url,
			dataType: "json",
			async: false
		}).responseText);

		// Preenchimento do array de Evento
		dataJSON.dados.forEach(function(dados){
			let evento = new Evento(dados.id, dados.uri, dados.dataHoraInicio, dados.dataHoraFim, dados.situacao, dados.descricaoTipo, dados.descricao, dados.localExterno, dados.localCamara, dados.orgaos);
			eventos[dados.id] = evento;
		});

		return eventos;
	}

	carregarFrentes(){
		// Array para armazenar os objetos do tipo Frente
		let frentes = Array();

		// URL da requisição
		let url = 'https://dadosabertos.camara.leg.br/api/v2/frentes/';
		
		// Requisição dos dados dos frentes
		let dataJSON = $.parseJSON($.ajax({
			url: url,
			dataType: "json",
			async: false
		}).responseText);

		// Preenchimento do array de Frente
		dataJSON.dados.forEach(function(dados){
			let frente = new Frente(dados.id, dados.uri, dados.titulo);
			frentes[dados.id] = frente;
		});

		return frentes;
	}

	carregarPartidos(){
		// Array para armazenar os objetos do tipo Partido
		let partidos = Array();

		// URL da requisição
		let url = 'https://dadosabertos.camara.leg.br/api/v2/partidos/';
		
		// Requisição dos dados dos partidos federais
		let dataJSON = $.parseJSON($.ajax({
			url: url,
			dataType: "json",
			async: false
		}).responseText);

		// Preenchimento do array de Partido
		dataJSON.dados.forEach(function(dados){
			let partido = new Partido(dados.id, dados.sigla, dados.nome, dados.uri);
			partidos[dados.sigla] = partido;
		});

		return partidos;
	}

	carregarDeputado(id){
		// URL da requisição
		let url = `https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`;
		
		// Requisição dos dados dos deputados federais
		let dataJSON = $.parseJSON($.ajax({
			url: url,
			dataType: "json",
			async: false
		}).responseText);

		// Preenchimento do array de Deputado
		let deputado = new Deputado(dataJSON.dados.id, dataJSON.dados.ultimoStatus.nome, dataJSON.dados.ultimoStatus.siglaPartido, dataJSON.dados.ultimoStatus.email, dataJSON.dados.ultimoStatus.siglaUf, dataJSON.dados.ultimoStatus.uriPartido, dataJSON.dados.ultimoStatus.urlFoto, dataJSON.dados.ultimoStatus.uri);

		// Preenchimento das informações do deputado
		let detalhes = deputado.obterDetalhes();
		let despesas = deputado.obterDespesas();
		let discursos = deputado.obterDiscursos();
		let eventos = deputado.obterEventos();
		let frentes = deputado.obterFrentes();
		//let mesas = deputado.obterMesa();
		let orgaos = deputado.obterOrgaos();

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
						<h3 class="h1">${deputado.nome} <small class="text-muted"><a href="partido.html?partido=${deputado.partido}">${deputado.partido}</a></small></h3>
						<hr>
						<ul style="list-style-type: none; padding: 0;">
							<li>
								<p><strong class="h6">Nome civil:</strong> ${detalhes.nomeCivil}</p>
							</li>
							<li>
								<p><strong class="h6">E-mail:</strong> ${detalhes.ultimoStatus.email}</p>
							</li>
							<li>
								<p><strong class="h6">Telefone:</strong> ${detalhes.ultimoStatus.gabinete.telefone}</p>
							</li>
							<li>
								<p><strong class="h6">Endereço:</strong> Gabinete ${detalhes.ultimoStatus.gabinete.andar} - Anexo ${detalhes.ultimoStatus.gabinete.predio} - Sala ${detalhes.ultimoStatus.gabinete.sala}</p>
							</li>
							<li>
								<p><strong class="h6">Data de nascimento:</strong> ${dia}/${mes}/${ano}</p>
							</li>
							<li>
								<p><strong class="h6">Naturalidade:</strong> ${detalhes.municipioNascimento} - ${detalhes.ufNascimento}</p>
							</li>
						</ul>
						<hr>
						<button type="button" class="btn btn-warning justify-content-end">Seguir deputad${detalhes.sexo == 'M'? 'o' : 'a'}</button>
					</div>
				</div>
			</div>
		`;

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

		let despesasMap = new Map();
		despesas.forEach(element => {
			if(despesasMap.has(element.tipoDespesa)) {
				despesasMap.set(element.tipoDespesa, despesasMap.get(element.tipoDespesa) + element.valorLiquido);
			} else {
				despesasMap.set(element.tipoDespesa, element.valorLiquido);
			}
		});

		let despesasArray = new Array();
		despesasMap.forEach((value, key) => {
			despesasArray.push(key);
		});

		despesasArray.sort();

		despesasArray.forEach(element => {
			despesasConteudo += `
				<li>
					<p><strong class="h6">${element}:</strong> ${despesasMap.get(element).toFixed(2)}</p>
				</li>
			`;
		});
		
		despesasConteudo += `
			</ul>
		`;

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

		let eventosMap = new Map();
		eventos.forEach(element => {
			if(eventosMap.has(element.descricaoTipo)) {
				eventosMap.get(element.descricaoTipo).push(element.descricao);
				eventosMap.get(element.descricaoTipo).sort();
			} else {
				let evento = new Array();
				eventosMap.set(element.descricaoTipo, evento);
				eventosMap.get(element.descricaoTipo).push(element.descricao);
			}
		});

		let eventosArray = new Array();
		eventosMap.forEach((value, key) => {
			eventosArray.push(key);
		});

		eventosArray.sort();

		eventosArray.forEach(element => {
			eventosMap.get(element).forEach(e => {
				eventosConteudo += `
					<li>
						<p><strong class="h6">${element}:</strong> ${e}</p>
					</li>
				`;
			});
		});

		eventosConteudo += `
			</ul>
		`;

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

		/*
		let mesasCard = `
			<!-- Mesas -->
			<div class="card">
				<div class="card-header" id="headingSix">
					<h2 class="mb-0">
						<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
							<h5 style="text-transform: uppercase;" class="text-secondary">Mesas</h5>
						</button>
					</h2>
				</div>
				<div id="collapseSix" class="collapse" aria-labelledby="headingSix" data-parent="#accordionExample">
					<div class="card-body">
					</div>
				</div>
			</div>
		`;
		let mesasConteudo = `Aqui irão as mesas`;
		*/

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

		let orgaosMap = new Map();
		orgaos.forEach(element => {
			if(orgaosMap.has(element.nomeOrgao)) {
				orgaosMap.get(element.nomeOrgao).push(element.titulo);
				orgaosMap.get(element.nomeOrgao).sort();
			} else {
				let evento = new Array();
				orgaosMap.set(element.nomeOrgao, evento);
				orgaosMap.get(element.nomeOrgao).push(element.titulo);
			}
		});

		let orgaosArray = new Array();
		orgaosMap.forEach((value, key) => {
			orgaosArray.push(key);
		});

		orgaosArray.sort();

		orgaosArray.forEach(element => {
			orgaosMap.get(element).forEach(e => {
				orgaosConteudo += `
					<li>
						<p><strong class="h6">${element}:</strong> ${e}</p>
					</li>
				`;
			});
		});

		orgaosConteudo += `
			</ul>
		`;

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

		$('#deputado').append(apresentacao);
		$('#deputado').append(`
			<div class="accordion" id="accordionExample" style="width: 100%">
			</div>
		`);
		$('#accordionExample').append(detalhesCard);
		$('#accordionExample').append(despesasCard);
		$('#accordionExample').append(discursosCard);
		$('#accordionExample').append(eventosCard);
		$('#accordionExample').append(frentesCard);
		//$('#accordionExample').append(mesasCard);
		$('#accordionExample').append(orgaosCard);
		$('#accordionExample').append(noticiasCard);

		$('#collapseOne div').html(detalhesConteudo);
		$('#collapseTwo div').html(despesasConteudo);
		$('#collapseThree div').html(discursosConteudo);
		$('#collapseFour div').html(eventosConteudo);
		$('#collapseFive div').html(frentesConteudo);
		//$('#collapseSix div').html(mesasConteudo);
		$('#collapseSeven div').html(orgaosConteudo);
		$('#collapseEight div').html(noticiasConteudo);
	}
}

class Deputado {
	constructor(id, nome, partido, email, UF, URLPartido, URLFoto, URI){
		// Informações gerais
		this._id = id; // Número identificador do deputado
		this._nome = nome; // Nome do deputado
		this._partido = partido; // Sigla do partido
		this._email = email; // E-mail institucional
		this._UF = UF; // Unidade Federativa (Estado) de origem
		this._URLPartido = URLPartido; // URL do partido
		this._URLFoto = URLFoto; // URL da foto do deputado
		this._URI = URI; // URL de identificação do deputado
	}

	// Getters
	get id() {
		return this._id;
	}

	get nome() {
		return this._nome;
	}

	get partido() {
		return this._partido;
	}

	get email() {
		return this._email;
	}

	get UF() {
		return this._UF;
	}

	get URLPartido() {
		return this._URLPartido;
	}

	get URLFoto() {
		return this._URLFoto;
	}

	get URI() {
		return this._URI;
	}

	// Informações detalhadas sobre o deputado específico
	obterDetalhes() {
		let dataJSON = $.parseJSON($.ajax({
			url: this.URI,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre despesas com exercício parlamentar do deputado
	obterDespesas(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/despesas`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre discursos feitos pelo deputado em eventos diversos
	obterDiscursos(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/discursos`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre uma lista de eventos com a participação do parlamentar
	obterEventos(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/eventos`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre as frentes parlamentares das quais o deputado é integrante
	obterFrentes(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/frentes`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre os órgãos dos quais o deputado é integrante
	obterOrgaos(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/orgaos`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre quais deputados fizeram parte da Mesa Diretora em uma legislatura
	obterMesa(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/mesa`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}
}

class Evento {
	constructor(id, URI, dataHoraInicio, dataHoraFim, situacao, descricaoTipo, descricao, localExterno, localCamara, orgaos){
		// Informações gerais
		this._id = id;
		this._URI = URI;
		this._dataHoraInicio = dataHoraFim;
		this._dataHoraFim = dataHoraFim;
		this._situacao = situacao;
		this._descricaoTipo = descricaoTipo;
		this._descricao = descricao;
		this._localExterno = localExterno;
		this._localCamara = localCamara;
		this._orgaos = orgaos;
	}

	// Getters
	get id(){
		return this._id;
	}

	get URI(){
		return this._URI;
	}

	get dataHoraInicio(){
		return this._dataHoraInicio;
	}

	get dataHoraFim(){
		return this._dataHoraFim;
	}

	get situacao(){
		return this._situacao;
	}

	get descricaoTipo(){
		return this._descricaoTipo;
	}

	get descricao(){
		return this._descricao;
	}

	get localExterno(){
		return this._localExterno;
	}

	get localCamara(){
		return this._localCamara;
	}

	get orgaos(){
		return this._orgaos;
	}

	// Informações detalhadas sobre o evento específico
	obterDetalhes(){
		let dataJSON = $.parseJSON($.ajax({
			url: this.URI,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre os deputados participantes do evento específico
	obterDeputados(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/deputados`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre os órgãos organizadores do evento 
	obterOrgaos(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/orgaos`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre as proposições que foram ou deverão ser avaliadas do evento de caráter deliberativo
	obterPauta(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/pauta`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}
}

class Frente {
	constructor(id, URI, titulo){
		// Informações gerais
		this._id = id;
		this._URI = URI;
		this._titulo = titulo;
	}

	// Getters
	get id(){
		return this._id;
	}

	get URI(){
		return this._URI;
	}

	get titulo(){
		return this._titulo;
	}

	// Informações detalhadas sobre a frente parlamentar
	obterDetalhes(){
		let dataJSON = $.parseJSON($.ajax({
			url: this.URI,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre os deputados que participaram da frente parlamentar
	obterMembros(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/membros`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}
}

class Partido {
	constructor(id, sigla, nome, URI){
		// Informações gerais
		this._id = id;
		this._sigla = sigla;
		this._nome = nome;
		this._URI = URI;
	}

	// Getters
	get id(){
		return this._id;
	}

	get sigla(){
		return this._sigla;
	}

	get nome(){
		return this._nome;
	}

	get URI(){
		return this._URI;
	}

	// Informações detalhadas sobre o partido
	obterDetalhes(){
	let dataJSON = $.parseJSON($.ajax({
			url: this.URI,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}

	// Informações sobre os membros do partido
	obterMembro(){
	let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}/membros`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}
}
