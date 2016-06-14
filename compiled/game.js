/// <reference path="player.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this, window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', State);
    }
    return Game;
}(Phaser.Game));
var State = (function (_super) {
    __extends(State, _super);
    function State() {
        _super.apply(this, arguments);
        this.players = [];
    }
    // -------------------------------------------------------------------------
    State.prototype.preload = function () {
        this.game.load.image('player', 'img/player.png');
        //map = this.game.add.tilemap('map');
        // background image
        //this.game.load.image("BG", "bg.jpg");
        // load sprite images in atlas
        //this.game.load.atlas("Atlas", "atlas.png", "atlas.json");
    };
    State.prototype.create = function () {
        var _this = this;
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
        this.io.on('connect', function () {
            console.log("User Connection????");
            var sessionId = _this.io.id;
            var name = "User" + (Math.random() * 100); // window.prompt("Choose your name:", "User"+Math.random());
            _this.io.emit('newUser', { id: sessionId, name: name });
            console.log("User Connection");
        });
        this.io.on('newConnection', function (data) {
            //console.log("User Connected", data);
            _this.textValue.text = data.users.length;
            for (var i = 0; i < data.users.length; i++) {
                var remoteUser = data.users[i];
                var user = _this.playerById(remoteUser.id);
                if (user !== null)
                    continue;
                console.log("New User Connected", remoteUser);
                var player = new Player(_this.game, remoteUser.id, remoteUser.name);
                player.setup(remoteUser.x, remoteUser.y);
                _this.players.push(player);
                if (_this.myPlayer === undefined && player.id.substring(2) === _this.io.id) {
                    console.log('It\'s me !');
                    _this.myPlayer = player;
                }
            }
        });
        this.io.on('userDisconnected', function (id) {
            console.log("User Disconnected", id);
            var user = _this.playerById(id);
            user.destroy();
            _this.players.splice(_this.players.indexOf(user), 1);
        });
        var sendLoop;
        var x1 = 0, x2 = 0, y1 = 0, y2 = 0, vx = 0, vy = 0;
        this.io.on('pos', function (data) {
            ;
            //console.log("User ", this.io.id, data);
            for (var i = 0; i < data.users.length; i++) {
                var remoteUser = data.users[i];
                var user = _this.playerById(remoteUser.id);
                if (user === null)
                    continue;
                user.setPos(remoteUser.x, remoteUser.y, remoteUser.vx, remoteUser.vy);
            }
            if (sendLoop === undefined) {
                setInterval(function () {
                    var x = _this.game.input.x;
                    var y = _this.game.input.y;
                    if (x == x2 && y == y2)
                        return;
                    x2 = x1;
                    y2 = y1;
                    x1 = x;
                    y1 = y;
                    var dist = _this.game.math.distance(x1, y1, x2, y2);
                    if (dist === 0) {
                        vx = vy = 0;
                    }
                    else {
                        vx = vx * 0.5 + ((x2 - x1) / dist) * 0.5;
                        vy = vy * 0.5 + ((y2 - y1) / dist) * 0.5;
                    }
                }, 30);
                sendLoop = setInterval(function () {
                    var x = _this.game.input.x;
                    var y = _this.game.input.y;
                    var dist = _this.game.math.distance(x1, y1, x2, y2);
                    var str = dist;
                    _this.io.emit('pos', x, y, vx * str, vy * str);
                }, 100);
            }
        });
    };
    State.prototype.update = function () {
        for (var i = 0; this.players.length > i; i++) {
            this.players[i].update();
        }
        //this.textValue.text = (this.updateCount++).toString();
        //this.logo.position.setTo(this.game.input.x, this.game.input.y);
    };
    State.prototype.render = function () {
        for (var i = 0; this.players.length > i; i++) {
            this.players[i].render();
        }
    };
    State.prototype.playerById = function (id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }
        return null;
    };
    return State;
}(Phaser.State));
//# sourceMappingURL=game.js.map