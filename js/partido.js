$(document).ready(function() {
	let searchParams = new URLSearchParams(window.location.search);
	let sigla = searchParams.get('sigla');
	let partido = carregarPartido(sigla);
	$('title').html(`Partido: ${partido.sigla}`);

	imprimePartido(partido);
});

function carregarPartido(sigla){
	// Array para armazenar os objetos do tipo Partido
	let partidos = Array();

	// URL da requisição
	let url = `https://dadosabertos.camara.leg.br/api/v2/partidos?sigla=${sigla}`;
	
	// Requisição dos dados do partido federal
	let dataJSON = $.parseJSON($.ajax({
		url: url,
		dataType: "json",
		async: false
	}).responseText);

	url = dataJSON.dados[0].uri;

	// Requisição dos dados detalhados do partido federal
	dataJSON = $.parseJSON($.ajax({
		url: url,
		dataType: "json",
		async: false
	}).responseText);

	// Instância da classe Partido
	let partido = new PartidoDTO(dataJSON.dados.id, dataJSON.dados.sigla, dataJSON.dados.nome, dataJSON.dados.uri, dataJSON.dados.urlLogo);

	return partido;
}

function carregarDeputados(partido) {
	let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=56&siglaPartido=${partido.sigla}&ordem=ASC&ordenarPor=nome`;

	// Array para armazenar os objetos do tipo Deputado
    let deputados = Array();
    
    // Requisição dos dados dos deputados federais
    let dataJSON = $.parseJSON(
        $.ajax({
            url: url,
            dataType: "json",
            async: false
        }).responseText
    );

    // Preenchimento do array de Deputado
    dataJSON.dados.forEach(function(dados){
        let deputado = new DeputadoDTO(dados.id, dados.nome, dados.siglaPartido, dados.email, dados.siglaUf, dados.uriPartido, dados.urlFoto, dados.uri);
        deputados.push(deputado);
	});
	
	return deputados;
}

function imprimePartido(partido){
	imprimeApresentacao(partido);

	$('#partido').append(`
		<div class="accordion" id="accordionExample" style="width: 100%">
		</div>
	`);

	imprimeMembros(partido);
}

function imprimeApresentacao(partido){
	let detalhes = partido.obterDetalhes();

	let apresentacao = `
		<div class="container mb-3" style="margin-top: 7%;">
			<div class="row">
				<div class="col-12 col-md-4 d-sm-flex justify-content-center">
					<img src="${partido.URLLogo}" class="img-fluid" alt="${partido.sigla}" style="height:100%; width:80%;">
				</div>
				<div class="col-12 col-md-8">
					<h3 class="h1">${partido.sigla}</h3>
					<hr>
					<ul style="list-style-type: none; padding: 0;">
						<li>
							<p><strong class="h6">Nome:</strong> ${detalhes.nome}</p>
						</li>
						<li>
							<p><strong class="h6">Líder:</strong> <a href="deputado.html?id=${detalhes.status.lider.uri.replace('https://dadosabertos.camara.leg.br/api/v2/deputados/', '')}" class="text-secondary">${detalhes.status.lider.nome}</a></p>
						</li>
						<li>
							<p><strong class="h6">Situação:</strong> ${detalhes.status.situacao}</p>
						</li>
						<li>
							<p><strong class="h6">Total de membros:</strong> ${detalhes.status.totalMembros}</p>
						</li>
						<li>
							<p><strong class="h6">Total de posses:</strong> ${detalhes.status.totalPosse}</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	`;

	$('#partido').append(apresentacao);
}

function imprimeMembros(partido){
	let deputados = carregarDeputados(partido);

	let membrosCard = `
		<!-- Membros -->
		<div class="card" style="width: 100%">
			<div class="card-header" id="headingOne">
				<h2 class="mb-0">
				<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
					<h5 style="text-transform: uppercase;" class="text-secondary">Membros</h5>
				</button>
				</h2>
			</div>
			<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
				<div class="card-body">
				</div>
			</div>
		</div>
	`;

	let membrosConteudo = `
		<div class="row px-3" id="listaDeputados"></div>
	`;

	$('#accordionExample').append(membrosCard);
	$('#collapseOne div').html(membrosConteudo);

	$('#listaDeputados').html("");
    for(let indice in deputados){
        let deputado = deputados[indice];
        $('#listaDeputados').append(`
            <div class="card col-12 col-md-4 col-lg-2">
                <img src="${deputado.URLFoto}" class="card-img-top img-fluid px-2" alt="${deputado.nome}">
                <div class="card-body">
                    <p class="h5 card-title"><a href="deputado.html?id=${deputado.id}" class="text-dark">${deputado.nome}</a></p>
                </div>
                <div class="card-footer">
                    <small class="text-muted">Partido: <a href="partido.html?sigla=${deputado.partido}" class="text-dark">${deputado.partido}</a></small>
                </div>
            </div>
        `);
    }
}
