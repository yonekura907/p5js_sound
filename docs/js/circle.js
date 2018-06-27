class Circle{

    constructor(y,count){
        this.options = {
            friction: 0.4,
            restitution: 1.2,

        }
        this.count = count;
        this.x = 50 * this.count + 50;
        this.y = y;
        this.r = 40;
        this.body = Bodies.circle(this.x, this.y, this.r, this.options);
        World.add(world, this.body);
    }



    isOffScreen(){
        var pos = this.body.position;
        return (pos.y > height + 100);
    }

    removeFromWorld(){
        // console.log('remove');
        World.remove(world, this.body);
    }

    show(){
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        noStroke();
        fill(255, 150, 0, 80);
        // fill(0, 160, 250, 127);
        ellipse(0,0,this.r);
        pop();
    }
}
