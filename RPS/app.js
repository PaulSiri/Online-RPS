const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const port = 3000;

connections = [];

server.listen(process.env.PORT || port);
console.log('Server running...');

app.use(express.static('public'))

app.get('/', (req, res) =>{
	res.sendFile(__dirname + '/public/index.html');
})

io.sockets.on('connection', (socket) =>{
	connections.push(socket);
	console.log("Connected: %s sockets connected", connections.length);

	socket.on('disconnect', (data) =>{
		connections.splice(connections.indexOf(socket), 1);
		console.log("disconnect: %s sockects connected", connections.length);
	})
})