class Action {

    constructor(round, infected, news, itemCount, chance, type) {
        this.round = round;
        this.infected = infected;
        this.news = news;
        this.itemCount = itemCount;
        this.dificulty = type == ITEMTYPE.HUMAN ? chance <= Math.floor(Math.random() * (100 - 0 + 1)) + 0 ? 0 : 1 : 0; 
        this.type = type;
    }

}
