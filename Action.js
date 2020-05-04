class Action {

    constructor(round, infected, news, itemCount, chance, type, repeat) {
        this.round = round;
        this.infected = infected;
        this.news = news;
        this.itemCount = itemCount;
        this.dificulty = type == ITEMTYPE.HUMAN ? chance <= RANDOM_NUMBER(0,100) ? 0 : 1 : 0; 
        this.type = type;
        this.repeat = repeat;
    }

}
