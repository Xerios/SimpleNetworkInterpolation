/// <reference path="game.ts" />

import Sprite = Phaser.Sprite;

class Player {

    game: SimpleGame;
    sprite: Sprite;
    sprite2: Sprite;

    id:string;
    name:string;

    x:number;
    y:number;

    x2:number;
    y2:number;

    vel_x:number;
    vel_y:number;
    vel_x2:number;
    vel_y2:number;

    points;

    time:number = 0;


    constructor(game: SimpleGame, id: string, name: string) {
        this.id = id;
        this.name = name;
        this.game = game;
    }

    // -------------------------------------------------------------------------
    public setup(x: number,y: number) {
        this.sprite = this.game.add.sprite(x,y, 'player');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.scale.setTo(0.2, 0.2);
        //this.game.add.tween(this.sprite.scale).to({ x: 0.5, y: 0.5 }, 2000, Phaser.Easing.Bounce.Out, true);
        //this.game.add.text(x, y, this.id);

        /*this.sprite2 = this.game.add.sprite(x,y, 'player');
        this.sprite2.anchor.setTo(0.5, 0.5);
        this.sprite2.scale.setTo(0.1, 0.1);*/

        this.points = {
            x: [ 0, 0, 0, 0 ],
            y: [ 0, 0, 0, 0 ]
        };

        this.setPos(x,y, 0, 0);

    }

    public setPos(x:number,y:number,vx:number,vy:number) {
        //if (this.x!=x || this.y!=y) {

            this.x2 = this.x;
            this.y2 = this.y;

            this.x = x;
            this.y = y;

            this.vel_x2 = this.vel_x;
            this.vel_y2 = this.vel_y;

            this.vel_x = vx;
            this.vel_y = vy;

            this.points.x[0] = this.x2;
            this.points.y[0] = this.y2;

            this.points.x[1] = this.x2 - this.vel_x2;
            this.points.y[1] = this.y2 - this.vel_y2;

            this.points.x[2] = this.x - this.vel_x;
            this.points.y[2] = this.y - this.vel_y;

            this.points.x[3] = this.x;
            this.points.y[3] = this.y;
        //}
        this.time=0;//Math.max(0, Math.min(this.time,0.77777) - 0.333333);
    }

    public update() {
        //this.textValue.text = (this.updateCount++).toString();
        var t = Math.min(this.time, 1);

        this.sprite.position.setTo(
            this.game.math.bezierInterpolation(this.points.x, t),
            this.game.math.bezierInterpolation(this.points.y, t)
        );

        /*this.sprite2.position.setTo(
            this.game.math.linear(this.x2, this.x, 1),
            this.game.math.linear(this.y2, this.y, 1)
        );*/

        /*var sprite2 = this.game.add.sprite(
            this.game.math.bezierInterpolation(this.points.x, t),
            this.game.math.bezierInterpolation(this.points.y, t),
            'player');
        sprite2.anchor.setTo(0.5, 0.5);
        sprite2.scale.setTo(0.01, 0.01);*/

        this.time = this.time + (1/0.2) * this.game.time.physicsElapsed;

        //console.log(t, this.game.time.physicsElapsed);
        //console.log(Math.floor(t*100), Array(Math.floor(t*100)).join("*"));

        //this.sprite.position.x = this.game.math.linear(this.sprite.position.x, this.x, 0.05);
        //this.sprite.position.y = this.game.math.linear(this.sprite.position.y, this.y, 0.05);
        //this.sprite.position.setTo(this.x, this.y);
    }

    public render(){
        for (var t = 0; t < 1; t+=0.01) {
            this.game.debug.pixel(
                this.game.math.linear(this.x2, this.x, t),
                this.game.math.linear(this.y2, this.y, t),
                'rgba(0,255,255,1)' ) ;

            this.game.debug.pixel(
                this.game.math.bezierInterpolation(this.points.x, t),
                this.game.math.bezierInterpolation(this.points.y, t),
                'rgba(255,255,0,1)' ) ;
        }

        for (var t = 0; t < 1; t+=0.01) {
            this.game.debug.pixel(
                this.game.math.linear(this.points.x[0], this.points.x[1], t),
                this.game.math.linear(this.points.y[0], this.points.y[1], t),
                'rgba(0,0,255,'+t+')' ) ;

            this.game.debug.pixel(
                this.game.math.linear(this.points.x[3], this.points.x[2], t),
                this.game.math.linear(this.points.y[3], this.points.y[2], t),
                'rgba(0,0,255,'+t+')' ) ;
        }
    }
    // -------------------------------------------------------------------------
    public destroy() {
        this.sprite.kill();
        // remove movement tweens
        /*this.game.tweens.removeFrom(this.body);
        // explode dron and kill it on complete
        this.play("explosion", 8, false, true);*/
    }
}
