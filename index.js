var express = require('express')
var socket = require('socket.io')

//App setup
var app = express()

//Listen to port number
var server = app.listen(4000, function(){
    console.log('XDXD PORT 4000')
})

//Static files
app.use(express.static('public'))


// Socket server
// Specifies the server you want to work with, in this case our express server
// Socket param will be passed by client side, there will be a var per connection
var io = socket(server)
io.on('connection', function(socket){
    console.log('Connected', socket.id)

    //Listend for the event from client side sockets
    socket.on('emitBoard', function(data){
        io.sockets.emit('emitBoard', data)
    })
}) 
