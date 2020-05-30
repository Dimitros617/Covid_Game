
/**
 * @description Containet rřída pro uchovávání pozice v souradnicách X a Y + pozici sousední
 * @author Dominik Frolík
 * @see www.dominikfrolik.cz
 */
class Point {

    /**
     * @description založení instance Point
     * @param {Int} x 
     * @param {Int} y 
     * @param {Int} px 
     * @param {Int} py 
     */
    constructor(x, y, px, py) {
        this.x = x;
        this.y = y;

        if(px != undefined && py != undefined)
            this.validNeighbour = new Point(px,py);
    }

    /**
     * @description Metoda nastaví point libovolného pointu jako souseda
     * @param {Int} x 
     * @param {Int} y 
     */
    setNeighbour(x,y){
        this.validNeighbour = new Point(x,y);
    }

}
