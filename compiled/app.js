/// <reference path="game.ts" />
function q(query) {
    return document.querySelector(query);
}
window.onload = function () {
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
//# sourceMappingURL=app.js.map