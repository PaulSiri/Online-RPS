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


var roomno = 1;

io.sockets.on('connection', (socket) =>{
	connections.push(socket);
	console.log("Connected: %s sockets connected", connections.length);

	//Increase roomno 2 clients are present in a room.
    if(io.sockets.adapter.rooms["room-" + roomno] && io.sockets.adapter.rooms["room-" + roomno].length > 1){
    	roomno++;
    }

    socket.join("room-"+roomno);
    socket.room = "room-"+roomno;
    if(io.sockets.adapter.rooms["room-" + roomno].length === 1){
    	socket.player = 1;
    }else{
    	socket.player = 2;
    }

    //Send this event to everyone in the room.
    io.sockets.in(socket.room).emit('connectToRoom', "Room: " + roomno);

    socket.on('chooseMove', (data) =>{
    	socket.move = data;

    	socket.emit('playMove', {
    		player: socket.player,
    		move: data
    	});

    	socket.to(socket.room).emit('opponentMoved', socket.move);

    	socket.on('compareMoves', (moves) =>{
    		console.log(moves.myMove);
    		console.log(moves.opponentMove);

    		if(moves.myMove == "rock"){
    			switch(moves.opponentMove){
    				case "rock":
    					socket.win = "tie";
    					break;
    				case "paper":
    					socket.win = "loss";
    					break;
    				case "scissors":
    					socket.win = "win";
    					break;
    			}
    		}else if(moves.myMove == "paper"){
    			switch(moves.opponentMove){
    				case "rock":
    					socket.win = "win";
    					break;
    				case "paper":
    					socket.win = "tie";
    					break;
    				case "scissors":
    					socket.win = "loss";
    					break;
    			}
    		}else if(moves.myMove == "scissors"){
    			switch(moves.opponentMove){
    				case "rock":
    					socket.win = "loss";
    					break;
    				case "paper":
    					socket.win = "win";
    					break;
    				case "scissors":
    					socket.win = "tie";
    					break;
    			}
    		}

    		if(socket.win == "tie"){
    			output = moves.myMove + " ties with " + moves.opponentMove + "!";
    		}else if(socket.win == "win"){
    			output = moves.myMove + " beats " + moves.opponentMove + "!";
    		}else if(socket.win == "loss"){
    			output = moves.opponentMove + " beats " + moves.myMove + "!";
    		}

    		io.sockets.in(socket.room).emit('outputResult', output);
    	})

    })

    socket.on('setPlayer', (data) =>{
    	socket.player = data;
    });

	socket.on('disconnect', (data) =>{
		connections.splice(connections.indexOf(socket), 1);

		socket.leave(socket.room);

		io.sockets.in(socket.room).emit('setPlayerOne');

		if(io.sockets.adapter.rooms[socket.room] && io.sockets.adapter.rooms[socket.room].length < 1){
			roomno--;
		}

		console.log("Disconnect: %s sockets connected", connections.length);

	})

})