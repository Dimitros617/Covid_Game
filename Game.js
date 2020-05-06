class Game {

    map;

    actions = []; // 

    round; // Int číslo kola
    started; //Boolean true if game started

    constructor() {

        LOADING(true, "Vytvářím mapu...");

        setTimeout(() => {


            document.title = TITLE;
            this.map = new Map(DIFICULTY.MAP_SIZE);
            this.started = false;



            this.round = 0;
            this.actions = [];
            this.goals = [];
            //vykreslím do mapy všechny validní a dosažitelné pozice
            this.map.drawAllValid("valid");

            this.setArrows();
            this.setShop();

            this.player = this.map.player;
            if (DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE) {
                this.secondPlayer = new Player(this.map, "player2");
                this.player.resetPosition();
                this.flipPlayers();
                this.player.resetPosition();
                this.flipPlayers();
                this.player.me.click(this.player.me);
            }
            else {
                this.player.resetPosition();
            }


            SCORE(SCORE_DATA.SCORE = SCORE_DATA_DEFAULT.SCORE);
            MORTALITY(SCORE_DATA.MORTALITY = SCORE_DATA_DEFAULT.MORTALITY);
            CURE(SCORE_DATA.CURE = SCORE_DATA_DEFAULT.CURE);
            INFECTED((SCORE_DATA.INFECTED = SCORE_DATA_DEFAULT.INFECTED).length);
            DEAD(SCORE_DATA.DEAD = SCORE_DATA_DEFAULT.DEAD);
            HEAL(SCORE_DATA.HEAL = SCORE_DATA_DEFAULT.HEAL);

            this.map.mainButton.innerHTML = "START";



            LOADING(false);
        });
    }

    createScenary() {
        debugger;

        switch (DIFICULTY.GAME_MODE) {
            case GAME_MODE.EDUCATION://------------------------------------------------------------------------------

                break;
            case GAME_MODE.ONE_POINT://------------------------------------------------------------------------------
                this.newRule(TYPE.DEAD, 0, "Hodně štěstí ...", 1, 0, ITEMTYPE.BOTTLE, true);
                break;
            case GAME_MODE.ALL_IN://------------------------------------------------------------------------------
                this.map.drawAllValid("bottle");
                break;
            case GAME_MODE.STORY://------------------------------------------------------------------------------

                // typeOfScore, value, zpráva, počet, obtížnost, type, opakování

                this.newRule(TYPE.MORTALITY, -10, null, 3, 0, ITEMTYPE.MORTALITY, true);
                this.newRule(TYPE.MORTALITY, -40, null, 1, 0, ITEMTYPE.MORTALITY, true);
                this.newRule(TYPE.MORTALITY, 50, null, 0, 0, ITEMTYPE.MORTALITY, true);

                this.newRule(TYPE.DEAD, 0, "Vláda prohlašuje, že Virus se v ČR zatím nevyskytuje", 4, 0, ITEMTYPE.HUMAN, true);
                this.newRule(TYPE.DEAD, 0, null, 2, 0, ITEMTYPE.GROUP, true);
                this.newRule(TYPE.INFECTED, 1, "V Česku se objevil první případ viru, lidé vykupují obchody, všude jsou teď skupinky lidí", 4, 0, ITEMTYPE.GROUP, true);
                this.newRule(TYPE.DEAD, 1, "První mrtvý lidé stále vykupují obchody", 4, 0, ITEMTYPE.GROUP, true);
                this.newRule(TYPE.DEAD, 16, "Mrtvý přibývají vláda se schází a chce vyhlásit stav nouze", 3, 0, ITEMTYPE.GROUP, true);
                this.newRule(TYPE.DEAD, 24, "Vláda se shodla, nařídila, že lidé se nesmí shlukovat do skupinek", 0, 0, ITEMTYPE.GROUP, true);
                this.newRule(TYPE.HEAL, 1, "První uzdravený se dostávají zpět domu", 1, 0, ITEMTYPE.CURE, false);
                this.newRule(TYPE.HEAL, 10, "Již se z nemocnice vrátilo 10 lidí", 1, 0, ITEMTYPE.CURE, false);
                this.newRule(TYPE.DEAD, 43, "Vláda nařizuje zákaz vycházení, lidé by měli omezit chození ven", 2, 0, ITEMTYPE.HUMAN, true);
                this.newRule(TYPE.DEAD, 50, "Vláda nařídila si povině chránít ústa rouškamy", 2, 100, ITEMTYPE.HUMAN, true);
                this.newRule(TYPE.DEAD, 50, null, 0, 0, ITEMTYPE.HUMAN, true);

                break;
            default:
                break;
        }
    }

    createGoals() {


        switch (DIFICULTY.GAME_MODE) {
            case GAME_MODE.EDUCATION://------------------------------------------------------------------------------

                break;
            case GAME_MODE.ONE_POINT://------------------------------------------------------------------------------
                this.newGoal(TYPE.SCORE, 50, "Jde ti to dobře, pokračuj dál..", "img/award.png");
                this.newGoal(TYPE.SCORE, 100, "Páni! jsi k nezastavení, sem se dostane málo kdo.", "img/award.png");
                this.newGoal(TYPE.SCORE, 150, "No, co na to říct, jsi dobrej.", "img/award.png");
                this.newGoal(TYPE.SCORE, 200, "To tě to ještě nepřestalo bavit? Tak daleko jsem tě nečekal.", "img/award.png");
                this.newGoal(TYPE.SCORE, 250, "Sakra tvojí hlavu bych chtěl prostudovat.", "img/award.png");
                this.newGoal(TYPE.SCORE, 300, "Tak zatím se moc lidí až sem nedostalo, jakože fakt MÁLO!", "img/award.png");
                this.newGoal(TYPE.SCORE, 350, "No nevím co na to mám říct, jakože si ultra mega kruto přísně dobrej", "img/award.png");
                this.newGoal(TYPE.SCORE, 400, "Už se tě začínám bát, si k nezastavení", "img/award.png");
                this.newGoal(TYPE.SCORE, 450, "Tak daleko se nedostal, ani vývojář. ANO ani já, díky, že hraješ snad si to užíváš", "img/award.png");
                this.newGoal(TYPE.SCORE, 500, "Já se vzdávám, vyhrál si, ale můžeš pokračovat dál, a překonej ve skore například své kamarády", "img/award.png");

                break;
            case GAME_MODE.ALL_IN://------------------------------------------------------------------------------

                break;
            case GAME_MODE.STORY://------------------------------------------------------------------------------

                this.newGoal(TYPE.SCORE, 100, "Gratuluji dosáhli jste 100 bodů", "img/award.png");
                this.newGoal(TYPE.SCORE, 1000, "WOW dosáhli jste už 1000 bodů", "img/award.png");
                this.newGoal(TYPE.SCORE, 10000, "Jsi nezastavitelný už máš 10 000 bodů", "img/award.png");

                this.newGoal(TYPE.DEAD, 10, "Gratuluji dosáhli jste 10 mrtvých", "img/award.png");
                this.newGoal(TYPE.DEAD, 100, "WOW už umřelo 100 lidí", "img/award.png");

                this.newGoal(TYPE.HEAL, 10, "Sakra ta imunita, už 10 lidí se vyléčilo", "img/award.png");
                this.newGoal(TYPE.HEAL, 100, "Pozor už se vyléčilo 100 lidí", "img/award.png");

                this.newGoal(TYPE.CURE, 50, "Jů. Léčba už je na 50 %", "img/medicine.png");
                this.newGoal(TYPE.MORTALITY, 50, "Úmrtnost se vyšplhala tak vysoko, že umírá každý druhý člověk", "img/award.png");

                this.newGoal(TYPE.CURE, 90, "Pozor lék už je skoro hotový", "img/medicine.png");
                this.newGoal(TYPE.MORTALITY, 100, "Úmrtnost je neúprosná, neexistuje lék, každý kdo je nakažený 100% umře", "img/award.png");

                break;
            default:
                break;
        }

    }

    start() {

        this.map.clear();
        this.map.player.resetPosition();
        this.started = true;
        ROUND(this.round = 1);
        DIV_INFO.children[0].children[1].disabled = true;
        DIV_INFO.children[0].children[1].style.color = "grey";
        DIV_INFO.children[0].value = 0;
        DIV_INFO.children[0].onchange({ target: DIV_INFO.children[0] });
        this.createScenary();
        this.createGoals();

        this.checkActions();

        switch (DIFICULTY.GAME_MODE) {
            case GAME_MODE.EDUCATION://------------------------------------------------------------------------------

                break;
            case GAME_MODE.ONE_POINT://------------------------------------------------------------------------------
                SCORE(SCORE_DATA.SCORE = SCORE_DATA_DEFAULT.SCORE);
                MORTALITY(SCORE_DATA.MORTALITY = SCORE_DATA_DEFAULT.MORTALITY);
                CURE(SCORE_DATA.CURE = SCORE_DATA_DEFAULT.CURE);
                INFECTED((SCORE_DATA.INFECTED = SCORE_DATA_DEFAULT.INFECTED).length);
                DEAD(SCORE_DATA.DEAD = SCORE_DATA_DEFAULT.DEAD);
                HEAL(SCORE_DATA.HEAL = SCORE_DATA_DEFAULT.HEAL);
                DIFICULTY.PRICE_FOR_PATH = this.map.item[0].distance;
                break;
            case GAME_MODE.ALL_IN://------------------------------------------------------------------------------
                SCORE(SCORE_DATA.SCORE = SCORE_DATA_DEFAULT.SCORE);
                MORTALITY(SCORE_DATA.MORTALITY = SCORE_DATA_DEFAULT.MORTALITY);
                CURE(SCORE_DATA.CURE = SCORE_DATA_DEFAULT.CURE);
                INFECTED((SCORE_DATA.INFECTED = SCORE_DATA_DEFAULT.INFECTED).length);
                DEAD(SCORE_DATA.DEAD = SCORE_DATA_DEFAULT.DEAD);
                HEAL(SCORE_DATA.HEAL = SCORE_DATA_DEFAULT.HEAL);
                DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.NEVER;
                break;
            case GAME_MODE.STORY://------------------------------------------------------------------------------

                break;
            default:
                break;
        }

    }

    reStart() {
        SCORE(SCORE_DATA.SCORE = SCORE_DATA_DEFAULT.SCORE);
        MORTALITY(SCORE_DATA.MORTALITY = SCORE_DATA_DEFAULT.MORTALITY);
        CURE(SCORE_DATA.CURE = SCORE_DATA_DEFAULT.CURE);
        INFECTED((SCORE_DATA.INFECTED = SCORE_DATA_DEFAULT.INFECTED).length);
        DEAD(SCORE_DATA.DEAD = SCORE_DATA_DEFAULT.DEAD);
        HEAL(SCORE_DATA.HEAL = SCORE_DATA_DEFAULT.HEAL);
        window.UI.generateNewMap();
    }

    gameOver() {

        this.started = null;
        this.map.mainButton.innerHTML = "ZNOVU";
        DIV_INFO.children[0].children[1].disabled = false;
        DIV_INFO.children[0].children[1].style.color = "black";
        DIV_INFO.children[0].onchange({ target: DIV_INFO.children[0] });

    }


    nextRound() {
        var cell = this.map.checkPlayerPosition();
        if (this.started) {
            switch (DIFICULTY.GAME_MODE) {
                case GAME_MODE.EDUCATION://------------------------------------------------------------------------------

                    break;
                case GAME_MODE.ONE_POINT://------------------------------------------------------------------------------
                    //TO DO dodělat konec hry když jsou body pod 0 + každých 50 kol + 10 bodů
                    if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(document.createElement("div").classList)) {
                        SCORE(--SCORE_DATA.SCORE);
                    }
                    else if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(new Item())) {
                        debugger;
                        SCORE(SCORE_DATA.SCORE += cell.distance + 1);
                    }
                    DIFICULTY.PRICE_FOR_PATH = this.map.item.length == 0 ? DIFICULTY.PRICE_FOR_PATH : this.map.item[0].distance;
                    ROUND(++this.round);
                    this.checkActions();
                    this.checkGoals();
                    break;
                case GAME_MODE.ALL_IN://------------------------------------------------------------------------------
                    //TODO když už nejsou ždáné lahvčky winn projed mapu cyklem a  když zadna nebude obsahovat backggroud img contain bottle je to winn
                    SCORE(--SCORE_DATA.SCORE);
                    ROUND(++this.round);
                    this.checkActions();
                    this.checkGoals();

                    break;
                case GAME_MODE.STORY://------------------------------------------------------------------------------


                    if (SCORE_DATA.SCORE <= 0) {
                        ACHIEVEMENT("Ups hra skončila, došli ti body.", "img/cross.png");
                        NEWS("Gratuluji, celkové skóre je: " + this.getFinalScore());
                        this.gameOver();
                        return;
                    }

                    if (SCORE_DATA.CURE >= 100) {
                        ACHIEVEMENT("Ups hra skončila, lék byl dokončen, a vyrus vyléčen.", "img/cross.png");
                        NEWS("Gratuluji, celkové skóre je: " + this.getFinalScore());
                        this.gameOver();
                        return;
                    }
;
                    if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(document.createElement("div").classList)) {

                        if (SCORE_DATA.MORTALITY > 0) {
                            MORTALITY(--SCORE_DATA.MORTALITY);
                        }
                        SCORE(SCORE_DATA.SCORE -= parseInt(this.round / 10));


                    }
                    else if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(new Item())) {

                        switch (cell.type) {
                            case ITEMTYPE.HUMAN:
                                SCORE_DATA.INFECTED.push({ liveSpan: cell.liveSpan, value: cell.distance });
                                SCORE(SCORE_DATA.SCORE += ((cell.distance + 1) * parseInt(this.round / 10)));
                                INFECTED(SCORE_DATA.INFECTED.length);
                                break;
                            case ITEMTYPE.GROUP:
                                for (let i = 0; i < ITEMTYPE.GROUP_SIZE; i++) {
                                    SCORE_DATA.INFECTED.push({ liveSpan: cell.liveSpan, value: cell.distance });
                                }
                                SCORE(SCORE_DATA.SCORE += ((cell.distance + 1) * parseInt(this.round / 10)) * ITEMTYPE.GROUP_SIZE);
                                INFECTED(SCORE_DATA.INFECTED.length);

                                break;
                            case ITEMTYPE.MORTALITY:
                                MORTALITY(SCORE_DATA.MORTALITY += ITEMTYPE.MORTALITY_VALUE);
                                break;
                            case ITEMTYPE.CURE:
                                CURE(SCORE_DATA.CURE - ITEMTYPE.CURE_VALUE > 0 ? SCORE_DATA.CURE -= ITEMTYPE.CURE_VALUE : 0);
                                break;
                            default:
                                break;
                        }
                    }
                    this.checkInfected()


                    ROUND(++this.round);
                    CURE(++SCORE_DATA.CURE);
                    this.checkActions();
                    this.checkGoals();


                    break;
                default:
                    ACHIEVEMENT("Ups.. Nastala chyba při výberu herního režimu.", "img/cross.png")
                    break;
            }
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
            for (let i = 0; i < SCORE_DATA.INFECTED.length; i++) {
                if (i > length) {
                    break;
                }
                if (RANDOM_NUMBER(0, 100) < SCORE_DATA.INFECTED[i].value) {
                    SCORE_DATA.INFECTED.push({ liveSpan: PEOPLE_INFECTED_DAY, value: SCORE_DATA.INFECTED[i].value });
                    SCORE(SCORE_DATA.SCORE += SCORE_DATA.INFECTED[i].value);
                }
                if (--SCORE_DATA.INFECTED[i].liveSpan < 0) {

                    if (RANDOM_NUMBER(0, 100) < SCORE_DATA.MORTALITY) {
                        DEAD(++SCORE_DATA.DEAD);
                        SCORE(SCORE_DATA.SCORE += ((SCORE_DATA.INFECTED[i].value / 2)) * parseInt(this.round / 10));
                    }
                    else {
                        HEAL(++SCORE_DATA.HEAL);
                        SCORE(SCORE_DATA.SCORE -= (parseInt(SCORE_DATA.INFECTED[i].value) * parseInt(this.round / 10)));
                    }
                    SCORE_DATA.INFECTED.splice(i, 1);
                    i--;
                }
                INFECTED(SCORE_DATA.INFECTED.length);
            }
            LOADING(false);
        }, 100);

    }

    checkGoals() {
        let showOne = false;
        for (let i = 0; i < this.goals.length && !showOne; i++) {
            if (SCORE_DATA.onIndex(this.goals[i].typeOfScore) >= this.goals[i].value && !this.goals[i].show) {
                showOne = true;
                ACHIEVEMENT(this.goals[i].text, this.goals[i].img);
                this.goals[i].show = true;
            }
        }
    }

    //Not WORKING
    getFinalScore() {

        let score = SCORE_DATA.SCORE;
        for (let i = 0; i < SCORE_DATA.INFECTED.length; i++) {
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
        this.goals.push({ typeOfScore: typeOfScore, value: value, text: text, img: img, show: false });
    }

    setArrows() {

        document.onkeydown = function (e) {

            try {
                if (game.started != null) {
                    e = e || window.event;
                    if (e.keyCode == '38') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.TOP, DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE ? true : false);
                        document.getElementById(point.x + ":" + point.y).click();
                        document.getElementById(point.x + ":" + point.y).focus();
                        setTimeout(() => { document.getElementById(point.x + ":" + point.y).blur() }, 250);

                    }
                    else if (e.keyCode == '40') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.BOTTOM, DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE ? true : false);
                        document.getElementById(point.x + ":" + point.y).click();
                        document.getElementById(point.x + ":" + point.y).focus();
                        setTimeout(() => { document.getElementById(point.x + ":" + point.y).blur() }, 250);
                    }
                    else if (e.keyCode == '37') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.LEFT, DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE ? true : false);
                        document.getElementById(point.x + ":" + point.y).click();
                        document.getElementById(point.x + ":" + point.y).focus();
                        setTimeout(() => { document.getElementById(point.x + ":" + point.y).blur() }, 250);
                    }
                    else if (e.keyCode == '39') {
                        let point = game.map.nextInDirection(game.map.player.position, DIRECTION.RIGHT, DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE ? true : false);
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
                        if (document.getElementById("achievementContent") != null) {
                            document.getElementById("achievementContent").click(document.getElementById("achievementContent"));
                        }
                    }
                }
            } catch (error) {

            }
        }
    }

    setShop() {

        ADD_MORTALITY.onclick = function () {
            if (SCORE_DATA.SCORE - 10 >= 0) {
                SCORE(SCORE_DATA.SCORE -= 10);
                MORTALITY(SCORE_DATA.MORTALITY += 5);
            }
            else {
                ACHIEVEMENT("Ups... Bohužel přidání 5% úmrtnosti stojí 10 bodů, a ty nemáš.", "img/exclamation.png")
            }
        }

        ADD_CURE.onclick = function () {
            if (SCORE_DATA.SCORE - 10 >= 0) {
                if (SCORE_DATA.CURE - 5 >= 0) {
                    SCORE(SCORE_DATA.SCORE -= 10);
                    CURE(SCORE_DATA.CURE -= 5);
                }
                else {
                    ACHIEVEMENT("Léčba je tak malá, že není ji možné více snížit.", "img/exclamation.png")
                }
            }
            else {
                ACHIEVEMENT("Ups... Bohužel odebrání 5% léčby stojí 10 bodů, a ty nemáš.", "img/exclamation.png")
            }
        }
    }

    /**
     * 
     * @param {String} name = name of HTMl element 
     */
    flipPlayers(name) {

        if (name == this.secondPlayer.me.getAttribute("name") || name == undefined) {
            let pom = this.player;
            this.player = this.secondPlayer;
            this.secondPlayer = pom;
        }
    }

}


