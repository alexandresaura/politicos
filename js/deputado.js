$(document).ready(function() {
	let searchParams = new URLSearchParams(window.location.search);
	searchParams.has('id');
	let id = searchParams.get('id');
	new Dados().carregarDeputado(id);
});