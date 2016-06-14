/// <reference path="game.ts" />

function q(query : string){
    return (<HTMLElement>document.querySelector(query));
}

window.onload = () => {

    new Game();
/*
    q('#b').addEventListener('click', () => {
        var i = (<HTMLInputElement>q('#m'));
        game.io.emit('chat message', i.value);
        i.value = '';
        console.log("2");
        console.log("2");
        return false;
    })*/
};