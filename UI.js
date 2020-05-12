class UI {

    constructor() {

        this.expand = false;
        this.scoreBoard = [];
        DIV_INFO.appendChild(this.getResizer());
        DIV_INFO.children[0].appendChild(new Option("Pravidla", 0, true, true));
        DIV_INFO.children[0].appendChild(new Option("Nastavení", 1, false, false));
        DIV_INFO.children[0].appendChild(new Option("Nejlepší score", 2, false, false));


        this.loadCookieScoreBoard();
        this.infoChange(DIV_INFO.children[0]);
    }

    infoChange(e) {

        if (e.value == 0) {
            this.clear();
            DIV_INFO.appendChild(this.getRules());
        }
        else if (e.value == 1) {

            this.clear();
            DIV_INFO.appendChild(this.getSeting());
            document.getElementsByName("multiplayer")[0].checked = DIFICULTY.MULTIPLAYER == MULTIPLAYER.FALSE ? true : false;
            document.getElementsByName("multiplayer")[1].checked = DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE ? true : false;
            document.getElementsByName("map_size")[0].value = DIFICULTY.MAP_SIZE == MAP_SIZE.EASY ? 0 : DIFICULTY.MAP_SIZE == MAP_SIZE.MEDIUM ? 1 : 2;
            document.getElementsByName("map_size")[0].dispatchEvent(new Event("input"))
            document.getElementsByName("game_mode")[0].value = DIFICULTY.GAME_MODE == GAME_MODE.EDUCATION ? "EDU-kačka" : DIFICULTY.GAME_MODE == GAME_MODE.ONE_POINT ? "Jeden bod" : DIFICULTY.GAME_MODE == GAME_MODE.ALL_IN ? "JSeber vše" : DIFICULTY.GAME_MODE == GAME_MODE.STORY ? "Příběh" : null;
            document.getElementsByName("dificulty")[0].value = DIFICULTY.MAX_DISTANCE == DISTANCE.SHORT ? "Lehká" : DIFICULTY.MAX_DISTANCE == DISTANCE.MEDIUM ? "Střední" : "Těžká";
            document.getElementsByName("help")[0].checked = DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.NEVER ? false : true;
            document.getElementsByName("help")[0].dispatchEvent(new Event("input"))
            document.getElementsByName("helpType")[0].value = DIFICULTY.SHOW_TOOLTIP == SHOW_TOOLTIP.EVERY_CATCH ? "Jen při chycení" : "Každý krok";
        }
        else if (e.value == 2) {
            this.clear();
            DIV_INFO.appendChild(this.getScoreBoard());
        }




        if (this.expand) {
            DIV_INFO.classList.add("expand");
            DIV_INFO.children[2].classList.add("expand");
        }
        else {
            DIV_INFO.classList.remove("expand");
            DIV_INFO.children[2].classList.remove("expand");
        }



    }

    getResizer() {

        let div = document.createElement("div");
        div.setAttribute("id", "resizer");
        div.innerHTML = "Zvětšit";

        div.onclick = function (e) {

            let list = DIV_INFO.classList;

            if (list.length == 0) {
                DIV_INFO.classList.add("expand");
                DIV_INFO.children[2].classList.add("expand");
                e.target.innerHTML = "Zmenšit";
                window.UI.expand = true;
            }
            else {
                DIV_INFO.classList.remove("expand");
                DIV_INFO.children[2].classList.remove("expand");
                e.target.innerHTML = "Zvětšit";
                window.UI.expand = false;
            }

        }

        return div;

    }

    clear() {
        if (document.getElementById("content") != null) {
            document.getElementById("content").remove();
        }
    }


    getRules() {

        let div = document.createElement("div");
        div.setAttribute("id", "content");

        let ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<p>Covid-Game vlastně vůbec nen&iacute; hra, ale <strong>optimalizačn&iacute; &uacute;loha</strong>, ve kter&eacute; m&aacute;te za &uacute;kol pomoci viru naj&iacute;t cestu k c&iacute;li. <strong>Pohybuj&iacute;c&iacute;</strong> se virus se může <strong>zastavit pouze o zeď nebo někter&eacute;ho kamar&aacute;da</strong> (jin&yacute; virus). Dostat je rychle tam, kam potřebujeme, nen&iacute; proto vůbec jednoduch&eacute;. Do <strong>celkov&eacute;ho skore</strong> se započ&iacute;t&aacute;v&aacute; vždy <strong>aktu&aacute;ln&iacute; Score</strong> tedy každ&yacute;m kolem se Celkov&eacute; zv&yacute;&scaron;&iacute; o aktu&aacute;ln&iacute;. Proto se vyplat&iacute; m&iacute;t co nejd&eacute;le na sv&eacute;m kontě co největ&scaron;&iacute; score.</p><p>&nbsp;</p>";
        div.appendChild(ruleText);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<p>&nbsp;</p><p><strong><h2>HERN&Iacute; MOD: Př&iacute;běh</h2></strong></p><p>Každ&yacute; <strong>krok ubere 1 bod</strong> a každ&yacute;ch <strong>10 kol se cena zvy&scaron;uje o jena</strong>.</p><p>Každ&yacute; <strong>nakažen&yacute; přid&aacute; tolik bodů</strong>, jak&aacute; byla jeho <strong>vzd&aacute;lenost od posledn&iacute;ho sebran&eacute;ho itemu + 1</strong> <strong>vyn&aacute;soben&aacute; cenou tahu,</strong> (Aby se cesta vyplatila), pot&eacute; trv&aacute; <strong>4 kola</strong>, než dojde k tomu, že s danou pravděpodobnost&iacute;, kter&yacute; odpov&iacute;d&aacute; vzd&aacute;lenosti <strong>zemře</strong>, v tom př&iacute;padě znovu <strong>přid&aacute; score</strong> o <strong>1/2 jeho vzdalenosti</strong> (Vyn&aacute;sobenou cenou tahu), nebo se <strong>vyl&eacute;č&iacute;</strong> v tom př&iacute;padě se <strong>ubere score rovno jeho vzd&aacute;lenosti</strong> (Opět vyn&aacute;sobena cenou tahu). Po celou dobu, co je nakažen&yacute; m&aacute; každ&eacute; kolo nakažen&yacute; pravděpodobnost že <strong>nakaz&iacute; dal&scaron;&iacute;ho člověka,</strong> kter&yacute; bude m&iacute;t stejnou hodnotu score, jako ten co ho nakazil.</p><p><strong>Hra koč&iacute;, pokud dojdou body, nebo se l&eacute;čba dostane na 100%</strong></p><p><strong>C&iacute;lem je z&iacute;skat co největ&scaron;&iacute; score.</strong></p><p><em> (Např. nakaz&iacute;m člověka kter&yacute; byl vzd&aacute;len 10 kroků v tahu 15, score se zvět&scaron;&iacute; o 22, protože Item m&aacute; vzd&aacute;lenost 10 + 1 * cena kroku je 2, každ&eacute; kolo m&aacute;m &scaron;anci že přibyde dal&scaron;&iacute; nakažen&yacute;, kter&yacute; mi přid&aacute; dal&scaron;&iacute;ch 10 bodů score. Po 4 dnech, buďto zemře, (přid&aacute; 5 * 2 bodů) nebo se uzdrav&iacute; (Odebere 10 * 2 bodů).</em></p><p>&nbsp;</p>";
        div.appendChild(ruleText);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<p><strong><h2>HERN&Iacute; MOD: Edukace</h2></strong></p><p>Každ&yacute; <strong>krok ubere 1 bod.</strong></p><p>Každ&yacute; <strong>nakažen&yacute; přid&aacute; tolik bodů</strong>, jak&aacute; byla jeho <strong>vzd&aacute;lenost od posledn&iacute;ho sebran&eacute;ho itemu + 1</strong><strong>,</strong> (Aby se cesta vyplatila), pot&eacute; trv&aacute; <strong>4 kola</strong>, než dojde k tomu, že s danou pravděpodobnost&iacute;, kter&yacute; odpov&iacute;d&aacute; <strong>vzd&aacute;lenosti * 1,5</strong>&nbsp;<strong>zemře</strong>, v tom př&iacute;padě znovu <strong>přid&aacute; score</strong> o <strong>1/2 jeho vzdalenosti</strong>, nebo se <strong>vyl&eacute;č&iacute;</strong> v tom př&iacute;padě se <strong>ubere score rovno jeho vzd&aacute;lenosti</strong>&nbsp;. Po celou dobu, co je nakažen&yacute; m&aacute; každ&eacute; kolo nakažen&yacute; pravděpodobnost že <strong>nakaz&iacute; dal&scaron;&iacute;ho člověka,</strong> kter&yacute; bude m&iacute;t stejnou hodnotu score, jako ten co ho nakazil.</p><p><strong>Hra koč&iacute;, pokud dojdou body, nebo se l&eacute;čba dostane na 100%</strong></p><p><strong>C&iacute;lem je z&iacute;skat co největ&scaron;&iacute; score.</strong></p><p><em> (Např. nakaz&iacute;m člověka kter&yacute; byl vzd&aacute;len 10 kroků , score se zvět&scaron;&iacute; o 11, protože Item m&aacute; vzd&aacute;lenost 10 + 1, každ&eacute; kolo m&aacute;m &scaron;anci že přibyde dal&scaron;&iacute; nakažen&yacute;, kter&yacute; mi přid&aacute; dal&scaron;&iacute;ch 10 bodů score. Po 4 dnech, buďto zemře, (přid&aacute; 5 bodů) nebo se uzdrav&iacute; (Odebere 10 bodů).</em></p><p>&nbsp;</p>";
        div.appendChild(ruleText);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<p>&nbsp;</p><p><strong><h2>HERN&Iacute; MOD: Jeden bod</h2></strong></p><p>Každ&yacute; <strong>krok ubere 1 bod.</strong></p><p>každ&aacute; <strong>lahvička přid&aacute; tolik bodů, jako je vzd&aacute;lenost od posledn&iacute; sebran&eacute; lahvičky,</strong> nebo startovn&iacute; pozice +1. Z&aacute;roveň<strong> lahvička přid&aacute; n&aacute;hodně mezi 1 - 5% l&eacute;čby.</strong></p><p><strong>Hra koč&iacute;, pokud dojdou body.</strong></p><p><strong>C&iacute;lem je z&iacute;skat 100% l&eacute;čbu, nebo maximální score co jen dovedete.</strong></p><p>&nbsp;</p>";
        div.appendChild(ruleText);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<p>&nbsp;</p><p><strong><h2>HERN&Iacute; MOD: Seber v&scaron;e</h2></strong></p><p>Každ&yacute; <strong>krok ubere 1 bod.</strong></p><p>&nbsp;</p><p><strong><img src='img/relues1.gif' alt='' /></strong></p><p>Vždy když se hr&aacute;č pohne, vy&scaron;le tlakovou vlnu, do v&scaron;ech stran. Z toho důvodu znič&iacute; v&scaron;echny lahvičky ve v&scaron;ech směrech, pokud nen&iacute; lahvička u zdi. Tu dok&aacute;ze sebrat a přidat si ji do sb&iacute;rky.</p><p><strong>Hra koč&iacute;, pokud dojdou body.</strong></p><p><strong>C&iacute;lem je z&iacute;skat v&scaron;echny lahvičky, </strong>a vyčistit mapu.</p><p>&nbsp;</p>";
        div.appendChild(ruleText);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<br><br><br><br><br><br><br><p><strong>FUNKCE</strong></p><p>Poukud <strong>najedete my&scaron;&iacute; zobraz&iacute; se V&aacute;m vzd&aacute;lenost k dan&eacute;mu itemu,</strong> v <strong>nastaven&iacute;</strong> lze nastavit, zda se bude vzd&aacute;lenost zobrazovat z <strong>aktu&aacute;ln&iacute; pozice</strong> na mapě, nebo se zobraz&iacute; jen vzd&aacute;lenost, od <strong>posledn&iacute;ho sebran&eacute;ho itemu</strong>, či <strong>nikoliv</strong>.</p><p>Pokud <strong>klikneme</strong> na item <strong>2x</strong> (Double klik) za body si můžeme <strong>koupit cestu.</strong> Zobrazen&iacute; cesty z jak&eacute;hokoliv m&iacute;sta na mapě stoj&iacute; <strong>vždy stejně bodů jako je vzdálenost + 1</strong></p><p>Cesta zmiz&iacute;, když je item sebr&aacute;n, nebo dal&scaron;&iacute;m dvojklikem na item (Smaz&aacute;n&iacute; je <strong>zdarma</strong>). Pokud najedeme na červeně zvýrazněné pole, kam můžeme šlápnout, zobrazí se nám také cena cesty.</p><br><br><br><br><br><br><br>";
        div.appendChild(ruleText);


        let img = document.createElement("div");
        img.setAttribute("id", "imgPreview");
        img.style.backgroundImage = "url(img/humans.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Člověk bez roušky se nakazí ihned po stoupnutí na jeho pozici.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id", "imgPreview");
        img.style.backgroundImage = "url(img/humansDefend.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Člověk s rouškou si ji po stoupnutí na jeho pozici sundá, a je nutné buďto počkat jedno kolo na místě, nebo se na pole vrátit jindy.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id", "imgPreviewLong");
        img.style.backgroundImage = "url(img/0.0.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Skupinkase počítá jako 5* člověk bez roušky.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id", "imgPreviewLong");
        img.style.backgroundImage = "url(img/cure.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Rouška sníží léčbu o 10% .</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id", "imgPreviewLong");
        img.style.backgroundImage = "url(img/rip.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Hrobeček přidá 10% pravděpodobnosti ÚMRTNOSTI.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id", "imgPreviewLong");
        img.style.backgroundImage = "url(img/bottle.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Lahvička přidá náhodně 1 až 5 % LÉČBY</p>";
        div.appendChild(ruleText);


        return div;
    }

    getSeting() {

        let div = document.createElement("div");
        div.setAttribute("id", "content");

        let mody = "";
        for (let i = 0; i < GAME_MODE.length; i++) {
            mody += GAME_MODE.toString(i) + "/";
        }
        div.appendChild(this.getGraphic(POSITON.VERTICAL, "1 Hráč: ", "input/radio/multiplayer/true", 2));
        div.appendChild(this.getGraphic(POSITON.VERTICAL, "2 Hráči: ", "input/radio/multiplayer", 2));
        div.appendChild(this.getGraphic(POSITON.VERTICAL, "Velikost mapy: Střední 16x16", "input/range/map_size/1", 1, "min/0/max/2"));
        div.appendChild(this.getGraphic(POSITON.VERTICAL, "Herní režim: ", "select/" + mody + "game_mode/" + GAME_MODE.toString(GAME_MODE.EDUCATION), 1));
        div.appendChild(this.getGraphic(POSITON.VERTICAL, "Obtížnost: ", "select/Lehká/Střední/Těžká/dificulty/Střední", 1, "title/V jaké vdálenosti se budou itemi vytvářet, lehká budou mít max. vzdálenost 7 kroků, Těžká až 20."));
        div.appendChild(this.getGraphic(POSITON.HORIZONTAL, "Nápovědy: ", "input/checkbox/help/true", 0, "title/Při najetí na item se zobazí jak je daleko"));
        div.appendChild(this.getGraphic(POSITON.HORIZONTAL, "Přepočítat: ", "select/Každý krok/Jen při chycení/helpType/", 0, "title/Při najetí na item se zobazí jak je daleko, tímto nastavením určíte kdy se má vzdálenost přepočítat."))
        //div.appendChild(this.getGraphic(POSITON.HORIZONTAL,"Inkubační doba: ","input/number/incubation/4",0,"min/1/title/Jak dlouho trvá než se z akažené stane mrví nebo vyléčený."));
        this.saveCookieScoreBoard();
        return div;
    }

    getScoreBoard() {

        let div = document.createElement("div");
        div.setAttribute("id", "content");



        for (let i = 0; i < GAME_MODE.length; i++) {

            let box = document.createElement("div");
            box.setAttribute("id", "box");

            box.append(this.getGraphic("h1/" + GAME_MODE.toString(i)));

            //Buble sort
            let change = true;
            while (change) {
                change = false;
                for (let j = 0; j < this.scoreBoard[i].length - 1; j++) {
                    if (this.scoreBoard[i][j] < this.scoreBoard[i][j + 1]) {
                        let temp = this.scoreBoard[i][j];
                        this.scoreBoard[i][j] = this.scoreBoard[i][j + 1];
                        this.scoreBoard[i][j + 1] = temp;
                        change = true;
                    }
                }
            }
            //-------------------


            for (let j = 0; j < this.scoreBoard[i].length; j++) {
                if (!isNaN(parseInt(this.scoreBoard[i][j])))
                    box.append(this.getGraphic(POSITON.HORIZONTAL, (j + 1) + ". místo: ", "label/" + this.scoreBoard[i][j] + CZ_STRING(this.scoreBoard[i][j], " bod")));
            }
            if (this.scoreBoard[i].length == 0) {
                box.append(this.getGraphic("h3/Zatím nebyly odehrány žádné hry"));
            }

            div.appendChild(box);
        }

        return div;
    }




    /**
     * V případě zádosti o vykreslení nadpisu se volá funkce jen s jedním vstupním parametrem typu string např. getGraphic("h1/Nadpis");
     * nejprve se definuje tip nadpisu h1 či h2
     * h1 = je upršen pro hlavičku boxu
     * h2 lze použít kdekoliv v boxu jako doplňovací
     * 
     * @param {enum} position = VERTICAL nebo HORIZONTAL grafické vykreslení
     * @param {int} count = počet kolik elementů mábýt vykresleno na daném řádku pokud je zvoleno VERTICALní rozložení, Nemusí se zadávat pokud není zapotřebí počet definovat
     * @param {String} textLabel = Textová náplň popisku daného elementu
     * @param {String} inputType label/ a následovaný textovým obsahem
     *                           select/ následovaný textovým popisem obsahu výběrového seznamu odděleného lomítkem a nakonec / index položky která se nastaví jako vybraná (nepovinné)
     *                           input/text, input/number, input/range, input/password atd. + /name +  /value která se má nastavit např. input/text/value
     *                           
     *                           button "mezera" href odkaz podporováno i s lomítky
     * 
     * @param return vrátí div obsahující label a příslučný element s nastavenými hodnotami
     */
    getGraphic(position, textLabel, inputType, count, atribute) {

        if (arguments.length == 1) {
            let h = document.createElement(arguments[0].split("/")[0]);
            h.textContent = arguments[0].split("/")[1].trim();
            return h;
        }



        let div = document.createElement("div");
        div.setAttribute("ID", position == 0 ? "graphicVertical" : "graphicHorizontal");

        if (inputType.split(" ")[0] == "button") {
            let a;
            if (inputType.split(" ")[1] != undefined) {
                a = document.createElement("a");
                a.setAttribute("href", inputType.split(" ")[1]);
            }
            let button = document.createElement("button");
            button.innerHTML = textLabel.split("/")[0];
            div.style.width = 100 / count + "%";
            if (inputType.split(" ")[1] != undefined) {
                a.appendChild(button);
                div.appendChild(a);
            }
            else {
                div.appendChild(button);
            }

            let label = document.createElement("label");
            label.setAttribute("class", "element");
            label.textContent = textLabel.split("/")[1];
            div.appendChild(label);

            for (let i = 0; atribute != undefined && i < atribute.split("/").length; i += 2)
                button.setAttribute(atribute.split("/")[i], atribute.split("/")[i + 1]);

            return div
        }


        if (position == 0)
            div.style.width = 100 / count + "%";
        let label = document.createElement("label");
        label.setAttribute("id", "label");
        label.setAttribute("name", inputType.split("/")[2] + "Label");
        label.textContent = textLabel;
        div.appendChild(label);


        let input = document.createElement(inputType.split("/")[0]);
        input.setAttribute("type", inputType.split("/")[1]);

        if (inputType.split("/").length > 3) {
            input.value = inputType.split("/")[3].replace(/©/g, "/");
            if (inputType.split("/")[1] = "checkbox")
                input.checked = inputType.split("/")[3] == "true" ? true : false;
        }
        input.setAttribute("name", inputType.split("/")[2]);
        input.setAttribute("class", "element");
        if (inputType.split("/")[0] == "label")
            input.textContent = inputType.split("/")[1];
        if (inputType.split("/")[0] == "select") {
            for (let i = 1; i < inputType.split("/").length - 2; i++) {
                let o = document.createElement("option");
                o.setAttribute("value", inputType.split("/")[i]);
                let t = document.createTextNode(inputType.split("/")[i]);
                o.appendChild(t);
                input.appendChild(o);
            }
            let opts = input.options;
            for (let opt, j = 0; opt = opts[j]; j++) {
                if (opt.value == inputType.split("/")[inputType.split("/").length - 1]) {
                    input.selectedIndex = j;
                    break;
                }
            }
            input.setAttribute("name", inputType.split("/")[inputType.split("/").length - 2]);
        }

        for (let i = 0; atribute != undefined && i < atribute.split("/").length; i += 2)
            input.setAttribute(atribute.split("/")[i], atribute.split("/")[i + 1]);

        input.addEventListener("input", (x) => this.changeElement(x));
        /*input.addEventListener("focus", enterElement);
        input.addEventListener("blur", leaveElement);*/


        div.appendChild(input);

        return div;

    }

    clearMap() {

        for (let i = MAP_TABLE.children.length; i > 0; i--) {
            MAP_TABLE.children[0].remove();
        }
    }


    changeElement(e) {

        if (e.target.parentNode.children[0].innerHTML.toLowerCase().includes("velikost mapy")) {
            DIFICULTY.MAP_SIZE = MAP_SIZE.onIndex(parseInt(e.target.value));
            window.UI.clearMap();
            window.game = new Game();
            e.target.parentNode.children[0].innerHTML = "Velikost mapy: " + MAP_SIZE.toString(parseInt(e.target.value));
        }

        if (e.target.parentNode.children[0].innerHTML.toLowerCase().includes("nápovědy")) {
            if (e.target.checked) {
                document.getElementsByName("helpType")[0].parentNode.style.display = "inherit";
                DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.onIndex(document.getElementsByName("helpType")[0].value == "Každý krok" ? 0 : 1);
                if (window.game.map != undefined)
                    window.game.map.drawItems();
            }
            else {
                document.getElementsByName("helpType")[0].parentNode.style.display = "none";
                DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.NEVER;
                window.game.map.drawItems();
            }
        }


        if (e.target.parentNode.children[0].innerHTML.toLowerCase().includes("přepočítat")) {
            DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.onIndex(e.target.value == "Každý krok" ? 0 : 1);
            window.game.map.drawItems();
        }

        if (e.target.parentNode.children[0].innerHTML == "1 Hráč: ") {
            DIFICULTY.MULTIPLAYER = MULTIPLAYER.FALSE;
            window.UI.clearMap();
            window.game = new Game();
        }

        if (e.target.parentNode.children[0].innerHTML == "2 Hráči: ") {
            DIFICULTY.MULTIPLAYER = MULTIPLAYER.TRUE;
            window.UI.clearMap();
            window.game = new Game();
        }

        if (e.target.parentNode.children[0].innerHTML.toLowerCase().includes("režim")) {
            switch (e.target.value) {
                case GAME_MODE.toString(0):
                    DIFICULTY.GAME_MODE = GAME_MODE.EDUCATION;
                    document.getElementsByName("multiplayer")[0].disabled = false;
                    document.getElementsByName("multiplayer")[1].disabled = false;
                    document.getElementsByName("help")[0].disabled = false;
                    break;
                case GAME_MODE.toString(1):
                    DIFICULTY.GAME_MODE = GAME_MODE.ONE_POINT;
                    document.getElementsByName("multiplayer")[0].checked = true;
                    document.getElementsByName("multiplayer")[1].checked = false;
                    document.getElementsByName("multiplayer")[0].disabled = true;
                    document.getElementsByName("multiplayer")[1].disabled = true;
                    document.getElementsByName("help")[0].disabled = false;
                    break;
                case GAME_MODE.toString(2):
                    DIFICULTY.GAME_MODE = GAME_MODE.ALL_IN;
                    document.getElementsByName("multiplayer")[0].checked = true;
                    document.getElementsByName("multiplayer")[1].checked = false;
                    document.getElementsByName("multiplayer")[0].disabled = true;
                    document.getElementsByName("multiplayer")[1].disabled = true;
                    if (document.getElementsByName("help")[0].checked) {
                        document.getElementsByName("help")[0].value = false;
                        document.getElementsByName("help")[0].click(document.getElementsByName("help")[0]);
                        document.getElementsByName("help")[0].disabled = true;
                    }
                    break;
                case GAME_MODE.toString(3):
                    DIFICULTY.GAME_MODE = GAME_MODE.STORY;
                    document.getElementsByName("multiplayer")[0].disabled = false;
                    document.getElementsByName("multiplayer")[1].disabled = false;
                    document.getElementsByName("help")[0].disabled = false;
                    break;
                default:
                    break;
            }
        }

        if (e.target.parentNode.children[0].innerHTML.toLowerCase().includes("obtížnost")) {

            switch (e.target.value) {
                case "Lehká":
                    DIFICULTY.MAX_DISTANCE = DISTANCE.SHORT;
                    break;
                case "Střední":
                    DIFICULTY.MAX_DISTANCE = DISTANCE.MEDIUM;
                    break;
                case "Těžká":
                    DIFICULTY.MAX_DISTANCE = DISTANCE.LONG;
                    break;
                default:
                    break;
            }
        }
    }

    generateNewMap() {
        window.UI.clearMap();
        window.game = new Game();
    }


    showAchievement(text, imgPath) {

        if (document.getElementById("achievement") != null) {
            return;
        }

        let div = document.createElement("div");
        div.setAttribute("id", "achievement");


        let divCont = document.createElement("div");
        divCont.setAttribute("id", "achievementContent");
        divCont.setAttribute("class", "hide");

        let cross = document.createElement("div");
        cross.setAttribute("id", "cross");
        cross.innerHTML = "&#10006;";
        divCont.appendChild(cross);


        divCont.onclick = function () {

            document.getElementById("achievementContent").classList.add("hide");

            setTimeout(() => { document.getElementById("achievement").remove() }, 1000);

        };

        let img = document.createElement("div");
        img.setAttribute("id", "achievementImg");
        img.style.backgroundImage = "url(" + imgPath + ")";

        divCont.appendChild(img);

        let txt = document.createElement("div");
        txt.setAttribute("id", "achievementText");
        txt.innerHTML = text;
        if (text.length < 100)
            txt.style.fontSize = "1.4vw";

        divCont.appendChild(txt);

        div.appendChild(divCont);

        document.body.appendChild(div);

        setTimeout(() => {
            document.getElementById("achievementContent").classList.remove("hide");
        }, 100);




    }

    /**
     * @param {Array} Arguments = stringové hodnoty path img, ze kterých chceme dát uživately navybranou.
     */
    showPlayerSelect() {

        if (document.getElementById("achievement") != null) {
            return;
        }

        let div = document.createElement("div");
        div.setAttribute("id", "achievement");


        let divCont = document.createElement("div");
        divCont.setAttribute("id", "achievementContent");
        divCont.setAttribute("class", "hide");

        let cross = document.createElement("div");
        cross.setAttribute("id", "cross");
        cross.innerHTML = "&#10006;";
        divCont.appendChild(cross);


        cross.onclick = function () {

            document.getElementById("achievementContent").classList.add("hide");

            setTimeout(() => { document.getElementById("achievement").remove() }, 1000);

        };

        let text = document.createElement("div");
        text.setAttribute("id", "playerSelectText");
        text.innerHTML = "Vyber si za koho chceš hrát."

        divCont.appendChild(text);

        for (let i = 0; i < arguments.length; i++) {
            let img = document.createElement("div");
            img.setAttribute("id", "playerImg");
            img.style.backgroundImage = "url('" + arguments[i] + "')";
            img.style.width = (100 / arguments.length) - 1 + "%";

            img.onclick = function (e) {
                e.target.classList.remove("blackAndWhite");
                e.target.classList.add("selectSkin");

                let img = e.target.style.backgroundImage;
                for (let i = 0; i < e.target.parentNode.children.length; i++) {
                    if (e.target.parentNode.children[i].id == "playerImg") {
                        if (e.target.parentNode.children[i].style.backgroundImage != img) {
                            e.target.parentNode.children[i].classList.add("blackAndWhite");
                            e.target.parentNode.children[i].classList.remove("selectSkin");
                        }
                    }
                }

                if (document.getElementById("selectButton") == null) {
                    let butt = window.UI.getGraphic(POSITON.VERTICAL, "Pokračovat", "button", 1, "id/selectButton");
                    butt.children[1].remove();
                    butt.children[0].onclick = function () {

                        document.getElementById("player").style.backgroundImage = document.getElementsByClassName("selectSkin")[0].style.backgroundImage;
                        document.getElementById("cross").dispatchEvent(new Event("click"));
                    }
                    e.target.parentNode.appendChild(butt);
                }
            }

            divCont.appendChild(img);
        }


        div.appendChild(divCont);

        document.body.appendChild(div);

        setTimeout(() => {
            document.getElementById("achievementContent").classList.remove("hide");
        }, 100);
    }


    saveCookieScoreBoard() {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();

        var date = new Date(year + 5, month, day);
        var expires = "; expires=" + date.toGMTString();

        document.cookie = "Title=©GAMEbyFROLÍK©;" + expires;

        for (let j = 0; j < this.scoreBoard.length; j++) {
            let value = "";
            for (let i = 0; i < this.scoreBoard[j].length; i++) {
                if (this.scoreBoard[j][i] != "") {
                    value += this.scoreBoard[j][i] + "/";
                }
            }
            document.cookie = j + "=" + value + expires;
        }
    }

    loadCookieScoreBoard() {
        let cookie = decodeURIComponent(document.cookie);
        if (cookie.includes("©GAMEbyFROLÍK©")) {
            let data = cookie.split(";");
            for (let j = 0; j < data.length; j++) {
                if (!isNaN(parseInt(data[j].split("=")[0]))) {
                    this.scoreBoard[parseInt(data[j].split("=")[0])] = data[j].split("=")[1].split("/") == "" ? [] : data[j].split("=")[1].split("/");
                }
            }
        }
        else {
            for (let j = 0; j < GAME_MODE.length; j++) {
                this.scoreBoard[j] = [];
            }
            setTimeout(() => { ACHIEVEMENT("Děkuji, že jste si přišli zahrát, hra má několik herních režimů, které nemusí odpovídat skutečnostem. Součástí je i herní režim EDU, který slouží jako edukační pro všechny kteří se chtějí vzdělat ohledně COVID-19.<br> Web nemá za cíl nikoho poškodit, ani zesměšnit či pohoršit. <br>Přeji příjemnou hru.<br> <br>Zavřením toho okna souhlasíte s používání cookies", "img/copyright.png") }, 100);
        }
    }
}