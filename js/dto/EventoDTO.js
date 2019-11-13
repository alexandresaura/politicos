class EventoDTO {
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