const quantidadePagina = 22;
const quantidadeDeputados = 24;

$(document).ready(function() {
    imprimePaginas();
    imprimeDeputados(1);
});

function carregarDeputados(page) {
    // Array para armazenar os objetos do tipo Deputado
    let deputados = Array();

    // URL da requisição
    let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?pagina=${page}&itens=${quantidadeDeputados}&ordem=ASC&ordenarPor=nome`;
    
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

function imprimePaginas() {
    for(let i = 1; i <= quantidadePagina; i++){
        $('.pagination').append(`
            <li class="page-item">
                <a onclick="imprimeDeputados(${i})" class="page-link text-dark" id="page${i}-tab" data-toggle="tab" href="#page${i}" role="tab" aria-controls="page${i}" aria-selected="false">${i}</a>
            </li>
        `);
    }
}

function imprimeDeputados(page) {
    let deputados = new carregarDeputados(page);

    $('#listaDeputados').html("");
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
}