
class Map {

    map;
    player;
    item;

    validPosition;
    allValidPosition;

    size;
    pxSizeCell;

    err;
    cellColor;

    mainButton;

    constructor(size) {

        this.size = size;
        this.pxSizeCell = MAP_TABLE.offsetHeight / this.size;
        this.validPosition = [];
        this.allValidPosition = [];
        this.item = [];
        this.lastItemCount = [];
        this.cellColor = "#efefef";

        this.player = new Player(this);
        this.createMap();
        this.player.resetPosition();

        this.setAvailableDirection(this.player.position);

    }

    createMap() {

        this.err = false;
        this.map = document.createElement("table");
        this.map.setAttribute("id", "mapTable");
        for (var x = 0; x < this.size; x++) {
            let row = document.createElement("tr");
            for (var y = 0; y < this.size; y++) {

                let cell = document.createElement("td");

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
                            window.game.nextRound();
                            //Z dané pozice kde hráč byl vymažu class valid (Aktuální jen před zahájením hry, šedivé pozice)
                            e.target.parentNode.classList.remove("valid");
                            e.target.parentNode.classList.remove("validLast");
                        }
                    }
                }

                //Funkce volána při double kliknu na jakoukoliv pozici na mapě, vykreslí cestu, nebo ji smaže od pozice hráče k danému místu na mapě, pokud je na něm libovolný item
                cell.ondblclick = function (e) {
                        let point = new Point(parseInt(e.target.id.split(":")[0]), parseInt(e.target.id.split(":")[1]));
                        let itemsPoints = [];
                        for (let x of game.map.item)
                            itemsPoints.push(x.position);
                        let indexOfItem = window.game.map.indexOfPoint(itemsPoints, point);
                        if (game.map.isItemOnPoint(point)) {
                            if (game.map.item[indexOfItem].drawPath) {
                                game.map.item[indexOfItem].drawPath = false;
                                game.map.clear();
                            }
                            else {
                                game.map.item[indexOfItem].drawPath = true;
                                //Vytvoření nového pointu z pozice hráče, aby nedošlo k předání poiteru na instanci Pointu, který by se jinak změnil
                                let position = new Point(window.game.map.player.position.x, window.game.map.player.position.y);
                                window.game.map.shortestWay(position, point, RETURN.DRAW);
                            }
                        }
                }

                var cont = document.createElement("div");
                cont.setAttribute("id", y + ":" + x);
                cont.style.width = this.pxSizeCell;
                cont.style.height = this.pxSizeCell;
                cell.appendChild(cont);
                row.appendChild(cell);
            }
            this.map.appendChild(row);
        }

        let seed = this.generateSeed();

        //--  napozicování main Buttonu

        let button = document.createElement("button");
        button.setAttribute("class", "mainButton");
        //let buttonText = document.createElement("div");
        //buttonText.setAttribute("class", "buttonText");
        button.innerHTML = "START";

        //button.appendChild(buttonText);
        button.onclick = function (x) {
            if (window.game.started == false && window.game.started != null) {
                game.start();
                x.target.innerHTML = "POČKAT";
                x.target.style.fontSize = "x-small";
                //x.target.children[0].style.width = (x.target.children[0].getBoundingClientRect().width / 2) * -1
            }
            else {
                game.nextRound();
                game.map.player.me.focus();
                setTimeout(() => { game.map.player.me.blur() }, 250);
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

        this.validMap();

        if (!this.err && MAP_TABLE.children.length == 1) {
            MAP_TABLE.appendChild(this.map);
            //buttonText.style.marginLeft = (buttonText.getBoundingClientRect().width / 2) * -1;
        }
        else
            this.createMap();




    }

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

    setWall(cell, direction) {

        let y = cell.parentNode.rowIndex;
        let x = cell.cellIndex;

        //cell.style.background = "grey";
        try {
            switch (direction % 4) {
                case 0:
                    cell.style.borderTop = "2px solid black";
                    this.map.rows[y - 1].cells[x].style.borderBottom = "2px solid black";
                    //this.map.rows[y - 1].cells[x].style.background = "orange";
                    break;
                case 1:
                    cell.style.borderRight = "2px solid black";
                    this.map.rows[y].cells[x + 1].style.borderLeft = "2px solid black";
                    //this.map.rows[y].cells[x + 1].style.background = "orange";
                    break;
                case 2:
                    cell.style.borderBottom = "2px solid black";
                    this.map.rows[y + 1].cells[x].style.borderTop = "2px solid black";
                    //this.map.rows[y + 1].cells[x].style.background = "orange";
                    break;
                case 3:
                    cell.style.borderLeft = "2px solid black";
                    this.map.rows[y].cells[x - 1].style.borderRight = "2px solid black";
                    //this.map.rows[y].cells[x - 1].style.background = "orange";
                    break;

                default:
                    cell.style.border = "2px solid black";
                    break;
            }
        } catch (error) {
            //alert("Došlo k chybě při generování mapy.");
            this.err = true;
        }
    }

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

    nextInDirection(point, direction) {

        var cell;
        let addX = 0;
        let addY = 0;
        let free = true;

        do {
            cell = this.map.rows[point.y + addY].cells[point.x + addX];
            if (cell == undefined) {

                let a = this.map;
                let b = a.rows[point.y + addY];
                let c = b.cells[point.x + addX];
                cell = c;

            }

            switch (direction % 4) {
                case 0:
                    free = cell.style.borderTop == "" ? true : false;
                    free = point.y + addY - 1 == -1 ? free ? false : true : free;
                    addY--;
                    break;
                case 1:
                    free = cell.style.borderRight == "" ? true : false;
                    free = point.x + addX + 1 == this.size ? free ? false : true : free;
                    addX++;
                    break;
                case 2:
                    free = cell.style.borderBottom == "" ? true : false;
                    free = point.y + addY + 1 == this.size ? free ? false : true : free;
                    addY++;
                    break;
                case 3:
                    free = cell.style.borderLeft == "" ? true : false;
                    free = point.x + addX - 1 == -1 ? free ? false : true : free;
                    addX--;
                    break;

                default:
                    cell.style.border = "1px solid black";
                    break;
            }
            //this.player.moveTo(new Point(point.x + addX, point.y + addY));
        } while (free);

        addX = addX == 0 ? 0 : addX < 0 ? ++addX : --addX;
        addY = addY == 0 ? 0 : addY < 0 ? ++addY : --addY;
        return addX == 0 && addY == 0 ? null : new Point(point.x + addX, point.y + addY);

    }

    setAvailableDirection(point) {

        for (let i = 0; i < this.validPosition.length; i++)
            this.map.rows[this.validPosition[i].y].cells[this.validPosition[i].x].classList.remove("cell");

        //this.map.rows[this.validPosition[i].y].cells[this.validPosition[i].x].style.background = this.cellColor;

        this.validPosition = [];
        for (let i = 0; i < 4; i++) {
            let newPoint = this.nextInDirection(point, i);
            if (newPoint == null)
                continue;
            let cell = this.map.rows[newPoint.y].cells[newPoint.x];
            //cell.style.background = "";
            cell.classList.add("cell");

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
     * @param return = Vrací null v případě že nelze dojít ze všech rohů, do všech ostatních, nebo nebyl nalezen validní index v požadované vzdálenosti, či jich nebylo dostatek.
     *                  V opačném případě vrátí na TYPE.ALL - Všechny validní indexy v dané vzdálenosti s minniáním počtem od bodu který specifikujeme.blob
     *                                             TYPE.LAST - njevzdálenejší point od bodu point s danou vzdáleností.
     *                                             TYPE.RAND - Náhodný bod v dané vzdálenosti od pointu.
     */
    validIndex(point, distance, count, type) {

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
                /*                 let lastXLength = 0
                                let lastYLength = 0;
                                let lastPoint = point;
                                for (let p of result) {
                                    if (Math.abs(p.x - lastPoint.x) > lastXLength && Math.abs(p.y - lastPoint.y) > lastYLength); {
                                        lastXLength = Math.abs(p.x - lastPoint.x);
                                        lastYLength = Math.abs(p.y - lastPoint.y);
                                        lastPoint = p;
                                    }
                                } */
                return result;
            case TYPE.RAND:
                return result.pop();
            default:
                return null;
        }
    }

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

    drawPath(path) {

        for (let i = 0; i < path.length - 1; i++) {
            let sp = path[i];
            let ep = path[i + 1];
            this.drawPointToPoint(sp, ep, "path", true)
        }
    }

    /**
     * Metoda označí všehny místa na mapě mezi dvěma definovanými body definovanou classou či ji z dané cesty odstraní
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

    clear() {
        for (let y = 0; y < this.size; y++)
            for (let x = 0; x < this.size; x++) {
                this.map.rows[y].cells[x].style.backgroundColor = "transparent";
                this.map.rows[y].cells[x].removeAttribute('class');
            }
        this.setAvailableDirection(this.player.position);
    }

    createItems(round, infected, actions) {

        // Do pole se uloží jen akce které jsou aktuální podle počtu nakažených nebo podle čísla kola
        let validAction = [];
        let existingItems = [];
        let actualItems = [];


        //do pole validAction se uloží aktuální
        for (let i = 0; i < actions.length; i++)
            if ((actions[i].round <= round && actions[i].round != null) || (actions[i].infected <= infected && actions[i].infected != null))
                validAction.push(actions[i]);


        //předvyplníme pole existingItem 0 //pokud jsou k dyspozici nové informace o stavu generování itemů změní se globální pole lastItemCount
        for (let i = 0; i < ITEMTYPE.length; i++)
            for (let j = 0; j < 2; j++) {
                existingItems[ITEMTYPE.onIndex(i) + j] = 0;
                actualItems[ITEMTYPE.onIndex(i) + j] = null;
                for (let k = 0; k < validAction.length; k++) {
                    if ((validAction[k].type + validAction[k].dificulty) == (ITEMTYPE.onIndex(i) + j))
                        actualItems[ITEMTYPE.onIndex(i) + j] = actualItems[ITEMTYPE.onIndex(i) + j] == null ? validAction[k].itemCount : actualItems[ITEMTYPE.onIndex(i) + j] += validAction[k].itemCount;
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
                    //Vygeneruju náhodné validní body v random vzdálenosti od hráče, a zkontroluji zda se na něm náhodou již nějáký item nenachází, pokud ano generuji znovu.
                    do {
                        if (safetyCycle++ > 5000) {
                            alert("Ups... Prošel jsem 1000 náhodných možností, a nepovedlo se mi najít místo pro další Item.");
                            break;
                        }

                        rand = RANDOM_NUMBER(2, 10); // Nastavení vzdálenosti SET
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
                            for (let i = 0; i < this.item.length && point != null && !same; i++)
                                if (this.item[i].position.x == point[l].x && this.item[i].position.y == point[l].y) {
                                    same = true;
                                }

                            if (!same) {
                                point = point[l];
                                break;
                            }
                        }
                    } while (point == null || same);

                    //Uložím item do pole aktuálních itemů a existujících
                    this.item.push(new Item(point, dificulty, rand, type));
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

    drawItems() {

        //Pokud je pole s itemama prázdné vyhodím chybu
        if (this.item.length == 0) {
            throw "Not enought items";
        }

        //prom toolTip obsahuje booleanovskou hodnotu zda se má itemům přidat hover Title s nápovědou o vzdálenosti hráče od daného itemu podle definované DIFICULTY
        let toolTip = (((this.isItemOnPoint(this.player.position) && DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.EVERY_CATCH)) || (DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.EVERY_STEP));
        //Pro všechny itemy 
        for (let i = 0; i < this.item.length; i++) {

            // pokud chceme definovat toolTip a zároveň tam již žádný není
            if (toolTip || (DIFICULTY.SHOW_TOOLTIP != SHOW_TOOLTIP.NEVER && this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].getAttribute("data-title") == null)) {
                //Danému poli v mapě, na kterém se nachází item se nastaví title obsahující vzdálenost itemu odhráče
                this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].setAttribute("data-title", "Nejkratší vzdálenost: " + this.shortestWay(this.player.position, this.item[i].position, RETURN.COUNT))
            }

            //Pokud již daný item na pozici v mapě nemá vykreslený obrázek 
            if (this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].style.backgroundImage == "") {

                //na danou pozici v mapě nastavíme class podle typu vykreslovaného itemu
                this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].setAttribute("class", this.item[i].type);
                //vybereme adresu obrázku pro daný typ a dificulty itemu
                let path = "";
                if (this.item[i].type == ITEMTYPE.HUMAN)
                    path = "url('img/" + this.item[i].dificulty + "." + RANDOM_NUMBER(1, 7) + ".png')";
                else if (this.item[i].type == ITEMTYPE.INFECTICITY)
                    path = "url('img/infecticity.png')";
                else if (this.item[i].type == ITEMTYPE.GROUP)
                    path = "url('img/0.0.png')";
                else if (this.item[i].type == ITEMTYPE.MORTALITY)
                    path = "url('img/mortality.png')";

                //Danou adresu obrázku přidělíme místu v mapě (Css-ka se opět postarají o grafické vykreslení)
                this.map.rows[this.item[i].position.y].cells[this.item[i].position.x].children[0].style.backgroundImage = path;

            }
        }
    }

    /**
     * Metoda má za cíl označit všechna validní dosažitelná pole v mapě, dle constanty DIFICULTY, označí daná dosažitelná pole
     */
    drawAllValid() {

        //pouze si předám pointer na pole obsahující všechna validní dosažitelná pole z mapy
        let all = this.allValidPosition;
        // Pro všechna tato pole 
        for (let i = 0; i < all.length; i++) {
            //Přidám jim class valid (Pomocí css již kláda graficky daná pole označí)
            this.map.rows[all[i].y].cells[all[i].x].classList.add("valid");
            //Pokud je definováno zapnutí Multiplayeru, označí se i pole dosažitelná pouze v multiplayeru
            if (DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE && all[i].validNeighbour != null)
                this.map.rows[all[i].validNeighbour.y].cells[all[i].validNeighbour.x].classList.add("validLast");
        }

        //Znovu grafiky označím pointy dosažitelné z aktuální pozice hráče
        this.setAvailableDirection(this.player.position);
    }

    /**
     * 
     * @param {RETURN} ret = Vrátí item, nebo class list na kterém stojí player, nebo true a folse jestli stojí na Itemu nebo ne
     * @param {Boolean} remove = True = pokud chceme odstranit item z pole itemů
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
                        //přepočítám vzdálenost jak je item daleko od hráče, (pro přičtení bodů)
                        this.item[j].distance = this.shortestWay(this.player.position, this.item[j].position, RETURN.COUNT);
                    }

                    //Vymažu z daného pole grafiku itemu
                    this.map.rows[this.player.position.y].cells[this.player.position.x].children[0].style.backgroundImage = "";

                    //Uložím si item na kterém stojí hráč
                    let returnItem = this.item[i];
                    //Smažu item z gobálního pole itemů
                    this.item.splice(i, 1);
                    //Vracím item který na kterém jsem stál, a který jsem z pole předtím smazal
                    return returnItem;
                }

            }

        //Jinak vracím list class danného pole, na kterém stojí hráč
        return this.map.rows[this.player.position.y].cells[this.player.position.x].classList;
    }

    /**
     * 
     * @param {Point} point = Point na kterém chceme zjistit zda se nenachází nějáký item
     * 
     * @param return = vrací true,  v případě, že se na pozici nachází item v opačném případě false
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
     * 
     * @param {Array of Point} arr 
     * @param {Point} point 
     * 
     * @param return = vrací index z pole, na kterém se nachází daný point, pokud se point v poli nenachází, vrací null
     */
    indexOfPoint(arr, point) {

        for (let i = 0; i < arr.length; i++)
            if (arr[i].x == point.x && arr[i].y == point.y)
                return i;
        return null;
    }


    /**
     * 
     * @param {Array} q = Pole, které chceme zamíchat
     * 
     * @param return = vrátí dané pole, náhodně zamíchané
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


