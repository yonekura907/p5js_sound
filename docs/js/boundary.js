class Boundary{
    constructor(x,y){
        const options = {
            friction: 0.2,
            restitution: 0.6,
            angle: 0,
            isStatic: true
        }
        this.w = width;
        this.h = 5;
        this.body = Bodies.rectangle(x, y, this.w, this.h, options);
        World.add(world, this.body);
    }

    show(){
        const pos = this.body.position;
        const angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        noStroke();
        fill(0);
        rect(0,0,this.w,this.h);
        pop();
    }
}
