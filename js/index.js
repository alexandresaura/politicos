const quantidadePagina = 23;
const quantidadeDeputados = 24;

var paginaAtual = 1;

$(document).ready(function() {
    imprimirDeputados(1);

    $("#deputadoForm").submit(function(e) {
        e.preventDefault();
    });

    $('#buscarDeputado').click(function() {
        imprimirDeputado($('#deputadoInput').val(), $('#partidoSelect').val(), $('#sexoSelect').val());
    });

    $('#deputadoInput').keyup(function(e) {
        if(e.which == 13) {
            $('#buscarDeputado').click();
        }
    });

    imprimirPartidos();
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

function imprimirPaginas(page) {
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
        imprimirDeputados(paginaAtual - 1);
    });

    for(let i = pageInicial; i <= pageFinal; i++){
        $('.pagination').append(`
            <li class="page-item ${i == page ? 'active' : ''}">
                <a class="page-link text-dark page${i}-tab" data-toggle="tab" href="#deputados" role="tab" aria-controls="page${i}" aria-selected="false">${i}</a>
            </li>
        `);

        $(`.page${i}-tab`).click(function() {
            imprimirDeputados(i);
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
        imprimirDeputados(paginaAtual + 1);
    });    
}

function imprimirDeputados(page) {
    let deputados = carregarDeputados(page);

    imprimirPaginas(page);

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

function buscarDeputado(nome, partido, sexo) {
    // Array para armazenar os objetos do tipo Deputado
    let deputados = Array();

    // URL da requisição
    let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${nome}&siglaPartido=${partido}&siglaSexo=${sexo}&idLegislatura=56&ordem=ASC&ordenarPor=nome`;
    
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

function imprimirDeputado(nome, partido, sexo) {
    let deputados = buscarDeputado(nome, partido, sexo);

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

function imprimirPartidos(){
    let partidos = Array();
    $.each($('#partidoSelect option'), (indice, valor) => {
        partidos.push($(valor).val());
    });
    partidos.shift();

    for(let i = 0; i < Math.ceil(partidos.length / 5); i++){
        $('.carousel-inner').append(`
            <div class="carousel-item">
                <div class="d-flex justify-content-around"></div>
            </div>
        `);
    }
    $('.carousel-inner .carousel-item:first').addClass('active');
    let children = $('.carousel-inner').children();
    
    let total = partidos.length;
    children.each(function(){
        let conteudoTag = '';
        let laco = 5 < total ? 5 : partidos.length % 5;
        for(let i = 0; i < laco; i++){
            conteudoTag += `
                <a href="" class="text-white text-center w-100 mx-1"></a>
            `;
            total--;
        }
        $(this).find('div').append(conteudoTag);
    });

    let cont = 0;
    let tag = $('.carousel-item:first');
    let tagA = tag.find('a:first');
    partidos.forEach(function(value){
        if(cont == 5){
            cont = 0;
            tag = tag.next();
            tagA = tag.find('a:first');
        }
        tagA.text(value);
        tagA.attr('href', `partido.html?sigla=${value}`);
        tagA = tagA.next();
        cont++;
    });
}
