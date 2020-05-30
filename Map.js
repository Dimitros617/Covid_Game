/**
 * @description vytváří fyzicky i graficky mapu dle velikosti a obtížnosti definovanou uživatelem, zkontrolovanou validací, aby měla dostatek herních polí a byla k dyspozici, 
 */
class Map {

    map; //table object s mapou
    player;// Object Player
    item; // Pole objektů itemů aktuálně vykreslených v mapě

    validPosition; // Pole pointů, všech validních pozic, z aktuální pozice daného hráče
    allValidPosition; // Pole pointů Všechny validní pozice na které se jde dostat v mapě

    size; // INT Velikost mapy pole v tabulce 
    pxSizeCell; // Velikost buňky v px podle obrazovky uživatele

    err; // Bool hodnota err = true, v případě že mapa neprošla validací
    cellColor; // Barva bu'nky

    mainButton; // Pointer na main button 

    /**
     * @description Založení instance mapy
     * @param {Int} size //Kolik rárků a sloupců má mapa obsahovat
     */
    constructor(size) {

        this.size = size;
        let table_size = MAP_TABLE.offsetWidth < MAP_TABLE.offsetHeight ? MAP_TABLE.offsetWidth : MAP_TABLE.offsetHeight;
        this.pxSizeCell = table_size / this.size;
        this.validPosition = [];
        this.allValidPosition = [];
        this.item = [];
        this.lastItemCount = [];
        this.cellColor = "#efefef";
        this.itemWasOnPosition = false;

        //Vytvoření nové intance hráče
        this.player = new Player(this, "player1");
        MAP_TABLE.style.height = "";
        //Vytvoření a vykreslení mapy
        this.createMap();
        MAP_TABLE.style.height = "-webkit-fill-available";

    }

    /**
     * @description Vytvoření celé mapy, všetně grafického rozhraní, a následná validace a vykreslení do HTML instance mapy se uloží do glob. prom. this.map
     */
    createMap() {

        //nastavení chyby generování mapy na false (Žádná chyba)
        this.err = false;
        //Vytvoření objektu table
        this.map = document.createElement("table");
        //Nastavení atributu id mapy
        this.map.setAttribute("id", "mapTable");

        //Pro velikost mapy vytvoříme tolik řádků
        for (var x = 0; x < this.size; x++) {
            //Vytvoření objektu řádky
            let row = document.createElement("tr");
            //Pro velikost mapy, vytvoříme počet buňěk do řádku 
            for (var y = 0; y < this.size; y++) {

                //Vytvoříme buňku
                let cell = document.createElement("td");

                //Nastavení evemtu při kliknutí na buňku
                cell.onclick = function (e) {
                    //pokud stav hry není null (tedy game Over)
                    if (game.started != null) {
                        //Point na který se kliknulo
                        let point = new Point(parseInt(e.target.id.split(":")[0]), parseInt(e.target.id.split(":")[1]));
                        //Pokud je to validní pozice na kterou hráč může (max 3 pointy z jeho pozice)
                        if (window.game.map.indexOfPoint(game.map.validPosition, point) != null) {
                            //Smaže označní cesty mezi aktuální a novou právě kliknutou pozicí (point)
                            //window.game.map.drawPointToPoint(window.game.map.player.position, point,"path",false);
                            //Posunu hráče na danou pozici, a znovu vykreslím kam může z nové pozice
                            window.game.map.player.moveTo(point);
                            //Předám hře nové kolo
                            window.game.nextRound(true);
                            //Z dané pozice kde hráč byl vymažu class valid (Aktuální jen před zahájením hry, šedivé pozice)
                            e.target.parentNode.classList.remove("valid");
                            e.target.parentNode.classList.remove("validLast");
                            e.target.parentNode.classList.remove("cross");
                            e.target.parentNode.classList.remove("crossLast");
                        }
                    }
                }

                //Funkce volána při double kliknu na jakoukoliv pozici na mapě, vykreslí cestu, nebo ji smaže od pozice hráče k danému místu na mapě, pokud je na něm libovolný item
                cell.ondblclick = function (e) {
                    //vytvoření instance třídy Point obsahující X a Y právě kliknuté buňky 
                    let point = new Point(parseInt(e.target.id.split(":")[0]), parseInt(e.target.id.split(":")[1]));
                    //Inicializace pole pro všechny itemy aktuálně vykreslené v mapě
                    let itemsPoints = [];
                    //Pro všechny itemy v mapě
                    for (let x of game.map.item) {
                        //Naplnění pole stávajícími itemamy.
                        itemsPoints.push(x.position);
                    }

                    //Index do pole itemů na kterém se nachází kluknutý item pokud existuje
                    let indexOfItem = window.game.map.indexOfPoint(itemsPoints, point);

                    //Zjistění zda se na kliknuté pozici nachází item
                    if (game.map.isItemOnPoint(point)) {
                        //Zjistím zda již k itemu je vykreslená cesta pokud ano ...
                        if (game.map.item[indexOfItem].drawPath) {
                            //Vynuluji vykreslení cesty
                            game.map.item[indexOfItem].drawPath = false;
                            //Graficky cestu vymažu
                            game.map.clear();
                        }
                        //pokud ne...
                        else {
                            //Pokud je dostatek bodů na zaplacení zobrazení cesty.
                            if (SCORE_DATA.SCORE - DIFICULTY.PRICE_FOR_PATH > 0) {
                                //Pokud se nejedná o item v Multiplayeru
                                if (game.map.item[indexOfItem].validNeighbour == undefined) {
                                    //Nastavím itemu že jsem mu vekreslil cestu
                                    game.map.item[indexOfItem].drawPath = true;
                                    //Vytvoření nového pointu z pozice hráče, aby nedošlo k předání poiteru na instanci Pointu, který by se jinak změnil
                                    let position = new Point(window.game.map.player.position.x, window.game.map.player.position.y);
                                    //Vykreslím cestu k itemu
                                    window.game.map.shortestWay(position, point, RETURN.DRAW);
                                    //Odečtu body (Zaplatím)
                                    SCORE(SCORE_DATA.SCORE -= DIFICULTY.PRICE_FOR_PATH);
                                }
                                //Pokud se jedná o item schopný dosáhnout pouze v Multiplayeruˇvykreslí se cesta k jeho dosažitelnému sousedovy
                                else {
                                    //Výpis varování o nedosažitelnosti pro algoritmus
                                    ACHIEVEMENT("Tento bod je na mě moc těžký, ale ukážu ti cestu, alespoň jednoho hráče.", "img/question.png");
                                    //Nastavení vykreslení cesty
                                    game.map.item[indexOfItem].drawPath = true;
                                    //Vytvoření nového pointu z pozice hráče, aby nedošlo k předání poiteru na instanci Pointu, který by se jinak změnil
                                    let position = new Point(window.game.map.player.position.x, window.game.map.player.position.y);
                                    //grafické vykreslení cesty
                                    window.game.map.shortestWay(position, game.map.item[indexOfItem].validNeighbour, RETURN.DRAW);
                                    //Odečtení bodů
                                    SCORE(SCORE_DATA.SCORE -= DIFICULTY.PRICE_FOR_PATH);
                                }
                            }
                            //Pokud hráš nemá na zaplacení cesty
                            else {
                                ACHIEVEMENT("Na to bohužel nemáš dostatek bodů, ukázka cesty stojí " + (DIFICULTY.PRICE_FOR_PATH) + " bodů.", "img/exclamation.png");
                            }
                        }
                    }


                }

                //vytvoření divu, kterím se naplní buňka
                var cont = document.createElement("div");
                //nastavení atribudu ID obsahující pozici v mapě X:Y
                cont.setAttribute("id", y + ":" + x);
                //Nastavení konstantních rozměrů buňky
                cont.style.width = this.pxSizeCell;
                cont.style.height = this.pxSizeCell;
                //Vložení do buňky
                cell.appendChild(cont);
                //Vložení Buňky do řádky 
                row.appendChild(cell);
            }
            //Vložení řádky do tabulky
            this.map.appendChild(row);
        }


        //Vygenerování seedu pro nastavení zdí
        let seed = this.generateSeed();

        //--  napozicování main Buttonu
        let button = document.createElement("button");
        button.setAttribute("class", "mainButton");
        button.innerHTML = "START";

        //Při kliknutí na main button ve středu 
        button.onclick = function (x) {
            //Pokud je hra není nastartována nebo není v režimu reset
            if (window.game.started == false && window.game.started != null) {
                //Startnu hru
                game.start();
                //Změním text tlařítka 
                x.target.innerHTML = "POČKAT";
                //Změním velikost textu tlačítka
                x.target.style.fontSize = "x-small";
            }
            //Pokud hra běží a není v reset modu 
            else if (window.game.started == true && window.game.started != null) {
                //Zavolám další kolo hry
                game.nextRound(false);
                //změním focus na hráče, zabranuje grafickému budu pro zaseknutí animace pořád zmáčklého tlačítka při použití klávesy místo kliknutí myši
                game.map.player.me.focus();
                //Nastavím spoždění pro animci bluru
                setTimeout(() => { game.map.player.me.blur() }, 250);
            }
            else {
                game.reStart();
            }
            x.target.blur();
        }
        this.mainButton = button;
        this.map.rows[this.size / 2 - 1].cells[this.size / 2 - 1].children[0].appendChild(button);

        //-- nastavení vnějšího ohraničení okolo startu

        this.setWall(this.map.rows[this.size / 2].cells[this.size / 2], 1);
        this.setWall(this.map.rows[this.size / 2].cells[this.size / 2], 2);

        this.setWall(this.map.rows[this.size / 2 - 1].cells[this.size / 2], 0);
        this.setWall(this.map.rows[this.size / 2 - 1].cells[this.size / 2], 1);

        this.setWall(this.map.rows[this.size / 2].cells[this.size / 2 - 1], 2);
        this.setWall(this.map.rows[this.size / 2].cells[this.size / 2 - 1], 3);

        this.setWall(this.map.rows[this.size / 2 - 1].cells[this.size / 2 - 1], 0);
        this.setWall(this.map.rows[this.size / 2 - 1].cells[this.size / 2 - 1], 3);

        this.map.rows[this.size / 2].cells[this.size / 2].setAttribute("id", "centerCell");
        this.map.rows[this.size / 2 - 1].cells[this.size / 2].setAttribute("id", "centerCell");
        this.map.rows[this.size / 2].cells[this.size / 2 - 1].setAttribute("id", "centerCell");
        this.map.rows[this.size / 2 - 1].cells[this.size / 2 - 1].setAttribute("id", "centerCell");

        //-- vykreslení náhodně vygenerovaných zdí do mapy
        for (let i = 0; i < seed.length; i++) {

            let x = i == 0 || i == 3 ? 0 : this.size - 1;
            let y = i == 0 || i == 1 ? 0 : this.size - 1;

            //-- add je posun seedu do kvadrantu + zajištění prolnutí sloupců a řádků L-wall
            let addX = i == 0 ? 1 : i == 1 ? this.size / 2 + 1 : i == 3 ? this.size / 2 + 2 : 0;
            let addY = i == 0 ? 0 : i == 1 ? 2 : i == 2 ? this.size / 2 + 1 : this.size / 2 + 1;


            this.setWall(this.map.rows[y].cells[seed[i][0] + addX - 2], 1);
            this.setWall(this.map.rows[seed[i][1] + addY - 2].cells[x], 2);

            for (let j = 2; j < seed[i].length; j++) {

                //-- Vygenerování náhodného směru zdi v poli mapy / pouze vnitřní L-wall
                let int = RANDOM_NUMBER(0, 3);
                this.setWall(this.map.rows[seed[i][j].x + addX].cells[seed[i][j].y + addY], int)
                this.setWall(this.map.rows[seed[i][j].x + addX].cells[seed[i][j].y + addY], int + 1)

            }
        }

        //Vygenerována mapa se zvaliduje zda má dostatek validních pozic pro hraní
        this.validMap();

        //Pokud je mapa vygenerovaná dobře vykreslí se do HTML pokud ne rekurzivně se generuje mapa nová
        if (!this.err && MAP_TABLE.children.length == 1) {
            MAP_TABLE.appendChild(this.map);
            //buttonText.style.marginLeft = (buttonText.getBoundingClientRect().width / 2) * -1;
        }
        else
            this.createMap();




    }

    /**
     * @description Mapa se rozdělí do 4 kvadrantů tedy na 4 části poté se zjistí zda je v každém kvadrantu alespoň 5 validních pozic na které se dá dostat, pokud ne nastaví se globalní proměná err na true jinak je false
     */
    validMap() {
        let possibleIndex = this.validIndex(null, 50, 40, TYPE.ALL);
        if (possibleIndex == null) {
            this.err = true;
            return;
        }

        let qadrant = [0, 0, 0, 0];
        for (let i = 0; i < possibleIndex.length; i++) {

            if (possibleIndex[i].x < this.size / 2)
                if (possibleIndex[i].y < this.size / 2)
                    qadrant[0]++;
                else
                    qadrant[3]++;
            else
                if (possibleIndex[i].y < this.size / 2)
                    qadrant[1]++;
                else
                    qadrant[2]++;

        }
        this.err = qadrant[0] > 4 && qadrant[1] > 4 && qadrant[2] > 4 && qadrant[3] > 4 ? false : true;
        if (!this.err)
            this.allValidPosition = possibleIndex;
    }

    /**
     * @description  Metroda nastaví zdi do mapy dle vygenerovaného seedu
     * @param {Element} cell //Td object
     * @param {Int} direction //Směr 0 Top -> až 3 ve směru hodinových ručiček
     */
    setWall(cell, direction) {

        let y = cell.parentNode.rowIndex;
        let x = cell.cellIndex;

        //V případě chyby se nastaví globální chyba při generování mapy
        try {
            //Podle směru se nastaví ohraničení Buňky na dané straně a sousední buňce se zdí se nastaví také Obraničení 
            switch (direction % 4) {
                case 0:
                    cell.style.borderTop = "2px solid black";
                    this.map.rows[y - 1].cells[x].style.borderBottom = "2px solid black";
                    break;
                case 1:
                    cell.style.borderRight = "2px solid black";
                    this.map.rows[y].cells[x + 1].style.borderLeft = "2px solid black";
                    break;
                case 2:
                    cell.style.borderBottom = "2px solid black";
                    this.map.rows[y + 1].cells[x].style.borderTop = "2px solid black";
                    break;
                case 3:
                    cell.style.borderLeft = "2px solid black";
                    this.map.rows[y].cells[x - 1].style.borderRight = "2px solid black";
                    break;

                default:
                    cell.style.border = "2px solid black";
                    break;
            }
        } catch (error) {
            this.err = true;
        }
    }

    /**
     * @description Metoda vygeneruje seed pro velikost dané mapy, podle kterého se poté do mapy vygenerují zdi a překážky v mapě
     * @returns {Array}  pole obashující 4 pole obsahující pozice (Pointy) na kterých se mají vygenerovat zdi 
     */
    generateSeed() {

        let seed = [];

        for (let i = 0; i < 4; i++) {

            let qadrant = [RANDOM_NUMBER(2, this.size / 2 - 2), RANDOM_NUMBER(2, this.size / 2 - 2)]
            let tempX = this.shuffleArray(i % 2 == 0 ? true : false);
            let tempY = this.shuffleArray(i % 2 == 0 ? true : false);
            for (let j = 0; j < tempX.length; j++)
                qadrant.push(new Point(tempX[j], tempY[j]));
            seed.push(qadrant);
        }

        let temp = seed[3];
        seed[3] = seed[1];
        seed[1] = temp;
        return seed;
    }

    /**
     * @description Metoda zjistí podle přijatého pointu a směru kam se může jít a vrací poslední point v daném směru
     * @param {Point} point 
     * @param {Int} direction 
     * @param {Boolean} player if true chci zahrnout i hráče jako zarážku
     * 
     * @returns {Point} vrací point v daném směru který je poslední pokud je v daném směru rovnou zeď a posun není vrací null 
     */
    nextInDirection(point, direction, player) {

        var cell;
        let addX = 0;
        let addY = 0;
        let free = true;
        let lastBottle = false;

        do {
            cell = this.map.rows[point.y + addY].cells[point.x + addX];
            if (cell == undefined) {

                let a = this.map;
                let b = a.rows[point.y + addY];
                let c = b.cells[point.x + addX];
                cell = c;

            }
            if (free && DIFICULTY.GAME_MODE == GAME_MODE.ALL_IN) {
                if (this.map.rows[point.y + addY].cells[point.x + addX].classList.contains("bottle")) {
                    lastBottle = this.map.rows[point.y + addY].cells[point.x + addX];
                }
                else {
                    lastBottle = false;
                }
            }
            this.map.rows[point.y + addY].cells[point.x + addX].classList.remove("bottle");
            this.map.rows[point.y + addY].cells[point.x + addX].style.backgroundImage = "";

            switch (direction % 4) {
                case 0:
                    free = cell.style.borderTop == "" ? true : false;
                    if (player == true)
                        free = window.game.secondPlayer != undefined ? window.game.secondPlayer.position.x == point.x + addX && window.game.secondPlayer.position.y == point.y + (addY - 1) ? false : free : free;
                    free = point.y + addY - 1 == -1 ? free ? false : true : free;
                    addY--;
                    break;
                case 1:
                    free = cell.style.borderRight == "" ? true : false;
                    if (player == true)
                        free = window.game.secondPlayer != undefined ? window.game.secondPlayer.position.x == point.x + (addX + 1) && window.game.secondPlayer.position.y == point.y + addY ? false : free : free;
                    free = point.x + addX + 1 == this.size ? free ? false : true : free;
                    addX++;
                    break;
                case 2:
                    free = cell.style.borderBottom == "" ? true : false;
                    if (player == true)
                        free = window.game.secondPlayer != undefined ? window.game.secondPlayer.position.x == point.x + addX && window.game.secondPlayer.position.y == point.y + (addY + 1) ? false : free : free;
                    free = point.y + addY + 1 == this.size ? free ? false : true : free;
                    addY++;
                    break;
                case 3:
                    free = cell.style.borderLeft == "" ? true : false;
                    if (player == true)
                        free = window.game.secondPlayer != undefined ? window.game.secondPlayer.position.x == point.x + (addX - 1) && window.game.secondPlayer.position.y == point.y + addY ? false : free : free;
                    free = point.x + addX - 1 == -1 ? free ? false : true : free;
                    addX--;
                    break;

                default:
                    cell.style.border = "1px solid black";
                    break;
            }

            if (!free && DIFICULTY.GAME_MODE == GAME_MODE.ALL_IN) {
                if (lastBottle != false) {
                    lastBottle.classList.add("bottle");
                }
            }

            //this.player.moveTo(new Point(point.x + addX, point.y + addY));
        } while (free);

        addX = addX == 0 ? 0 : addX < 0 ? ++addX : --addX;
        addY = addY == 0 ? 0 : addY < 0 ? ++addY : --addY;
        return addX == 0 && addY == 0 ? null : new Point(point.x + addX, point.y + addY);

    }


    /**
     * @description Metoda slouží ke grafickému vykreslení validních pozic z dané pozice (point) a následné se tyto pozice uloží do globálního pole validPosition
     * @param {Point} point 
     */
    setAvailableDirection(point) {

        for (let i = 0; i < this.validPosition.length; i++) {
            this.map.rows[this.validPosition[i].y].cells[this.validPosition[i].x].classList.remove("cell");
            this.map.rows[this.validPosition[i].y].cells[this.validPosition[i].x].removeAttribute("cell-title");
        }

        this.validPosition = [];
        for (let i = 0; i < 4; i++) {
            let newPoint = this.nextInDirection(point, i, DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE ? true : false);
            if (newPoint == null)
                continue;
            let cell = this.map.rows[newPoint.y].cells[newPoint.x];
            cell.classList.add("cell");
            cell.setAttribute("cell-title", "Cena: " + (DIFICULTY.GAME_MODE == GAME_MODE.STORY ? (parseInt(window.game.round / 10) + 1) : 1) + " " + CZ_STRING((DIFICULTY.GAME_MODE == GAME_MODE.STORY ? (parseInt(window.game.round / 10) + 1) : 1), "bod"))
            if (cell.classList.contains("bottle")) {
                cell.classList.remove("bottle");
                SCORE(++SCORE_DATA.SCORE);
            }

            this.validPosition.push(newPoint);
        }
    }


    /**
     * 
     * @param {Point} point = startovní pozice odkud budu validovat pozice
     * @param {int} distance = V jaké vzdáleosti od pointu budu hledat validní indexy
     * @param {int} count = Kolik validních indexů, minimálně požaduji
     * @param {TYPE} type = Enum TYPE zda požaduji všechny validní indexy, poslední v dané vzálenosti, nebo Náhodný
     * 
     * @returns = Vrací null v případě že nelze dojít ze všech rohů, do všech ostatních, nebo nebyl nalezen validní index v požadované vzdálenosti, či jich nebylo dostatek.
     *                  V opačném případě vrátí na TYPE.ALL - Všechny validní indexy v dané vzdálenosti s minniáním počtem od bodu který specifikujeme.blob
     *                                             TYPE.LAST - njevzdálenejší point od bodu point s danou vzdáleností.
     *                                             TYPE.RAND - Náhodný bod v dané vzdálenosti od pointu.
     */
    validIndex(point, distance, count, type) {

        if (this.allValidPosition.lenght != 0) {
            if (this.indexOfPoint(this.allValidPosition, point) == null) {
                console.log("Fale save activated");
                point = this.allValidPosition[RANDOM_NUMBER(0, this.allValidPosition.lenght - 1)];
            }
        }

        let all = point == null ? true : false;
        // Validace rohů, zda jse dá ze všech rohů, dostat do všech ostatních rohů.


        let result = [];
        let arr = [new Point(0, 0), new Point(0, this.size - 1), new Point(this.size - 1, 0), new Point(this.size - 1, this.size - 1)];
        let arrTemp = [];
        let arrLast = [];

        if (all) {

            let length = arr.length;
            for (let i = 0; i < length; i++) {
                let thisCorner = arr[i];
                arrTemp = [arr[i]];
                let arrAll = [];
                let possible = false;
                while (arrTemp.length != 0 && !possible) {
                    let length = arrTemp.length;
                    for (let j = 0; j < length; j++) {

                        let p = arrTemp.pop();
                        for (let k = 0; k < 4; k++) {

                            let np = this.nextInDirection(p, k);
                            if (np != null && this.indexOfPoint(arrAll, np) == null) {

                                for (let l = 0; l < arr.length; l++)
                                    if (np.x == arr[l].x & np.y == arr[l].y & np.x != thisCorner.x & np.y != thisCorner.y)
                                        possible = true;

                                arrTemp.unshift(np);
                                arrAll.unshift(np);

                            }
                            else if (np != null && this.indexOfPoint(arrAll, np) != null && this.indexOfPoint(arr, np) != null) {

                                for (let l = 0; l < arr.length; l++)
                                    if (np.x == arr[l].x & np.y == arr[l].y & np.x != thisCorner.x & np.y != thisCorner.y)
                                        possible = true;

                            }
                        }
                    }
                }

                if (possible)
                    result.push(true);
            }

            if (result.length != arr.length)
                return null;
        }


        // Nalezení všech možných bodů, kterých lze dosáhnout  z bodu 0, 0

        if (point == null)
            point = new Point(0, 0);

        arr = [];
        arrTemp = [point];
        arrLast = [];


        for (let i = 0; i < distance; i++) {

            let length = arrTemp.length;
            for (let j = 0; j < length; j++) {

                let p = arrTemp.pop();
                for (let k = 0; k < 4; k++) {

                    let np = this.nextInDirection(p, k);
                    if (np != null && this.indexOfPoint(arr, np) == null) {

                        switch (k) {
                            case 0:
                                np.setNeighbour(np.x, np.y + 1);
                                break;
                            case 1:
                                np.setNeighbour(np.x - 1, np.y);
                                break;
                            case 2:
                                np.setNeighbour(np.x, np.y - 1);
                                break;
                            case 3:
                                np.setNeighbour(np.x + 1, np.y);
                                break;
                            default:
                                break;
                        }
                        arr.push(np);
                        arrTemp.unshift(np);
                        if (i == distance - 1)
                            arrLast.push(np);
                    }
                }
            }
        }


        // Validace všech možných bodů z předchozího kroku, lze jde dojít zpět do bodu 0, 0
        result = [];
        length = type == 0 || type == 2 ? arr.length : arrLast.length;

        for (let i = 0; i < length; i++) {

            arrTemp = [type == 0 || type == 2 ? arr[i] : arrLast[i]];
            let arrAll = [];
            let possible = false;
            while (arrTemp.length != 0 && !possible) {
                let length = arrTemp.length;
                for (let j = 0; j < length; j++) {

                    let p = arrTemp.pop();
                    for (let k = 0; k < 4; k++) {

                        let np = this.nextInDirection(p, k);
                        if (np != null && this.indexOfPoint(arrAll, np) == null) {

                            if (np.x == point.x && np.y == point.y)
                                possible = true;

                            arrTemp.unshift(np);
                            arrAll.unshift(np);

                        }
                    }
                }
            }

            if (possible)
                result.push(type == 0 || type == 2 ? arr[i] : arrLast[i]);
        }


        if ((result.length == 0) | (all && result.length < count))
            return null;



        switch (type) {
            case TYPE.ALL:
                return result;
            case TYPE.LAST:
                return result;
            case TYPE.RAND:
                let point = result.pop();
                return RANDOM_NUMBER(0, 1) == 0 && point.validNeighbour != undefined ? point.validNeighbour : point;
            default:
                return null;
        }
    }

    /**
     * @description Metoda slouží jako roscestník pro nalezení nejkratší cesty point to point podle parametru ret se volá pouze BFS algoritmus, nebo Backtracking 
     * 
     * @param {Point} startPoint pozice odkud chceme cestu hledat
     * @param {Point} endPoint pozice kam se chceme dostat
     * @param {Enum} ret Enumem definované zda chceme vrátit pouce Číslo vzdálenost k bodul, nebo vrací celou cestu 
     */
    shortestWay(startPoint, endPoint, ret) {

        let solution = [];
        this.shortestWaySolution = null;
        this.count = 0;
        let limit = this.shortestWayCount(startPoint, endPoint);
        if (ret == RETURN.COUNT)
            return limit;

        //Zobrazím loading
        LOADING(true, "Hledám nejkratší cestu ...");
        //spustím asynchroní prohledávání mapou pro nejkratší vzdálenost, kvuly načítání loadingu se spožděním 100 ms
        setTimeout((startPoint, endPoint, solution, limit, ret) => {

            var t0 = performance.now();
            this.shortestWayPath(startPoint, endPoint, solution, 0, limit);
            var t1 = performance.now()
            console.log("Prošlých možností: " + this.count + " Celkový čas: " + (t1 - t0) / 1000 + "s ");
            this.shortestWaySolution.push(endPoint);
            LOADING(false);
            if (ret == RETURN.DRAW) {
                this.drawPath(this.shortestWaySolution);
            }


        }, 50, startPoint, endPoint, solution, limit, ret);





    }

    /**
     * @description Algoritmus (BFS) Prohledávání do šířky pro nalezení nejkratší vzdálenosti ovšem pouze int hodnota.
     * @param {Point} startPoint 
     * @param {Point} endPoint 
     */
    shortestWayCount(startPoint, endPoint) {

        let arrTemp = [startPoint];
        let arrAll = [];
        let result = 0;
        while (arrTemp.length != 0) {
            let length = arrTemp.length;
            for (let j = 0; j < length; j++) {

                let p = arrTemp.pop();
                for (let k = 0; k < 4; k++) {

                    let np = this.nextInDirection(p, k);
                    if (np != null && this.indexOfPoint(arrAll, np) == null) {

                        if (np.x == endPoint.x && np.y == endPoint.y)
                            return (result + 1);

                        arrTemp.unshift(np);
                        arrAll.unshift(np);

                    }
                }
            }
            result++
        }

        return null;
    }


    /**
     * @description Metoda najde nejkratší cestu z bodu startPoint do bodu endPoint a tu vykreslí, Algortimus BackTracking - rekurzivní
     * @param {Point} startPoint 
     * @param {Point} endPoint 
     * @param {Array} solution Pole obsahujícíc cestu (pointy) od startPointu k endPointu
     * @param {Int} index slouží k počítání počtu zanoření rekurze, je nazačátku nastaven na 0 a pokud je zanoření větší než je limit danou rekurzní větev ukončuji
     * @param {Int} limit Limit zanoření do hloubky, hodnota v jaké vzdálenosti se cíl nachází slouží k optimalizaci Backtrackingu (Hodnota je získána pomocí předchozího volání BFS algoritmu)
     */
    shortestWayPath(startPoint, endPoint, solution, index, limit) {
        if (index > limit) {
            return;
        }

        this.count++;
        solution.push(startPoint); //H = startpoint přidám do solutionu        

        for (let k = 0; k < 4; k++) {
            let np = this.nextInDirection(startPoint, k);
            if (np != null) {
                if (this.indexOfPoint(solution, np) == null) {
                    if ((np.x == endPoint.x) && (np.y == endPoint.y)) {
                        if (this.shortestWaySolution == null) {
                            this.shortestWaySolution = [];
                            for (let i = 0; i < solution.length; i++) {
                                this.shortestWaySolution.push(solution[i]);
                            }
                        } else if (this.shortestWaySolution.length > solution.length) {
                            this.shortestWaySolution = [];
                            for (let i = 0; i < solution.length; i++) {
                                this.shortestWaySolution.push(solution[i]);
                            }
                        }
                        if (this.shortestWaySolution.length == limit) {
                            return;
                        }
                    }
                    else {
                        this.shortestWayPath(np, endPoint, solution, index++, limit);
                    }
                }
                if (this.shortestWaySolution != null) {
                    if (this.shortestWaySolution.length == limit) {
                        return;
                    }
                }
            }
        }
        solution.pop();
    }

    /**
     * @description Graficky vykreslí cestu do mapy 
     * @param {Array} path pole pointů znázornujích cestu 
     */
    drawPath(path) {

        for (let i = 0; i < path.length - 1; i++) {
            let sp = path[i];
            let ep = path[i + 1];
            this.drawPointToPoint(sp, ep, "path", true)
        }
    }

    /**
     * @description Metoda označí všehny místa na mapě mezi dvěma definovanými body definovanou classou či ji z dané cesty odstraní
     * @param {Point} sp = point odkud chceme vykreslovat
     * @param {Point} ep = point kam chceme vykrelovat
     * @param {String} className = s jakým class namem budeme pracovat
     * @param {Boolean} add == true v případě, že chci přidat, false v případě že odbrat
     */
    drawPointToPoint(sp, ep, className, add) {

        //Výpočet směru posunu v ose X
        let xMove = (ep.x - sp.x) == 0 ? 0 : (ep.x - sp.x) > 0 ? 1 : -1;
        //Výpočet směru posunu v ose Y
        let yMove = (ep.y - sp.y) == 0 ? 0 : (ep.y - sp.y) > 0 ? 1 : -1;
        // Celková délka mezi body
        let length = Math.abs((ep.x - sp.x)) > Math.abs((ep.y - sp.y)) ? Math.abs((ep.x - sp.x)) : Math.abs((ep.y - sp.y));

        if (add) {
            this.map.rows[sp.y].cells[sp.x].classList.add(className);
        }
        else {
            this.map.rows[sp.y].cells[sp.x].classList.remove(className);
        }
        //Pro celou vzdálenost mezi body 
        for (let j = 0; j < length; j++) {

            if (add) {
                this.map.rows[sp.y += yMove].cells[sp.x += xMove].classList.add(className);
            }
            else {
                this.map.rows[sp.y += yMove].cells[sp.x += xMove].classList.remove(className);
            }

        }
    }

    /**
     * @description Grafické vymazání mapy od všech pointů a itemů
     */
    clear() {
        for (let y = 0; y < this.size; y++)
            for (let x = 0; x < this.size; x++) {
                this.map.rows[y].cells[x].style.backgroundColor = "transparent";
                this.map.rows[y].cells[x].style.backgroundImage = "";
                this.map.rows[y].cells[x].removeAttribute('class');
            }
        this.setAvailableDirection(this.player.position);
    }

    /**
     * @description Meoda vytvoří nebo doplní itemy podle akcí které byly předány od hry a aktuální situace hry. Validní itemy uloží do globálního pole this.lastItemCount
     * @param {Array} actions pole akcí (Action) 
     */
    createItems(actions) {

        // Do pole se uloží jen akce které jsou aktuální podle počtu nakažených nebo podle čísla kola
        let validAction = [];
        let existingItems = [];
        let actualItems = [];

        //do pole validAction se uloží aktuální akce
        for (let i = 0; i < actions.length; i++) {
            if (SCORE_DATA.onIndex(actions[i].typeOfScore) >= Math.abs(actions[i].value) && actions[i].value >= 0) {
                validAction.push(actions[i]);
            }
            if (SCORE_DATA.onIndex(actions[i].typeOfScore) <= Math.abs(actions[i].value) && actions[i].value < 0) {
                validAction.push(actions[i]);
            }
        }


        //předvyplníme pole existingItem 0 //pokud jsou k dyspozici nové informace o stavu generování itemů změní se globální pole lastItemCount
        for (let i = 0; i < ITEMTYPE.length; i++)
            for (let j = 0; j < 2; j++) {
                existingItems[ITEMTYPE.onIndex(i) + j] = 0;
                actualItems[ITEMTYPE.onIndex(i) + j] = null;
                for (let k = 0; k < validAction.length; k++) {
                    if ((validAction[k].type + validAction[k].dificulty) == (ITEMTYPE.onIndex(i) + j))
                        actualItems[ITEMTYPE.onIndex(i) + j] = actualItems[ITEMTYPE.onIndex(i) + j] == null ? validAction[k].itemCount : actualItems[ITEMTYPE.onIndex(i) + j] = validAction[k].itemCount;// posledni = melo +
                }
                if (actualItems[ITEMTYPE.onIndex(i) + j] != null) {
                    this.lastItemCount[ITEMTYPE.onIndex(i) + j] = actualItems[ITEMTYPE.onIndex(i) + j];
                }
            }


        //naplníme pole aktuálním počtem typů všech itemů, abychom věděli které musíme dogenerovat nebo kolik
        for (let j = 0; j < this.item.length; j++)
            existingItems[this.item[j].type + this.item[j].dificulty]++;


        //Pro všechny typy itemů, obsažené v konstantě
        for (let j = 0; j < ITEMTYPE.length; j++) {
            let type = ITEMTYPE.onIndex(j);

            //Pro všechny obtížnosti (0 nebo 1)
            for (let k = 0; k < 2; k++) {
                let dificulty = k;

                //doplňím poze do počtu který je odemne očekáván v každém typu itemu a jeho obtížnosti
                for (let i = 0; i < this.lastItemCount[type + dificulty] && existingItems[type + dificulty] < this.lastItemCount[type + dificulty]; i++) {

                    let rand;
                    let point;
                    let same = false;
                    let safetyCycle = 0;
                    let multiplayer = false;
                    //Vygeneruju náhodné validní body v random vzdálenosti od hráče, a zkontroluji zda se na něm náhodou již nějáký item nenachází, pokud ano generuji znovu.
                    do {
                        if (safetyCycle++ > 2000) {
                            ACHIEVEMENT("Ups... Prošel jsem 2000 náhodných možností, a nepovedlo se mi najít místo pro další Item.", "img/exclamation.png");
                            break;
                        }

                        rand = RANDOM_NUMBER(2, DIFICULTY.MAX_DISTANCE); // Nastavení vzdálenosti SET
                        point = this.validIndex(this.player.position, rand, 0, TYPE.LAST);
                        if (point == null)
                            continue;
                        if (this.item.length == 0) {
                            same = false;
                            point = point[0];
                        }
                        if (this.indexOfPoint(point, this.player.position) != null) {
                            point.splice(this.indexOfPoint(point, this.player.position), 1);
                        }
                        //kotrola zda alesponň jeden bod z validních je volný a není obsazen jiným itemem
                        for (let l = 0; l < point.length; l++) {
                            same = false;

                            for (let i = 0; i < this.item.length && point != null && !same; i++) {

                                if (DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE && RANDOM_NUMBER(0, 1) == 0 && point[l].validNeighbour != undefined) {
                                    multiplayer = true;
                                    if (this.item[i].position.x == point[l].validNeighbour.x && this.item[i].position.y == point[l].validNeighbour.y) {
                                        same = true;
                                    }
                                }
                                else {
                                    multiplayer = false;
                                    if (this.item[i].position.x == point[l].x && this.item[i].position.y == point[l].y) {
                                        same = true;
                                    }
                                }
                            }

                            if (!same) {
                                point = point[l];
                                break;
                            }
                        }
                    } while (point == null || same);

                    //Uložím item do pole aktuálních itemů a existujících
                    this.item.push(new Item(multiplayer ? point.validNeighbour : point, dificulty, rand, type, multiplayer ? point : undefined));
                    existingItems[type + dificulty]++;
                }
            }
        }



        //Vymažeme z pole this.lastItemCount akce které se mají provést pouze jednou
        for (let k = 0; k < validAction.length; k++) {
            if (validAction[k].repeat == false) {
                this.lastItemCount[validAction[k].type + validAction[k].dificulty] -= validAction[k].itemCount;
                if (this.lastItemCount[validAction[k].type + validAction[k].dificulty] == 0) {
                    delete this.lastItemCount[validAction[k].type + validAction[k].dificulty];
                }
            }
        }
        this.drawItems();
    }


    /**
     * @description Vykreslení všech itemů z globálního pole this.lastItemCount do mapy
     */
    drawItems() {

        //Pokud je pole s itemama prázdné končím s vykrelsováním
        if (this.item.length == 0) {
            return;
        }

        //prom toolTip obsahuje booleanovskou hodnotu zda se má itemům přidat hover Title s nápovědou o vzdálenosti hráče od daného itemu podle definované DIFICULTY
        let b = this.itemWasOnPosition;
        let a = (this.itemWasOnPosition && DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.EVERY_CATCH);
        let toolTip = ((this.itemWasOnPosition && DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.EVERY_CATCH)) || (DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.EVERY_STEP);
        //Pro všechny itemy 
        for (let i = 0; i < this.item.length; i++) {

            // pokud chceme definovat toolTip a zároveň tam již žádný není
            if (toolTip || (DIFICULTY.SHOW_TOOLTIP != SHOW_TOOLTIP.NEVER && this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].getAttribute("data-title") == null)) {
                let lenght = 0;
                if (this.item[i].validNeighbour != undefined) {
                    lenght = this.shortestWay(this.player.position, this.item[i].validNeighbour, RETURN.COUNT);
                    lenght += this.shortestWay(window.game.secondPlayer.position, this.item[i].validNeighbour, RETURN.COUNT);
                    lenght += " Nejsem si jistý, možná najdeš i kratší."
                }
                else {
                    lenght = this.shortestWay(this.player.position, this.item[i].position, RETURN.COUNT);
                }
                //Nastavím cenu za nákup cesty
                DIFICULTY.PRICE_FOR_PATH = lenght + 1;
                //Danému poli v mapě, na kterém se nachází item se nastaví title obsahující vzdálenost itemu odhráče
                this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].setAttribute("data-title", "Nejkratší cesta: " + lenght + " " + CZ_STRING(lenght, "tah") + ", nebo si ji kup za: " + DIFICULTY.PRICE_FOR_PATH + " " + CZ_STRING(lenght, "bod"))
            }
            else if (!toolTip && DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.NEVER) {
                this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].removeAttribute("data-title");
            }

            //Pokud již daný item na pozici v mapě nemá vykreslený obrázek 
            if (this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].style.backgroundImage == "") {

                //na danou pozici v mapě nastavíme class podle typu vykreslovaného itemu
                this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].setAttribute("class", this.item[i].type);
                //vybereme adresu obrázku pro daný typ a dificulty itemu
                let path = "";
                if (this.item[i].type == ITEMTYPE.HUMAN)
                    path = "url('img/" + this.item[i].dificulty + "." + RANDOM_NUMBER(1, 7) + ".png')";
                else if (this.item[i].type == ITEMTYPE.CURE)
                    path = "url('img/cure.png')";
                else if (this.item[i].type == ITEMTYPE.GROUP)
                    path = "url('img/0.0.png')";
                else if (this.item[i].type == ITEMTYPE.MORTALITY)
                    path = "url('img/mortality.png')";
                else if (this.item[i].type == ITEMTYPE.BOTTLE)
                    path = "url('img/bottle" + RANDOM_NUMBER(0, 15) + ".png')";

                //Danou adresu obrázku přidělíme místu v mapě (Css-ka se opět postarají o grafické vykreslení)
                this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].style.backgroundImage = path;

            }
        }
    }

    /**
     * @description Metoda má za cíl označit všechna validní dosažitelná pole v mapě, dle constanty DIFICULTY, označí daná dosažitelná pole
     * @param {String} name = označuje class name který budou pozice označeny 
     */
    drawAllValid(name) {

        //pouze si předám pointer na pole obsahující všechna validní dosažitelná pole z mapy
        let all = this.allValidPosition;
        // Pro všechna tato pole 
        for (let i = 0; i < all.length; i++) {
            //Přidám jim class valid (Pomocí css již kláda graficky daná pole označí)
            this.map.rows[all[i].y].cells[all[i].x].classList.add(name);
            this.map.rows[all[i].y].cells[all[i].x].style.backgroundImage = "url('img/" + name + RANDOM_NUMBER(0, 15) + ".png')";
            //Pokud je definováno zapnutí Multiplayeru, označí se i pole dosažitelná pouze v multiplayeru
            if (DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE && all[i].validNeighbour != null)
                this.map.rows[all[i].validNeighbour.y].cells[all[i].validNeighbour.x].classList.add(name + "Last");
            this.map.rows[all[i].validNeighbour.y].cells[all[i].validNeighbour.x].style.backgroundImage = "url('img/" + name + RANDOM_NUMBER(0, 15) + ".png')";
        }

        //Znovu grafiky označím pointy dosažitelné z aktuální pozice hráče
        this.setAvailableDirection(this.player.position);
    }

    /**
     * @description  Zkontroluje pozici hráče a vrací Buďto objekt Itemu nebo class list daného pole v mapě
     * @returns ClassList nebo Item
     */
    checkPlayerPosition() {

        //Pro všechny itemy
        for (let i = 0; i < this.item.length; i++)
            //Pokud hráč stojí na itemu
            if (this.item[i].position.x == this.player.position.x && this.item[i].position.y == this.player.position.y) {

                //Načtu si grafiku itemu na pozci kde stojí hráč
                let img = this.map.rows[this.player.position.y].cells[this.player.position.x].children[0].style.backgroundImage.split("/")[1].split('"')[0];

                //Nastavím novou změněnou grafiku na pozici kde je hráč, jelikož obr má první číslici v názvu stejnou jako immunity změním tak grafiku itemu jako by byl o immunitu menší
                this.map.rows[this.player.position.y].cells[this.player.position.x].children[0].style.backgroundImage = "url('img/" + ((parseInt(img.charAt(0))) - 1) + img.substr(1) + "')";

                //Pokud je immunity itemu pod 1 a zároveň ji dekrementuji o jedna
                if (this.item[i].immunity-- < 1) {
                    //Pokud měl vykreslenou cestu
                    if (this.item[i].drawPath) {
                        //Vymažu z mapy ozačená pole
                        this.clear();
                    }

                    //Pro všechny itemy 
                    for (let j = 0; j < this.item.length; j++) {
                        //Přeskoč item, na kterém se právě stojí
                        if (this.item[j] == this.item[i]) {
                            continue;
                        }
                        //přepočítám vzdálenost jak je item daleko od hráče, (pro přičtení bodů)
                        let lenght = this.shortestWay(this.player.position, this.item[j].position, RETURN.COUNT);
                        this.item[j].distance = lenght == null ? this.item[j].distance : lenght;
                    }

                    //Vymažu z daného pole grafiku itemu
                    this.map.rows[this.player.position.y].cells[this.player.position.x].children[0].style.backgroundImage = "";
                    //Vymažu z dané pozice nápovědu
                    this.map.rows[this.player.position.y].cells[this.player.position.x].children[0].removeAttribute("data-title");
                    //Vymažu classu
                    this.map.rows[this.player.position.y].cells[this.player.position.x].children[0].removeAttribute("class");
                    //Uložím si item na kterém stojí hráč
                    let returnItem = this.item[i];
                    //Smažu item z gobálního pole itemů
                    this.item.splice(i, 1);
                    //Nastavím globální proměnou že na této pozici byl item na true
                    this.itemWasOnPosition = true;
                    //Vracím item který na kterém jsem stál, a který jsem z pole předtím smazal
                    return returnItem;
                }

            }
            else {
                this.itemWasOnPosition = false;
            }

        //Jinak vracím list class danného pole, na kterém stojí hráč
        return this.map.rows[this.player.position.y].cells[this.player.position.x].classList;
    }

    /**
     * @description Metoda slouží pro zjisštění zda se na pozici nachází item
     * @param {Point} point = Point na kterém chceme zjistit zda se nenachází nějáký item
     * @returns = vrací true,  v případě, že se na pozici nachází item v opačném případě false
     */
    isItemOnPoint(point) {
        if (this.item.length == 0)
            return false;
        for (let item of this.item) {
            if (item.position.x == point.x && item.position.y == point.y) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description Metoda slouží k zjisštění indexu pointu z daného pole
     * @param {Array} arr = pole Pointů 
     * @param {Point} point 
     * 
     * @returns = vrací index z pole, na kterém se nachází daný point, pokud se point v poli nenachází, vrací null
     */
    indexOfPoint(arr, point) {

        for (let i = 0; i < arr.length; i++)
            if (arr[i].x == point.x && arr[i].y == point.y)
                return i;
        return null;
    }


    /**
     * @description Metoda zamíchá a vratí pole
     * @param {Array} q = Pole, které chceme zamíchat
     * @returns = vrátí dané pole, náhodně zamíchané
     */
    shuffleArray(q) {
        if (q)
            for (var array = [], i = 0; i < ((this.size / 2) - 2) / 2; i++)
                array[i] = (i * 2) + 1;
        else
            for (var array = [], i = 0; i < ((this.size / 2) - 2) / 2; i++)
                array[i] = (i * 2);

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }


}


