/// <reference path="player.ts" />

class Game extends Phaser.Game  {

    constructor() {
        super(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', State);
    }
}

class State extends Phaser.State {

    io: SocketIOClient.Socket;

    textValue: Phaser.Text;
    updateCount: number;

    myPlayer: Player;
    players: Player[] = [];

    // -------------------------------------------------------------------------
    preload() {
        this.game.load.image('player', 'img/player.png');
        //map = this.game.add.tilemap('map');
        // background image
        //this.game.load.image("BG", "bg.jpg");
        // load sprite images in atlas
        //this.game.load.atlas("Atlas", "atlas.png", "atlas.json");
    }

    create() {

        var style = {
            font: "65px Arial",
            fill: "#ff00ff",
            align: "center",
            stroke: "#FFaa00",
            strokeThickness: 2
        };
        this.textValue = this.game.add.text(0, 0, "Loading...", style);
        this.updateCount = 0;

        this.io = io();
        this.io.on('connect', () => {
            console.log("User Connection????");
            var sessionId = this.io.id;
            var name = "User"+(Math.random()*100);// window.prompt("Choose your name:", "User"+Math.random());

            this.io.emit('newUser', {id: sessionId, name: name});
            console.log("User Connection");

        });

        this.io.on('newConnection', (data) => {
            //console.log("User Connected", data);

            this.textValue.text = data.users.length;
            for (var i = 0; i < data.users.length; i++) {
                var remoteUser = data.users[i];
                var user = this.playerById(remoteUser.id);
                if (user !== null) continue;
                console.log("New User Connected", remoteUser);

                var player = new Player(this.game, remoteUser.id, remoteUser.name);
                player.setup(remoteUser.x, remoteUser.y);
                this.players.push(player);

                if (this.myPlayer === undefined && player.id.substring(2) === this.io.id) {
                    console.log('It\'s me !');
                    this.myPlayer = player;
                }

            }
        });

        this.io.on('userDisconnected', (id) => {
            console.log("User Disconnected", id);
            var user : Player = this.playerById(id);
            user.destroy();
            this.players.splice(this.players.indexOf(user), 1);
        });

        var sendLoop;
        var x1= 0,x2= 0,y1= 0,y2 = 0,vx = 0,vy = 0;

        this.io.on('pos', (data) => {;
            //console.log("User ", this.io.id, data);
            for (var i = 0; i < data.users.length; i++) {
                var remoteUser = data.users[i];
                var user = this.playerById(remoteUser.id);
                if (user === null) continue;

                user.setPos(remoteUser.x, remoteUser.y,remoteUser.vx, remoteUser.vy);
            }

            if (sendLoop === undefined) {
                setInterval(() => {
                    var x = this.game.input.x;
                    var y = this.game.input.y;
                    if (x == x2 && y == y2) return;

                    x2 = x1;
                    y2 = y1;
                    x1 = x;
                    y1 = y;
                    var dist = this.game.math.distance(x1, y1, x2, y2);
                    if (dist===0) {
                        vx = vy = 0;
                    }else{
                        vx = vx * 0.5 + ((x2 - x1)/dist)*0.5;
                        vy = vy * 0.5 + ((y2 - y1)/dist)*0.5;
                        //console.log(vx,vy);
                    }

                }, 30);

                sendLoop = setInterval(() => {

                    var x = this.game.input.x;
                    var y = this.game.input.y;

                    var dist = this.game.math.distance(x1, y1, x2, y2);
                    var str = dist;

                    this.io.emit('pos', x, y, vx*str, vy*str);
                }, 100);
            }
        });

    }

    update() {

        for (var i = 0; this.players.length > i; i++){
            this.players[i].update();
        }
        //this.textValue.text = (this.updateCount++).toString();
        //this.logo.position.setTo(this.game.input.x, this.game.input.y);


    }

    render(){

        for (var i = 0; this.players.length > i; i++){
            this.players[i].render();
        }
    }

    playerById (id) : Player{
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }
        return null;
    }
}

interface SomePoint { x: number; y: number; }