class Sequencer {
    constructor(aY, aMidi) {
        this.y = aY;
        this.r = 40;
        this.x = [];
        this.freqValue = midiToFreq(aMidi);

        // エンベロープの設定
        this.attackTime = 0.001; // 最大音に到達する時間
        this.attackLevel = 0.9; // 最大レベル
        this.decayTime = 0.3; // 持続音に達する時間
        this.susPercent = 0.2; // 持続レベル
        this.sustainTime = 0.1; // 音を持続する時間
        this.releaseTime = 0.5; // 音が消えるまでの時間
        this.releaseLevel = 0; // 消えるレベル

        // シーケンス用配列
        this.sqArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // ループカウント
        this.loopCount = 0;
        this.btnArr = []; // 入力ボタン用配列

    }

    init() {
        // オシレーターの生成
        this.osc = new p5.Oscillator('sine');
        this.osc.amp(0);
        this.osc.start();
        this.osc.freq(this.freqValue);

        this.env = new p5.Envelope();
        this.env.setADSR(this.attackTime, this.decayTime, this.susPercent, this.releaseTime);
        this.env.setRange(this.attackLevel, this.releaseLevel);

        // イベント内でthisを使うので配列を一旦変数に保存
        var thatSqArr = this.sqArr;
        // 入力ボタンの生成
        for (var i = 0; i < this.sqArr.length; i++) {
            this.btnArr[i] = createDiv(i); //<button>の生成
            this.btnArr[i].id(i); //<button>のvalueにi番を設定
            this.btnArr[i].class('btn');
            this.btnArr[i].position(50 * i + 30, this.y - 20);
            this.btnArr[i].mousePressed(function (evt) {
                if (thatSqArr[this.elt.id] == 0) {
                    // トグル 現状の値が0なら1を設定
                    thatSqArr[this.elt.id] = 1;
                } else {
                    thatSqArr[this.elt.id] = 0;
                    // トグル 現状の値が1なら0を設定
                }
                return false;
            });
            this.x[i] = 50 * i + 50;
        }

    }

    draw() {
        // シーケンサー用の円の配置
        for (var i = 0; i < this.sqArr.length; i++) {
            noStroke(); //線なし

            // シーケンス用配列の値が0なら
            if (this.sqArr[i] == 0) {
                fill(50); // 塗りはグレー
            } else {
                // シーケンス用配列の値が1なら
                fill(255, 150, 0); // 塗りはオレンジ
            }
            // 円の配置
            ellipse(this.x[i], this.y, this.r);

            if (i == this.loopCount) {
                // ループ用の円の色
                fill(255, 0, 0, 70);
                // ループ用の円の配置
                ellipse(50 * this.loopCount + 50, this.y, this.r);
            }
        }


        if (frameCount % 4 === 0) {
            // ループカンターをインクリメント
            this.loopCount++;
        }

        // ループカウンターの数がシーケンス用配列の最大になったら
        if (this.loopCount >= this.sqArr.length) {
            this.loopCount = 0; //ループカンターを0に戻す
        }

        // シーケンス用配列のループカンター番目の値が1なら
        if (this.sqArr[this.loopCount] !== 0) {
            this.env.play(this.osc, 0, this.sustainTime);
            this.show(this.loopCount);
        }

        // FFT
        noFill();
        // stroke(255, 150, 0, 127);
        stroke(0, 250, 140, 50);
        var x, y;
        var waveform = fft.waveform();
        // console.log('waveform: '+ waveform.length);
        beginShape();
        for (var i = 0; i < waveform.length; i++) {
            x = map(i, 0, waveform.length, 0, width);
            y = map(waveform[i], -1.0, 1.0, windowHeight - 100, height / 2);
            vertex(x, y);
        }
        endShape();
    }

    show(count) {
        // console.log('show' + count);

        if (frameCount % 4 === 0) {
            circles.push(new Circle(this.y, count));
        }

    }
}
