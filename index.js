var express = require('express')
var socket = require('socket.io')

//App setup
var app = express()

//Listen to port number
// process.env.PORT -> herokus var for port
var server = app.listen(process.env.PORT || 4000, function(){
    console.log('PORT 4000')
})

//Static files
app.use(express.static('public'))

var players = []
var boardState = 
'blank blank blank kingW blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank blank king blank blank blank '

// SERVER SIDE SOCKET
// Specifies the server you want to work with, in this case our express server
// Socket param will be passed by client side, there will be a var per connection
var io = socket(server)
io.on('connection', function(socket){
    //Connect
    console.log('Connected', socket.id)

    // Record player that joined
    players.push(socket.id)
    io.sockets.emit('playerJoined', players)

    // Set board state
    io.sockets.emit('emitBoard', boardState)
        
    //Disconnect
    socket.on('disconnect', function() {
        const index = players.indexOf(socket.id);
        if (index > -1) {
            players.splice(index, 1);
        }

        io.sockets.emit('playerLeft', players)
        console.log('Got disconnect!', socket.id); 
    })

    //Emit board
    socket.on('emitBoard', function(data){
        io.sockets.emit('emitBoard', data)
        boardState = data
        console.log('Board sent')
    })
}) 


