class Action {

    constructor(typeOfScore, value, news, itemCount, chance, type, repeat) {
        this.typeOfScore = typeOfScore;
        this.value = value;
        this.news = news;
        this.itemCount = itemCount;
        this.dificulty = type == ITEMTYPE.HUMAN ? chance <= RANDOM_NUMBER(0,100) ? 0 : 1 : 0; 
        this.type = type;
        this.repeat = repeat;
    }

}
