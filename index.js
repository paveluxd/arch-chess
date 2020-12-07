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

// SERVER SIDE SOCKET
// Specifies the server you want to work with, in this case our express server
// Socket param will be passed by client side, there will be a var per connection
var io = socket(server)
io.on('connection', function(socket){
    //Connect
    console.log('Connected', socket.id)

    players.push(socket.id)
    io.sockets.emit('playerJoined', players)
        
    //Emit board
    socket.on('emitBoard', function(data){
        io.sockets.emit('emitBoard', data)
        console.log('Board sent')
    })

    //Disconnect
    socket.on('disconnect', function() {
        const index = players.indexOf(socket.id);
        if (index > -1) {
            players.splice(index, 1);
        }

        io.sockets.emit('playerLeft', players)
        console.log('Got disconnect!', socket.id); 
    })
}) 


