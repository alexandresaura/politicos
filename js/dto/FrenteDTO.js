class FrenteDTO {
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