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
        this.goals = [];
        this.createScenary();
        this.createGoals();
        //vykreslím do mapy všechny validní a dosažitelné pozice
        this.map.drawAllValid();

        this.setArrows();
        this.setShop();


        SCORE(SCORE_DATA.SCORE);
        MORTALITY(SCORE_DATA.MORTALITY);
        INFECTICITY(SCORE_DATA.INFECTICITY);
        INFECTED(SCORE_DATA.INFECTED.length);
        DEAD(SCORE_DATA.DEAD);
        HEAL(SCORE_DATA.HEAL);

        this.map.mainButton.innerHTML = "START";




    }

    createScenary() {

        // typeOfScore, value, zpráva, počet, obtížnost, type, opakování
        this.newRule(TYPE.DEAD, 0, "Pocet mrtvych", 5, 0, ITEMTYPE.HUMAN, true);
        this.newRule(TYPE.HEAL, 2, "Pocet uzdravenych", 3, 0, ITEMTYPE.GROUP, true);
        this.newRule(TYPE.MORTALITY, -40, "Umrtnost", 1, 0, ITEMTYPE.MORTALITY, true);
        this.newRule(TYPE.MORTALITY, 60, "Umrtnost nic", 0, 0, ITEMTYPE.MORTALITY, true);
        //this.newRule(TYPE.INFECTICITY, 15, "Nakazlivost", 1, 0, ITEMTYPE.INFECTICITY, true);
    }

    createGoals(){

        this.newGoal(TYPE.SCORE, 100, "Gratuluji dosáhli jste 100 bodů", "img/winner.gif");
        this.newGoal(TYPE.SCORE, 1000, "WOW dosáhli jste už 1000 bodů", "img/winner.gif");
        this.newGoal(TYPE.SCORE, 10000, "Jsi nezastavitelný už máš 10 000 bodů", "img/winner.gif");
        
        this.newGoal(TYPE.DEAD, 10, "Gratuluji dosáhli jste 10 mrtvých", "img/winner.gif");
        this.newGoal(TYPE.DEAD, 100, "WOW už umřelo 100 lidí", "img/winner.gif");

        this.newGoal(TYPE.HEAL, 10, "Sakra ta imunita, už 10 lidí se vyléčilo", "img/winner.gif");
        this.newGoal(TYPE.HEAL, 100, "Pozor už se vyléčilo 100 lidí", "img/winner.gif");

        this.newGoal(TYPE.INFECTICITY, 50, "Infekticita je tak velká že se nakazí už každý druhý člověk", "img/winner.gif");
        this.newGoal(TYPE.MORTALITY, 50, "Úmrtnost se vyšplhala tak vysoko, že umírá každý druhý člověk", "img/winner.gif");

        this.newGoal(TYPE.INFECTICITY, 100, "Infekčnost je teď na maximu, každé kolo se zdvojnásobují nakažení", "img/winner.gif");
        this.newGoal(TYPE.MORTALITY, 100, "Úmrtnost je neúprosná, neexistuje lék, každý kdo je nakažený 100% umře", "img/winner.gif");

    }

    start() {

        this.map.clear();
        this.checkActions();
        this.map.player.resetPosition();
        this.started = true;

        DIV_INFO.children[0].children[1].disabled = true;
        DIV_INFO.children[0].children[1].style.color = "grey";
        DIV_INFO.children[0].value = 0;
        DIV_INFO.children[0].onchange({target:  DIV_INFO.children[0]});
        ACHIEVEMENT("Hodně štěstí", "img/luck.png");
   }

    reStart(){
        SCORE(SCORE_DATA.SCORE = 10);
        MORTALITY(SCORE_DATA.MORTALITY = 50);
        INFECTICITY(SCORE_DATA.INFECTICITY = 10);
        INFECTED(SCORE_DATA.INFECTED = []);
        DEAD(SCORE_DATA.DEAD = 0);
        HEAL(SCORE_DATA.HEAL = 0);
        window.UI.generateNewMap();
    }

    gameOver() {

        this.started = null;
        this.map.mainButton.innerHTML = "ZNOVU";
        ACHIEVEMENT("Ups hra skončila, došli ti body.", "img/cross.png");
        NEWS("Gratuluji, celkové skóre je: " + this.getFinalScore());
        DIV_INFO.children[0].children[1].disabled = false;
        DIV_INFO.children[0].children[1].style.color = "black";
        DIV_INFO.children[0].onchange({target:  DIV_INFO.children[0]});

    }


    nextRound() {

        if (SCORE_DATA.SCORE <= 0) {
            this.gameOver();
            return;
        }

        let cell = this.map.checkPlayerPosition();
        if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(document.createElement("div").classList)) {
            if (this.started) {
                if (SCORE_DATA.MORTALITY > 0) {
                    MORTALITY(--SCORE_DATA.MORTALITY);
                }
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
                    INFECTICITY(SCORE_DATA.INFECTICITY = (SCORE_DATA.INFECTICITY + ITEMTYPE.INFECTICITY_VALUE));
                    break;
                default:
                    break;
            }
        }

        this.checkInfected()

        if (this.started) {
            ROUND(++this.round);
            this.checkActions();
            this.checkGoals();
        }
    }


    checkActions() {

        this.map.createItems(this.actions);

        let forDelete = [];
        for (let i = 0; i < this.actions.length; i++) {
            if ((SCORE_DATA.onIndex(this.actions[i].typeOfScore) >= Math.abs(this.actions[i].value) && this.actions[i].value >= 0) || (SCORE_DATA.onIndex(this.actions[i].typeOfScore) <= Math.abs(this.actions[i].value) && this.actions[i].value < 0)) {
                if (this.actions[i].news != null) {
                    NEWS(this.actions[i].news);
                }
                forDelete.push(i);
            }
        }

        for (let i = 0; i < forDelete.length; i++) {
            //this.actions.splice(forDelete[i] - i, 1);
        }
    }


    checkInfected() {

        LOADING(true, "Počítám šíření, a nakazuji nové lidi...");

        setTimeout(() => {

            let length = SCORE_DATA.INFECTED.length;
            for (let i = 0; i < length; i++) {
                if (RANDOM_NUMBER(0, 100) < SCORE_DATA.INFECTICITY) {
                    SCORE_DATA.INFECTED.push({ liveSpan: PEOPLE_INFECTED_DAY, value: SCORE_DATA.INFECTED[i].value });
                    SCORE(SCORE_DATA.SCORE += SCORE_DATA.INFECTED[i].value);
                    if(SCORE_DATA.INFECTICITY > 4 && SCORE_DATA.INFECTED[i].liveSpan-1 < 0){
                        debugger;
                        INFECTICITY(SCORE_DATA.INFECTICITY -= 5);
                    }
                }
                else{
                    if(SCORE_DATA.INFECTICITY < 100 && SCORE_DATA.INFECTED[i].liveSpan-1 < 0){
                        INFECTICITY(SCORE_DATA.INFECTICITY += 1);
                    }
                }
                if (--SCORE_DATA.INFECTED[i].liveSpan < 0) {

                    if (RANDOM_NUMBER(0, 100) < SCORE_DATA.MORTALITY) {
                        DEAD(++SCORE_DATA.DEAD);
                        SCORE(SCORE_DATA.SCORE += SCORE_DATA.INFECTED[i].value / 2)
                    }
                    else {
                        HEAL(++SCORE_DATA.HEAL);
                        SCORE(SCORE_DATA.SCORE -= parseInt(SCORE_DATA.INFECTED[i].value * 2));
                    }
                    SCORE_DATA.INFECTED.splice(i, 1);
                    i--;
                }
                INFECTED(SCORE_DATA.INFECTED.length);
            }
            LOADING(false, "Počítám šíření a nakazuji nové lidi...");
        }, 100);

    }

    checkGoals(){
        let showOne = false;
        for(let i = 0; i < this.goals.length && !showOne ; i++){
            if(SCORE_DATA.onIndex(this.goals[i].typeOfScore) >= this.goals[i].value && !this.goals[i].show){
                showOne = true;
                ACHIEVEMENT(this.goals[i].text, this.goals[i].img);
                this.goals[i].show = true;
            }
        }
    }

    //Not WORKING
    getFinalScore(){

        let score = SCORE_DATA.SCORE;
        for(let i = 0; i < SCORE_DATA.INFECTED.length; i++){
            score += SCORE_DATA.INFECTED[i].value;
        }
        score += SCORE_DATA.DEAD * 10;
        score += SCORE_DATA.HEAL * 5;

        return score;
    }


    newRule(typeOfScore, value, news, itemCount, chance, type, repeat) {
        this.actions.push(new Action(typeOfScore, value, news, itemCount, chance, type, repeat));
    }

    newGoal(typeOfScore, value, text, img) {
        this.goals.push({typeOfScore: typeOfScore, value: value, text: text, img: img, show: false});
    }

    setArrows() {

        document.onkeydown = function (e) {

            try {
                if (game.started != null) {
                    e = e || window.event;
                    if (e.keyCode == '38') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.TOP);
                        document.getElementById(point.x + ":" + point.y).click();
                        document.getElementById(point.x + ":" + point.y).focus();
                        setTimeout(() => { document.getElementById(point.x + ":" + point.y).blur() }, 250);

                    }
                    else if (e.keyCode == '40') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.BOTTOM);
                        document.getElementById(point.x + ":" + point.y).click();
                        document.getElementById(point.x + ":" + point.y).focus();
                        setTimeout(() => { document.getElementById(point.x + ":" + point.y).blur() }, 250);
                    }
                    else if (e.keyCode == '37') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.LEFT);
                        document.getElementById(point.x + ":" + point.y).click();
                        document.getElementById(point.x + ":" + point.y).focus();
                        setTimeout(() => { document.getElementById(point.x + ":" + point.y).blur() }, 250);
                    }
                    else if (e.keyCode == '39') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.RIGHT);
                        document.getElementById(point.x + ":" + point.y).click();
                        document.getElementById(point.x + ":" + point.y).focus();
                        setTimeout(() => { document.getElementById(point.x + ":" + point.y).blur() }, 250);
                    }
                    else if (e.keyCode == '32') {
                        game.map.mainButton.click();
                        game.map.mainButton.focus();
                        setTimeout(() => { game.map.mainButton.blur() }, 150);
                    }
                    else if (e.keyCode == '27') {
                        if(document.getElementById("achievementContent") != null){
                            document.getElementById("achievementContent").click(document.getElementById("achievementContent"));
                        }
                    }
                }
            } catch (error) {

            }
        }
    }

    setShop(){

        ADD_MORTALITY.onclick = function(){
            if(SCORE_DATA.SCORE - 10 >= 0){
                SCORE(SCORE_DATA.SCORE -= 10);
                MORTALITY(SCORE_DATA.MORTALITY += 5);
            }
            else{
                ACHIEVEMENT("Ups... Bohužel přidání 5% úmrtnosti stojí 10 bodů, a ty nemáš.", "img/exclamation.png")
            }
        }

        ADD_INFECTICITY.onclick = function(){
            if(SCORE_DATA.SCORE - 10 >= 0){
                SCORE(SCORE_DATA.SCORE -= 10);
                INFECTICITY(SCORE_DATA.INFECTICITY += 5);
            }
            else{
                ACHIEVEMENT("Ups... Bohužel přidání 5% nakažlivosti stojí 10 bodů, a ty nemáš." , "img/exclamation.png")
            }
        }
    }

}


