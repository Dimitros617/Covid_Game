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

        switch (DIFICULTY.GAME_MODE) {
            case GAME_MODE.EDUCATION://------------------------------------------------------------------------------
                this.newRule(TYPE.SCORE, -1, "Zkus jaké je to lehké hrát za virus, když jsou lidé hloupí a neposlouchají", 0, 0, ITEMTYPE.HUMAN, false);
                this.newRule(TYPE.DEAD, 0, null, 3, 0, ITEMTYPE.HUMAN, true);
                this.newRule(TYPE.DEAD, 0, null, 2, 0, ITEMTYPE.GROUP, true);
                this.newRule(TYPE.DEAD, 20, null, 1, 0, ITEMTYPE.HUMAN, true);
                this.newRule(TYPE.DEAD, 20, null, 1, 50, ITEMTYPE.HUMAN, true);
                this.newRule(TYPE.DEAD, 25, null, 1, 100, ITEMTYPE.HUMAN, true);
                this.newRule(TYPE.DEAD, 35, null, 1, 0, ITEMTYPE.GROUP, true);

                this.newRule(TYPE.MORTALITY, -10, null, 3, 0, ITEMTYPE.MORTALITY, true);
                this.newRule(TYPE.MORTALITY, -40, null, 1, 0, ITEMTYPE.MORTALITY, true);
                this.newRule(TYPE.MORTALITY, 50, null, 0, 0, ITEMTYPE.MORTALITY, true);

                this.newRule(TYPE.SCORE, 1, null, 1, 0, ITEMTYPE.CURE, true);


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

                this.newRule(TYPE.CURE, -10, null, 0, 0, ITEMTYPE.CURE, true);
                this.newRule(TYPE.CURE, 30, null, 1, 0, ITEMTYPE.CURE, true);
                this.newRule(TYPE.CURE, 50, null, 3, 0, ITEMTYPE.CURE, true);

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

                if (this.catchItems == undefined) {
                    this.catchItems = [];
                    for (let i = 0; i < ITEMTYPE.length; i++) {
                        for (let j = 0; j < 2; j++) {
                            this.catchItems[ITEMTYPE.onIndex(i) + j] = [];

                        }
                    }
                }

                //Člověk bez roušky
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Nakazil jsi Milana. Pří jízdě v MHD neměl rukavice, dotýkal se madel a když přišel domů, pustil se do jídla bez umytí rukou. Myjte si ruce mýdlem a teplou vodou.", img: "img/handWash.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Vlaďka šla ven bez roušky. Nakažený kolemjdoucí zakašlal, nezakryl si ústa a Vlaďku nakazil. Kašlat a pšíkat je nejbezpečnější do rukávu na předloktí.", img: "img/armhuman.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Po tom co si Pepa podal ruku s nakaženým a poté si neumyl ruce, sám se stal nakažlivým. Místo podání rukou můžete pozdravit slovy nebo zamáváním.", img: "img/hand.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Honza šel na nákup. Cestou v MHD si upravoval brýle, sahal si na obličej a tak se nakazil. Nesahejte si na obličej a používejte dezinfekci, pokud máte možnost i venku.", img: "img/handWash.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Pokud nakažený člověk zakašle a nezakyje si ústa, může nakazit další lidi, až do vzdálenosti 2 metrů.", img: "img/distance.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Maruška byla u babičky na návštěvě. Na rozloučenou dala babičce pusu. Babička se nakazila. Staří lidé se nakazí snadněji. Místo osobní návštěvy, jim raději zavolejte.", img: "img/phone.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Dominik byl venku jen chvíli, a po návratu domů si hned pořádně umyl ruce. Zapoměl však dezinfikovat telefon, na kterém se vir zachytil. Dezinfikujte mobilní telefony, klíče, brýle, klávesnice i myš u počítače.", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Pravidelně větrejte. V uzavřeném a nevětraném prostředí zvyšujete riziko nakažení celé rodiny.", img: "img/home.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Často a důkladně si myjte ruce mýdlem a teplou vodou, po dobu nejméně 30 sekund. Po umytí si ruce důkladně osušte papírovou utěrkou. Nedotýkejte se očí, nosu či úst, pokud nemáte umyté ruce..", img: "img/handWash.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Posilujte imunitní systém kvalitní stravou a dostatečným množstvím vitamínů (zvyšte konzumaci ovoce a zeleniny, případně dodejte vitamín C, D).", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Koronavirus má podobné příznaky jako chřipka nebo jiná respirační viróza, běžná v tomto období. Příznaky jsou: zvýšená teplota až horečka, kašel a dušnost (zadýchávání se).", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Kdyby si Kačka vydenzinfikovala ruce při vstupu do obchodu. Nemusela by teď být nakažená. Pokud máte při vstupu do obchodu možnost využít dezinfekci, použijte ji.", img: "img/handWash.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Čistota půl zdraví. Pravidelně uklízejte především kuchyň a koupelnu běžnými čistícími prostředky.", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "V obchodech nepoužívejte košíky ani vozíky. Nákup ukládejte rovnou do tašek. Pokud to jde, plaťte kartou.", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 0].push({ text: "Roušky jsou vyprodané. Co s tím? Místo roušky můžete ústa i nos zakrýt šátkem či bavlněnou textílií, nebo si roušku vlastnoručně vyrobit. ", img: "img/cureBig.png" });


                //Člověk s rouškou
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Adam měl sice roušku a rukavice, když šel nakoupit, ale pořád si sahal na telefon a upravoval brýle, proto se nakazil. Používejte rukavice, ale ani s nimi se nedotýkejte obličeje a po návratu domů si dezinfikujte telefon.", img: "img/handWash.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Lída si vzala roušku, ale potakala kamarádku a protože ji nerozuměla, tak si ji sundala, kamarádka ji nakazila. Rouška není módní doplňěk nesundavejte si ji.", img: "img/cureBig.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Bára používala dokola tu samou roušku. Například bavlněnou roušku je nutné vydezinfikovat po každém použití. Minimální teplota, která by roušku měla zbavit virů, je 60 °C.", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Ondra si cestou ven nasadil roušku. Rouška mu ale zakrývala jen ústa ale nos ne. Ondra se nakazil protože si roušku správně nenasadil.", img: "img/cureBig.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Honza si před nasazením roušky neumyl ruce. Nakazil se i přesto že měl roušku. Před nasazením vydezinfikované roušky si pečlivě umyjte ruce.", img: "img/handWash.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Lukáš přišel domů, sundal si jednorázovou roušku a položil ji na stůl. Jednorázovou roušku po použití rovnou vyhoďte do odpadkového koše. Je pouze na jedno použití.", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Klára svoji bavlněnou roušku po příchodu z venku nechala válet na zemi. Bavlněnou roušku můžeme desinfikovat. Roušku po sundání rovnou vhoďte do pračky. Perte na 60°C.", img: "img/exclamation.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Abychom si mohli roušku natvarovat přesně podle našeho nosu a tváří, mají v sobě jednorázové roušky drátek. Když do nasazené roušky prudce dýchnu a vzduch nikudy neuniká, mám roušku nasazenou správně.", img: "img/cureBig.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Jsem nakažený a měl bych zůstat doma, ale venku je tak krásně... Vezmu si roušku, to bude v poho. Pokud jste nakažení, zůstaňte doma. Buďte zdopovědní ke svému okolí. ", img: "img/home.png" });
                this.catchItems[ITEMTYPE.HUMAN + 1].push({ text: "Nemůžu najít svojí roušku.. Půjčím si bráchovo. NE! Pokud je vás v domácnosti více, potřebujete každý SVOJI VLASTNÍ roušku, kterou po každém použití dezinfikujete. Perte na 60°C.", img: "img/exclamation.png" });


                //Skupinka lidí
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Pán šel nakoupit. Při čekání ve frontě nedodržoval 2m odstup a protože byl nakažený, nakazil lidi ve frontě. Dodržujte mezi sebou 2m rozestupy.", img: "img/distance.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Maminka poslala syna hrát si ven s kamarády. Jeden z nich byl nakažený a nakazil všechny ostatní. Děti vir přinesly domů a nakazily své rodiče. Pokud to není nutné, zůstaňte doma.", img: "img/home.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Na schůzce si všichni podali ruce. Stačil jeden nakažený člověk, který tak nakazil celou skupinu lidí. Nepodávajte si ruce, a nesahejte si na obličej.", img: "img/hand.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "V tramvaji bylo narváno, ale Honza tak pospíchal, že se tam nacpal. Stačilo, že byl jeden nakažený a nakazil všechny ostatní. Vyhýbejte se místům, kde se shromažďuje větší množství lidí.", img: "img/distance.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Monika se už doma sama nudila a tak si pozvala návštěvu. Její návštěva však byla nakažená, a Monika tak nakazila celou svoji rodinu. Místo osbní návštěvy si raději zavolejte.", img: "img/phone.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Viděla jsem v obchodě pána, jak si holou rukou bez rukavice, dával rohlíky do sáčku. Při manipulaci s nebaleným pečivem používejte jednorázové rukavice, které obchod nabízí. Omezíte tak šíření nákazy.", img: "img/hand.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Napiš mi vlastní nápad a pomoc my hru udělat ještě lepší. mail@dominikfrolik.cz", img: "img/question.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Starší sestra byla po práci unavená, zapoměla si umýt ruce a šla spát, druhý den na to zapoměla, a díky tomu roznesla vir ještě dál.", img: "img/handWash.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Protože starší pán, neměl kdo by mu nakoupil, musel se vydal do krámu sám, a nakazil se hned u vchodu, protože starší lidé se rychleji nakazí. Dodružujte omezení obchodů od 8 do 10 hod. jen pro starší, a pokud můžete zkuste nakoupit staršímu člověku ve svém okolí, pomůžete mu tím.", img: "img/question.png" });
                this.catchItems[ITEMTYPE.GROUP + 0].push({ text: "Pepa si už s přátely myslely, že je to dobré a virus už mezi námi není, vydal se ven bez roušky. Po cestě se nakazil od stejně bezohledných kolemjdoucích, a v parku dostal pokutu 5000Kč. Noste stále ochranu úst a nosu.", img: "img/cureBig.png" });

                break;
            case GAME_MODE.ONE_POINT://------------------------------------------------------------------------------
                this.newGoal(TYPE.SCORE, 50, "Jde ti to dobře, pokračuj dál..", "img/award.png");
                this.newGoal(TYPE.SCORE, 100, "Páni! jsi k nezastavení.", "img/award.png");
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

        if(SCORE_DATA.SCORE < SCORE_DATA_DEFAULT.SCORE){
            SCORE(SCORE_DATA.SCORE = SCORE_DATA_DEFAULT.SCORE);
        }
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
                this.setShop(true);
                this.catchItemsIndex = [];
                for (let i = 0; i < ITEMTYPE.length; i++) {
                    for (let j = 0; j < 2; j++) {
                        let index = this.catchItems[ITEMTYPE.onIndex(i) + j].length;
                        this.catchItemsIndex[ITEMTYPE.onIndex(i) + j] = index == 0 ? null : RANDOM_NUMBER(0, index - 1);
                    }
                }
                break;
            case GAME_MODE.ONE_POINT://------------------------------------------------------------------------------
                window.UI.showPlayerSelect("img/0.1.png", "img/0.2.png", "img/0.3.png", "img/0.4.png", "img/0.5.png", "img/0.6.png", "img/0.7.png");
                this.setShop(false);
                SCORE(SCORE_DATA.SCORE = SCORE_DATA_DEFAULT.SCORE);
                MORTALITY(SCORE_DATA.MORTALITY = SCORE_DATA_DEFAULT.MORTALITY);
                CURE(SCORE_DATA.CURE = SCORE_DATA_DEFAULT.CURE);
                INFECTED((SCORE_DATA.INFECTED = SCORE_DATA_DEFAULT.INFECTED).length);
                DEAD(SCORE_DATA.DEAD = SCORE_DATA_DEFAULT.DEAD);
                HEAL(SCORE_DATA.HEAL = SCORE_DATA_DEFAULT.HEAL);
                DIFICULTY.PRICE_FOR_PATH = this.map.item[0].distance;
                window.copyright = false;
                this.win = false;
                break;
            case GAME_MODE.ALL_IN://------------------------------------------------------------------------------
                window.UI.showPlayerSelect("img/0.1.png", "img/0.2.png", "img/0.3.png", "img/0.4.png", "img/0.5.png", "img/0.6.png", "img/0.7.png");
                this.setShop(false);
                SCORE(SCORE_DATA.SCORE = SCORE_DATA_DEFAULT.SCORE);
                MORTALITY(SCORE_DATA.MORTALITY = SCORE_DATA_DEFAULT.MORTALITY);
                CURE(SCORE_DATA.CURE = SCORE_DATA_DEFAULT.CURE);
                INFECTED((SCORE_DATA.INFECTED = SCORE_DATA_DEFAULT.INFECTED).length);
                DEAD(SCORE_DATA.DEAD = SCORE_DATA_DEFAULT.DEAD);
                HEAL(SCORE_DATA.HEAL = SCORE_DATA_DEFAULT.HEAL);
                DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.NEVER;
                window.copyright = false;
                this.bottleHalf = true;
                this.bottleThree = true;
                break;
            case GAME_MODE.STORY://------------------------------------------------------------------------------
                this.setShop(true);
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
        SCORE_DATA.TOTAL_SCORE = 0;
        window.UI.generateNewMap();
    }

    gameOver() {
        SCORE(0);
        window.UI.scoreBoard[DIFICULTY.GAME_MODE].push(SCORE_DATA.TOTAL_SCORE);
        this.started = null;
        this.map.mainButton.innerHTML = "ZNOVU";
        DIV_INFO.children[0].children[1].disabled = false;
        DIV_INFO.children[0].children[1].style.color = "black";
        DIV_INFO.children[0].onchange({ target: DIV_INFO.children[0] });
    }


    nextRound(notWait) {

        var cell = this.map.checkPlayerPosition();
        if (this.started) {
            switch (DIFICULTY.GAME_MODE) {
                case GAME_MODE.EDUCATION://------------------------------------------------------------------------------


                    SCORE_DATA.TOTAL_SCORE += SCORE_DATA.SCORE;
                    if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(document.createElement("div").classList)) {

                        if (SCORE_DATA.MORTALITY > 0) {
                            MORTALITY(--SCORE_DATA.MORTALITY);
                        }
                        SCORE(--SCORE_DATA.SCORE);
                    }
                    else if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(new Item())) {
                        switch (cell.type) {
                            case ITEMTYPE.HUMAN:
                                SCORE_DATA.INFECTED.push({ liveSpan: cell.liveSpan, value: cell.distance });

                                SCORE(SCORE_DATA.SCORE += (cell.distance + 1));
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
                            case ITEMTYPE.CURE:
                                CURE(SCORE_DATA.CURE - ITEMTYPE.CURE_VALUE > 0 ? SCORE_DATA.CURE -= ITEMTYPE.CURE_VALUE : 0);
                                break;
                            default:
                                break;
                        }
                        let msg = this.checkEduGoals(cell);
                        if (msg != undefined)
                            ACHIEVEMENT(msg.text, msg.img);
                    }

                    this.checkInfected()
                    ROUND(++this.round);
                    CURE(++SCORE_DATA.CURE);
                    this.checkActions();


                    if (SCORE_DATA.SCORE <= 0) {
                        ACHIEVEMENT("Ups hra skončila, došli ti body.", "img/cross.png");
                        NEWS("Gratuluji, celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.gameOver();
                        return;
                    }

                    if (SCORE_DATA.CURE >= 100) {
                        ACHIEVEMENT("Ups hra skončila, lék byl dokončen, a vyrus vyléčen.", "img/cross.png");
                        NEWS("Gratuluji, celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.gameOver();
                        return;
                    }

                    break;
                case GAME_MODE.ONE_POINT://------------------------------------------------------------------------------
                    //TO DO dodělat konec hry když jsou body pod 0 + každých 50 kol + 10 bodů
                    if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(document.createElement("div").classList)) {
                        SCORE(--SCORE_DATA.SCORE);
                    }
                    else if (Object.getPrototypeOf(cell) === Object.getPrototypeOf(new Item())) {
                        SCORE(SCORE_DATA.SCORE += cell.distance + 1);
                        CURE(SCORE_DATA.CURE += RANDOM_NUMBER(1, 5));
                    }
                    if (SCORE_DATA.SCORE <= 0) {
                        ACHIEVEMENT("Bohužel došli ti body, ale zkus to znovu, určitě budeš lepší. Celkové skore je: " + SCORE_DATA.TOTAL_SCORE, "img/cross.png");
                        NEWS("Celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.gameOver();
                        return;
                    }
                    if (SCORE_DATA.CURE >= 100 && !this.win) {
                        ACHIEVEMENT("VÝHRA, dosáhl jsi 100% léčby a všechny si vyléčil. Celkové skore je: " + SCORE_DATA.TOTAL_SCORE + " jestli cheš můžeš pokračovat.", "img/cross.png");
                        NEWS("Celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.win = true;
                        this.map.mainButton.innerHTML = "UKONČIT"
                    }
                    if (this.win && !notWait) {
                        ACHIEVEMENT("Wow Vyhrál si s celkovým skore: " + SCORE_DATA.TOTAL_SCORE, "img/cross.png");
                        NEWS("Celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.win = false;
                        this.gameOver();
                        return;
                    }


                    SCORE_DATA.TOTAL_SCORE += SCORE_DATA.SCORE;
                    ROUND(++this.round);
                    this.checkActions();
                    this.checkGoals();
                    break;
                case GAME_MODE.ALL_IN://------------------------------------------------------------------------------
                    //TODO když už nejsou ždáné lahvčky winn projed mapu cyklem a  když zadna nebude obsahovat backggroud img contain bottle je to winn

                    let countBottles = document.getElementsByClassName("bottle").length;
                    let allBottles = this.map.allValidPosition.length;

                    if (countBottles <= (allBottles / 2) && this.bottleHalf) {
                        ACHIEVEMENT("Už zbývá jen půlka. Jen tak dál", "img/award.png");
                        this.bottleHalf = false;
                    }
                    if (countBottles <= (3) && this.bottleThree) {
                        ACHIEVEMENT("Jsi jen kousek od výtězstvý, držím ti palce", "img/award.png");
                        this.bottleThree = false;
                    }
                    if (countBottles == 0) {
                        ACHIEVEMENT("Gratuluji VYHRÁL si celkové skore je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE), "img/winner.gif");
                        NEWS("Celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.gameOver();
                        return;
                    }
                    if (SCORE_DATA.SCORE <= 0) {
                        ACHIEVEMENT("Bohužel došli ti body, ale zkus to znovu, určitě budeš lepší. Celkové skore je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE), "img/cross.png");
                        NEWS("Celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.gameOver();
                        return;
                    }

                    SCORE_DATA.TOTAL_SCORE += SCORE_DATA.SCORE;
                    SCORE(--SCORE_DATA.SCORE);
                    ROUND(++this.round);
                    this.checkActions();
                    this.checkGoals();

                    break;
                case GAME_MODE.STORY://------------------------------------------------------------------------------


                    SCORE_DATA.TOTAL_SCORE += SCORE_DATA.SCORE;
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

                    if (SCORE_DATA.SCORE <= 0) {
                        ACHIEVEMENT("Ups hra skončila, došli ti body.", "img/cross.png");
                        NEWS("Gratuluji, celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.gameOver();
                        return;
                    }

                    if (SCORE_DATA.CURE >= 100) {
                        ACHIEVEMENT("Ups hra skončila, lék byl dokončen, a vyrus vyléčen.", "img/cross.png");
                        NEWS("Gratuluji, celkové skóre je: " + Intl.NumberFormat().format(SCORE_DATA.TOTAL_SCORE));
                        this.gameOver();
                        return;
                    }

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

        SCORE(SCORE_DATA.SCORE = parseInt(SCORE_DATA.SCORE));
        SCORE_DATA.TOTAL_SCORE = parseInt(SCORE_DATA.TOTAL_SCORE);

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
                if (RANDOM_NUMBER(0, 100) < SCORE_DATA.INFECTED[i].value * (DIFICULTY.GAME_MODE == GAME_MODE.EDUCATION ? 1.5 : 1)) {
                    SCORE_DATA.INFECTED.push({ liveSpan: PEOPLE_INFECTED_DAY, value: SCORE_DATA.INFECTED[i].value });
                    SCORE(SCORE_DATA.SCORE += SCORE_DATA.INFECTED[i].value * (DIFICULTY.GAME_MODE == GAME_MODE.EDUCATION ? 1 : parseInt(this.round / 10)));
                }
                if (--SCORE_DATA.INFECTED[i].liveSpan < 0) {

                    if (RANDOM_NUMBER(0, 100) < SCORE_DATA.MORTALITY) {
                        DEAD(++SCORE_DATA.DEAD);
                        SCORE(SCORE_DATA.SCORE += (parseInt(SCORE_DATA.INFECTED[i].value / 2)) * (DIFICULTY.GAME_MODE == GAME_MODE.EDUCATION ? 1 : parseInt(this.round / 10)));
                    }
                    else {
                        HEAL(++SCORE_DATA.HEAL);
                        SCORE(SCORE_DATA.SCORE -= (parseInt(SCORE_DATA.INFECTED[i].value) * (DIFICULTY.GAME_MODE == GAME_MODE.EDUCATION ? 1 : parseInt(this.round / 10))));
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

    checkEduGoals(item) {
        //tipeOfScore = tipeOfItem pro edu goaly
        let story = this.catchItems[item.type + item.dificulty][(this.catchItemsIndex[item.type + item.dificulty] += 1) % this.catchItems[item.type + item.dificulty].length]
        return story;
    }

    newRule(typeOfScore, value, news, itemCount, chance, type, repeat) {
        this.actions.push(new Action(typeOfScore, value, news, itemCount, chance, type, repeat));
    }

    newGoal(typeOfScore, value, text, img) {
        this.goals.push({ typeOfScore: typeOfScore, value: value, text: text, img: img, show: false });
    }

    setArrows() {

        document.onkeydown = function (e) {

            //Try je zde pro to, že pokud uživatel klikne na šipku směrem do zdi, vrací se null, což způsobuje crash,ovšem logice to nevadí
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
            } catch (error) { }
        }
    }

    setShop(bool) {

        if (bool) {
            ADD_MORTALITY.style.display = "contents";
            ADD_CURE.style.display = "contents";

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
        else {
            ADD_MORTALITY.style.display = "none";
            ADD_CURE.style.display = "none";
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


