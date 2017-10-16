var scaleArray = [60, 64, 67, 69, 72, 76, 79, 81, 84 ,88, 91];

scaleArray = _(scaleArray).shuffle(); // ノートナンバーをシャッフル

var a,b,c,d,e,f; // インスタンス

var fft;


// 初期設定
function setup() {
    createCanvas(windowWidth, windowHeight); //Canvasの生成
    frameRate(32); // BPMをフレームレートに換算

    a = new Sequencer(100,scaleArray[0]);
    b = new Sequencer(150,scaleArray[1]);
    c = new Sequencer(200,scaleArray[2]);
    d = new Sequencer(250,scaleArray[3]);
    e = new Sequencer(300,scaleArray[4]);
    f = new Sequencer(350,scaleArray[5]);

    fft = new p5.FFT(); //波形のインスタンス
}




// ループ関数
function draw(){
    background(0);
    a.draw();
    b.draw();
    c.draw();
    d.draw();
    e.draw();
    f.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function Sequencer(aY,aMidi){

    this.y = aY;

    var midiNote = aMidi;
    var freqValue = midiToFreq(midiNote);

    // エンベロープの設定
    this.attackTime = 0.001; // 最大音に到達する時間
    this.attackLevel = 0.9; // 最大レベル
    this.decayTime = 0.3; // 持続音に達する時間
    this.susPercent = 0.2; // 持続レベル
    this.sustainTime = 0.1; // 音を持続する時間
    this.releaseTime = 0.5; // 音が消えるまでの時間
    this.releaseLevel = 0; // 消えるレベル

    // オシレーターの生成
    this.osc = new p5.Oscillator('sine');
    this.osc.amp(0);
    this.osc.start();
    this.osc.freq(freqValue);

    this.env = new p5.Env();
    this.env.setADSR(this.attackTime, this.decayTime, this.susPercent, this.releaseTime);
    this.env.setRange(this.attackLevel, this.releaseLevel);


    // this.delay = new p5.Delay();
    // this.delay.process(this.osc, .08, .5, 1300);

    // this.a = new p5.Amplitude();

    // シーケンス用配列
    this.sqArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // イベント内でthisを使うので配列を一旦変数に保存
    var thatSqArr = this.sqArr;

    // ループカウント
    this.loopCount = 0;

    this.btnArr = []; // 入力ボタン用配列

    // 入力ボタンの生成
    for (var i = 0; i < this.sqArr.length; i++) {
        this.btnArr[i] = createDiv(i); //<button>の生成
        this.btnArr[i].id(i); //<button>のvalueにi番を設定
        this.btnArr[i].class('btn');
        this.btnArr[i].position(50*i + 30, this.y - 20);
        this.btnArr[i].mousePressed(function(evt){
            if( thatSqArr[this.elt.id] == 0 ){
                // トグル 現状の値が0なら1を設定
                thatSqArr[this.elt.id] = 1;
            } else {
                thatSqArr[this.elt.id] = 0;
                // トグル 現状の値が1なら0を設定
            }
            return false;
        });
    }
}


Sequencer.prototype.draw = function(){

    // シーケンサー用の円の配置
    for (var i = 0; i < this.sqArr.length; i++) {
        noStroke(); //線なし

        // シーケンス用配列の値が0なら
        if(this.sqArr[i] == 0){
            fill(50); // 塗りはグレー
        } else {
            // シーケンス用配列の値が1なら
            fill(255, 150, 0); // 塗りはオレンジ
        }
        // 円の配置
        ellipse(50*i + 50, this.y, 40, 40);

        if(i == this.loopCount){
            // ループ用の円の色
            fill(255, 0, 0, 70);
            // ループ用の円の配置
            ellipse(50 * this.loopCount + 50, this.y, 40, 40);
        }
    }


    if(frameCount % 4 === 0){
        // ループカンターをインクリメント
        this.loopCount++;
    }

    // ループカウンターの数がシーケンス用配列の最大になったら
    if(this.loopCount >= this.sqArr.length){
        this.loopCount = 0; //ループカンターを0に戻す
    }

    // シーケンス用配列のループカンター番目の値が1なら
    if(this.sqArr[this.loopCount] !== 0){
        this.env.play(this.osc, 0, this.sustainTime);
    }


    // FFT
    noFill();
    stroke(255, 150, 0, 127);
    var x, y;
    var waveform = fft.waveform();
    beginShape();
    for (var i = 0; i < waveform.length; i++) {
        x = map(i, 0, waveform.length, 0, width);
        y = map(waveform[i], -1.0, 1.0, windowHeight - 400, height);
        vertex(x, y);
    }
    endShape();
}
