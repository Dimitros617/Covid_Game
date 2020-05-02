
class Item {

    constructor(position, dificulty, distance, type){

        this.position = position;
        this.dificulty = dificulty;
        this.distance = distance;
        this.newDistance = 0;
        this.type = type;
        this.liveSpan = PEOPLE_INFECTED_DAY;
        this.drawPath = false;
    }

    addDistance(i){
        this.newDistance += i;
    }

    getDistance(how){
        return how ? this.distance : this.distance + this.newDistance;
    }
}
