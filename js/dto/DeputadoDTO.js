class DeputadoDTO {
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
