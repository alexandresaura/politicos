
// ***********ESSE ARQUIVO VAI SUMIR ATÉ O FIM DO PROJETO*********************

class Dados {
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
}
