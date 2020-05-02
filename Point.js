class Point {
    constructor(x, y, px, py) {
        this.x = x;
        this.y = y;
        if(px != undefined && py != undefined)
        this.validNeighbour = new Point(px,py);
        /* this.visited = false; */
    }

    setNeighbour(x,y){
        this.validNeighbour = new Point(x,y);
    }

/*     setVisited(value){
        this.visited = value;
    } */
}
