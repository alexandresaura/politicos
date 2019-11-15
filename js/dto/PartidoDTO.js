class PartidoDTO {
	constructor(id, sigla, nome, URI, URLLogo){
		// Informações gerais
		this._id = id;
		this._sigla = sigla;
		this._nome = nome;
		this._URI = URI;
		this._URLLogo = URLLogo;
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

	get URLLogo(){
		return this._URLLogo;
	}

	// Informações detalhadas sobre o partido
	obterDetalhes(){
		let dataJSON = $.parseJSON($.ajax({
			url: `${this.URI}`,
			dataType: "json",
			async: false
		}).responseText);

		return dataJSON.dados;
	}
}