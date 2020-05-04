class Game {

    map;

    actions = []; // 

    round; // Int číslo kola
    started; //Boolean true if game started

    constructor() {

        document.title = TITLE;
        this.map = new Map(DIFICULTY.MAP_SIZE);
        this.started = false;

        this.round = 0;
        this.actions = [];
        this.createScenary();
        //vykreslím do mapy všechny validní a dosažitelné pozice
        this.map.drawAllValid();

        this.setArrows();


        SCORE(SCORE_DATA.SCORE);
        MORTALITY(SCORE_DATA.MORTALITY);
        INFECTICITY(SCORE_DATA.INFECTICITY);
        INFECTED(SCORE_DATA.INFECTED.length);
        DEAD(SCORE_DATA.DEAD);
        HEAL(SCORE_DATA.HEAL);

    }

    createScenary() {

        // kolo, nakažení, zpráva, počet, obtížnost, type
        this.newRule(0, null, "Testovací zpráva1", 5, 0, ITEMTYPE.HUMAN, true);
        this.newRule(0, null, null, 1, 0, ITEMTYPE.GROUP, true);
        this.newRule(0, null, null, 1, 0, ITEMTYPE.MORTALITY, false);
        this.newRule(0, null, null, 1, 0, ITEMTYPE.INFECTICITY, false);

        this.newRule(null, 1, "Testovací zpráva2", 3, 100, ITEMTYPE.HUMAN, true);
        this.newRule(null, 1, null, 0, 0, ITEMTYPE.HUMAN, true);
        this.newRule(null, 2, "Testovací zpráva3", 0, 100, ITEMTYPE.HUMAN, true);
        //this.newRule(null, 3, "Hustý", 4, 0, ITEMTYPE.GROUP);

    }

    start() {

        this.map.clear();
        this.checkActions();
        this.map.player.resetPosition();
        this.started = true;

    }

    gameOver() {

        this.started = null;
        this.map.mainButton.innerHTML = "ZNOVU";
        NEWS("Hra skončila");

    }


    nextRound() {

        if(SCORE_DATA.SCORE <= 0){
            this.gameOver();
            return;
        }


        let cell = this.map.checkPlayerPosition();
        if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(document.createElement("div").classList)) {
            if (this.started) {
                if (SCORE_DATA.MORTALITY > 0) {
                    MORTALITY(--SCORE_DATA.MORTALITY);
                }

                INFECTICITY(this.getAverageInfecticity());
                SCORE(--SCORE_DATA.SCORE);
            }
            else {
                if (cell.length != 0) {
                    SCORE(++SCORE_DATA.SCORE);
                }
                else {
                    SCORE(--SCORE_DATA.SCORE);
                }
            }
        }
        else if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(new Item())) {

            switch (cell.type) {
                case ITEMTYPE.HUMAN:
                    SCORE_DATA.INFECTED.push({ liveSpan: cell.liveSpan, value: cell.distance });
                    SCORE(SCORE_DATA.SCORE += cell.distance + 1);
                    INFECTED(SCORE_DATA.INFECTED.length);
                    break;
                case ITEMTYPE.GROUP:
                    for (let i = 0; i < ITEMTYPE.GROUP_SIZE; i++) {
                        SCORE_DATA.INFECTED.push({ liveSpan: cell.liveSpan, value: cell.distance });
                    }
                    SCORE(SCORE_DATA.SCORE += (cell.distance + 1) * ITEMTYPE.GROUP_SIZE);
                    INFECTED(SCORE_DATA.INFECTED.length);

                    break;
                case ITEMTYPE.MORTALITY:
                    MORTALITY(SCORE_DATA.MORTALITY += ITEMTYPE.MORTALITY_VALUE);
                    break;
                case ITEMTYPE.INFECTICITY:
                    INFECTICITY(SCORE_DATA.INFECTICITY = (this.getAverageInfecticity() + ITEMTYPE.INFECTICITY_VALUE));
                    break;
                default:
                    break;
            }
        }

        this.checkInfected()

        if (this.started) {
            ROUND(++this.round);
            this.checkActions();
        }




    }


    checkActions() {

        this.map.createItems(this.round, SCORE_DATA.INFECTED.length, this.actions);

        let forDelete = [];
        for (let i = 0; i < this.actions.length; i++) {
            if (((this.actions[i].round <= this.round && this.actions[i].round != null) ||
                (this.actions[i].infected <= SCORE_DATA.INFECTED.length && this.actions[i].infected != null)) &&
                this.actions[i].news != null) {

                NEWS(this.actions[i].news);
            }
            if (((this.actions[i].round <= this.round && this.actions[i].round != null) ||
                (this.actions[i].infected <= SCORE_DATA.INFECTED.length && this.actions[i].infected != null))) {
                forDelete.push(i);
            }
        }

        for (let i = 0; i < forDelete.length; i++) {
            this.actions.splice(forDelete[i] - i, 1);
        }
    }


    checkInfected() {

        LOADING(true, "Počítám šíření, a nakazuji nové lidi...");

        setTimeout(() => {

            //let length = SCORE_DATA.INFECTED.length;
            for (let i = 0; i < SCORE_DATA.INFECTED.length; i++) {
                if (RANDOM_NUMBER(0, 100) < SCORE_DATA.INFECTICITY) {
                    SCORE_DATA.INFECTED.push({ liveSpan: PEOPLE_INFECTED_DAY, value: SCORE_DATA.INFECTED[i].value });
                    SCORE(SCORE_DATA.SCORE += SCORE_DATA.INFECTED[i].value);
                }
                if (--SCORE_DATA.INFECTED[i].liveSpan < 0) {

                    if (RANDOM_NUMBER(0, 100) < SCORE_DATA.MORTALITY) {
                        DEAD(++SCORE_DATA.DEAD);
                        SCORE(SCORE_DATA.SCORE += SCORE_DATA.INFECTED[i].value / 2)
                    }
                    else {
                        HEAL(++SCORE_DATA.HEAL);
                        SCORE(SCORE_DATA.SCORE -= parseInt(SCORE_DATA.INFECTED[i].value / 1.5));
                    }
                    SCORE_DATA.INFECTED.splice(i, 1);
                    i--;
                }
                INFECTED(SCORE_DATA.INFECTED.length);
            }
            LOADING(false, "Počítám šíření a nakazuji nové lidi...");
        }, 100);

    }


    getAverageInfecticity() {

        if (SCORE_DATA.INFECTED.length == 0) {
            if (SCORE_DATA.INFECTICITY > 10) {
                return --SCORE_DATA.INFECTICITY;
            }
            else {
                return SCORE_DATA.INFECTICITY;
            }

        }
        let result = 0;
        for (let i = 0; i < SCORE_DATA.INFECTED.length; i++) {
            result += SCORE_DATA.INFECTED[i].value;
        }
        console.log("Raw součet: " + result);
        result = (result / SCORE_DATA.INFECTED.length) * 5;
        console.log("Prumer vzdalenosti *4: " + result);
        return (result < SCORE_DATA.INFECTICITY ? --SCORE_DATA.INFECTICITY : result);
    }


    newRule(round, infected, news, itemCount, chance, type, repeat) {
        this.actions.push(new Action(round, infected, news, itemCount, chance, type, repeat));
    }

    setArrows() {

        document.onkeydown = function (e) {

            if (game.started != null) {
                e = e || window.event;
                if (e.keyCode == '38') {
                    let point = game.map.nextInDirection(game.map.player.position, DIRECTION.TOP);
                    document.getElementById(point.x + ":" + point.y).click();
                    document.getElementById(point.x + ":" + point.y).focus();
                    setTimeout(() => {document.getElementById(point.x + ":" + point.y).blur()}, 250);
                    
                }
                else if (e.keyCode == '40') {
                    let point = game.map.nextInDirection(game.map.player.position, DIRECTION.BOTTOM);
                    document.getElementById(point.x + ":" + point.y).click();
                    document.getElementById(point.x + ":" + point.y).focus();
                    setTimeout(() => {document.getElementById(point.x + ":" + point.y).blur()}, 250);
                }
                else if (e.keyCode == '37') {
                    let point = game.map.nextInDirection(game.map.player.position, DIRECTION.LEFT);
                    document.getElementById(point.x + ":" + point.y).click();
                    document.getElementById(point.x + ":" + point.y).focus();
                    setTimeout(() => {document.getElementById(point.x + ":" + point.y).blur()}, 250);
                }
                else if (e.keyCode == '39') {
                    let point = game.map.nextInDirection(game.map.player.position, DIRECTION.RIGHT);
                    document.getElementById(point.x + ":" + point.y).click();
                    document.getElementById(point.x + ":" + point.y).focus();
                    setTimeout(() => {document.getElementById(point.x + ":" + point.y).blur()}, 250);
                }
                else if(e.keyCode == '32'){
                    game.map.mainButton.click();
                    game.map.mainButton.focus();
                    setTimeout(() => {game.map.mainButton.blur()}, 150);
                }
            }
        }

    }
}


