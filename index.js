// download node
// commandline:  npm init
// commandline:  npm install express --save
// commandline:  node index.js

var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var p2pserver = require('socket.io-p2p-server').Server;

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "src/index.html");
})
/*
app.get('/app.js', function (req, res) {
    res.sendFile(__dirname + "/compiled/app.js");
})
*/
app.use(express.static('public'));
app.use(express.static('compiled'));


var users = [];


io.use(p2pserver)
io.on('connection', function(socket){
    console.log('-- user connected --', socket.id);

    socket.on("newUser", function(data) {
        console.log('user connected ( newUser )', data);
        users.push({id: socket.id, name: data.name, x:0, y:0, vx:0, vy:0 });
        io.sockets.emit("newConnection", {users: users});
    });

    socket.on("nameChange", function(data) {
        console.log('user name changed to : ' + data.name);
        playerById(socket.id).name = data.name;
        io.sockets.emit("nameChanged", {id: data.id, name: data.name});
    });


    socket.on("disconnect", function() {
        console.log('user disconnected');
        users.splice(users.indexOf(playerById(socket.id)), 1);
        io.sockets.emit("userDisconnected", socket.id);
    })

    socket.on('pos', function(x,y,vx,vy){
        var player = playerById(socket.id);
        player.x = x;
        player.y = y;
        player.vx = vx;
        player.vy = vy;
        //console.log(x,y,vx,vy);
    });

    /*
    io.emit('players', Object.keys(io.sockets.connected).length);

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
    socket.on('disconnect', function(){
    });*/
});

var playerById = function(id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return users[i];
        }
    }
    return false;
}
setInterval(function(){
    var updatePush = [];
    for (var i = 0; i < users.length; i++) {
        var p = users[i];
        updatePush.push({id:p.id,x:p.x,y:p.y, vx: p.vx, vy: p.vy});
    }
    io.sockets.emit('pos', {users: updatePush});
}, 100);

http.listen(3000, function(){
    console.log('listening on *:3000');
});