class Game {

    map;

    news = [];

    score;
    round;
    infected;

    started;

    constructor() {

        document.title = TITLE;
        this.map = new Map(DIFICULTY.MAP_SIZE);
        this.started = false;

        this.score = START_SCORE;
        this.round = 0;
        this.infected = 0;
        this.news = [];
        this.createScenary();
        this.map.drawAllValid();

        //let result = this.map.shortestWay(new Point(0,0), new Point(0,15),RETURN.PATH);

       //this.map.drawPath(result);
        /*debugger;
        for(let i = 0; i < result.length; i++)*
            this.map.map.rows[result[i].y].cells[result[i].x].style.background = "green";*/

    }

    createScenary() {

        // kolo, nakažení, zpráva, počet, obtížnost, type
        this.newRule(0, null, "Testovací zpráva1", 5, 0, ITEMTYPE.HUMAN);
        this.newRule(0, null, null, 1, 0, ITEMTYPE.GROUP);
        this.newRule(0, null, null, 1, 0, ITEMTYPE.INFECTICITY);
        this.newRule(null, 1, "Testovací zpráva2", 3, 100, ITEMTYPE.HUMAN);
        this.newRule(null, 1, null, 0, 0, ITEMTYPE.HUMAN);
        this.newRule(null, 3, "Hustý", 4, 0, ITEMTYPE.GROUP);

    }

    start() {

        this.map.clear();
        this.checkActions();
        this.map.player.resetPosition();
        this.started = true;

    }


    nextRound() {


        let cell = this.map.checkPlayerPosition();
        if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(document.createElement("div").classList)) {
            if (cell.length != 0)
                SCORE(++this.score);
            else
                SCORE(--this.score);
        }
        else if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(new Item())) {
            INFECTED(++this.infected);
            

        }

        if(this.started){
            ROUND(++this.round);
            this.checkActions();
        }
        

    }


    checkActions() {

        this.map.createItems(this.round, this.infected, this.news);
        this.map.drawItems();

        for (let i = 0; i < this.news.length; i++) {
            if ((this.news[i].round == this.round || this.news[i].infected == this.infected) & this.news[i].news != null) {
                NEWS(this.news[i].news);
            }
            if ((this.news[i].round < this.round || this.news[i].infected < this.infected)) {
                //this.news.splice(i, 1);
            }
        }
    }


    newRule(round, infected, news, itemCount, chance, type){
        this.news.push(new Action(round, infected, news, itemCount, chance, type));
    }
}


