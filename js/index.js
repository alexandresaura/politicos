const quantidadePagina = 22;
const quantidadeDeputados = 24;

var paginaAtual = 1;

$(document).ready(function() {
    imprimeDeputados(1);

    $("#deputadoForm").submit(function(e) {
        e.preventDefault();
    });

    $('#buscarDeputado').click(function() {
        imprimirDeputado($('#deputadoInput').val(), $('#partidoSelect').val());
    });

    $('#deputadoInput').keyup(function(e) {
        if(e.which == 13) {
            $('#buscarDeputado').click();
        }
    });
});

function carregarDeputados(page) {
    // Array para armazenar os objetos do tipo Deputado
    let deputados = Array();

    // URL da requisição
    let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?pagina=${page}&itens=${quantidadeDeputados}&idLegislatura=56&ordem=ASC&ordenarPor=nome`;
    
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

function imprimePaginas(page) {
    let totalValores = quantidadePagina * quantidadeDeputados;
    paginaAtual = page;

    pageInicial = page - 2;
    pageFinal = page + 2;

    if(pageInicial < 1) {
        pageFinal -= pageInicial - 1;
        pageInicial = 1;
    }

    if(pageFinal > quantidadePagina) {
        pageInicial -= (pageFinal - quantidadePagina);
        pageFinal = quantidadePagina;
    }

    $('.pagination').html("");
    $('.pagination').append(`
        <li class="page-item ${paginaAtual - 1 < 1 ? 'disabled' : ''}">
            <a class="page-link text-dark page-previous-tab" data-toggle="tab" href="#deputados" role="tab" aria-label="Previous" aria-selected="false" ${paginaAtual - 1 < 1 ? 'aria-disabled="true"' : ''}>
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `);

    $('.page-previous-tab').click(function() {
        imprimeDeputados(paginaAtual - 1);
    });

    for(let i = pageInicial; i <= pageFinal; i++){
        $('.pagination').append(`
            <li class="page-item ${i == page ? 'active' : ''}">
                <a class="page-link text-dark page${i}-tab" data-toggle="tab" href="#deputados" role="tab" aria-controls="page${i}" aria-selected="false">${i}</a>
            </li>
        `);

        $(`.page${i}-tab`).click(function() {
            imprimeDeputados(i);
        }); 
    }

    $('.pagination').append(`
        <li class="page-item ${paginaAtual + 1 > quantidadePagina ? 'disabled' : ''}">
            <a class="page-link text-dark page-next-tab" data-toggle="tab" href="#deputados" role="tab" aria-label="Next" aria-selected="false" ${paginaAtual + 1 > quantidadePagina ? 'aria-disabled="true"' : ''}>
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `);

    $('.page-next-tab').click(function() {
        imprimeDeputados(paginaAtual + 1);
    });    
}

function imprimeDeputados(page) {
    let deputados = carregarDeputados(page);

    imprimePaginas(page);

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

function buscarDeputado(nome, partido) {
    // Array para armazenar os objetos do tipo Deputado
    let deputados = Array();

    // URL da requisição
    let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${nome}&siglaPartido=${partido}&idLegislatura=56&ordem=ASC&ordenarPor=nome`;
    
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

function imprimirDeputado(nome, partido) {
    let deputados = buscarDeputado(nome, partido);

    $('#listaDeputados').html("");
    for(let indice in deputados){
        let deputado = deputados[indice];
        $('#listaDeputados').append(`
            <div class="card col-12 col-md-4 col-lg-2">
                <img src="${deputado.URLFoto}" class="card-img-top img-fluid px-2" alt="${deputado.nome}">
                <div class="card-body">
                    <h5 class="card-title"><a href="deputado.html?id=${deputado.id}" class="text-dark">${deputado.nome}</a></h5>
                </div>
                <div class="card-footer">
                    <small class="text-muted">Partido: <a href="partido.html?sigla=${deputado.partido}" class="text-dark">${deputado.partido}</a></small>
                </div>
            </div>
        `);
    }
}
