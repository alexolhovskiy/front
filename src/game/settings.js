
export var WIDTH=800;
export var HEIGHT=800;
export var CENTER_W=WIDTH/2;
export var CENTER_H=HEIGHT/2;
export let FPS=15;

export function loadSettings(canvas){
    WIDTH=canvas.width;
    HEIGHT=canvas.height;
    CENTER_W=WIDTH/2;
    CENTER_H=HEIGHT/2;
}
