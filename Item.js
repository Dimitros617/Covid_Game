
class Item {

    constructor(position, dificulty, distance, type){

        this.position = position;
        this.dificulty = dificulty;
        this.immunity = this.dificulty;
        this.distance = distance;
        this.type = type;
        this.liveSpan = PEOPLE_INFECTED_DAY;
        this.drawPath = false;
    }

}
