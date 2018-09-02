var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app); //cria servidor http utilizando express como intermediador
var fs = require('fs');

server.listen(process.env.PORT || 80); //inicia servidor http na porta 80
console.log('Server http  rodando...');

/* WebServer */
app.use(express.static(path.join(__dirname, 'public'))); //deixa public a pasta public - isso é para que o user possa acessar os arquivos estáticos
//Rota para o caminho : 127.0.0.1:80/
app.get('/', function(req, res) { //quando houver requisição nesse caminho
	res.sendFile(path.join(__dirname, 'index_compiled.html')); //envia essa página como resposta
});
