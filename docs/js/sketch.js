var scaleArray = [48, 52, 53, 55, 57 ,60, 62, 64, 65, 67, 69, 72, 76, 79, 81, 84, 86, 88, 91, 93, 96];
scaleArray = _(scaleArray).shuffle(); // ノートナンバーをシャッフル

var dots = []; // インスタンス
var dotsNum = 6;
var fft;


// 重力モジュール
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var engine;
var world;
var circles = [];
var boundary;


// 初期設定
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(32); // BPMをフレームレートに換算
    engine = Engine.create();
    world = engine.world;

    boundary = new Boundary(windowWidth/2, windowHeight-5);

    for (var i = 0; i < dotsNum; i++) {
        dots[i] = new Sequencer(i*50 + 50, scaleArray[i]);
        dots[i].init();
    }

    fft = new p5.FFT(); //波形のインスタンス
    Engine.run(engine);
}


// ループ関数
function draw(){
    background(0);
    Engine.update(engine);
    noStroke();
    fill(127,0,0);

    for (var i = 0; i < dots.length; i++) {
        dots[i].draw();
    }

    for(var i=0; i< circles.length; i++){
        circles[i].show();

        // if(circles[i].isOffScreen()){
            // circles.splice(i,1);
            // circles[i].removeFromWorld();
            // i--;
        // }
    }
    boundary.show();
    // console.log(circles.length);
    // Ground vertices
    // var vertices = ground.vertices;
    // beginShape();
    // fill(127);
    // for (var i = 0; i < vertices.length; i++) {
    //   vertex(vertices[i].x, vertices[i].y);
    // }
    // endShape();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
