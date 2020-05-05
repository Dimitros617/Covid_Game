class UI {

    constructor() {

        this.expand = false;
        DIV_INFO.appendChild(this.getResizer());
        DIV_INFO.children[0].appendChild(new Option("Pravidla", 0, true, true));
        DIV_INFO.children[0].appendChild(new Option("Nastavení", 1, false, false));

        this.infoChange(DIV_INFO.children[0]);



    }

    infoChange(e) {

        if (e.value == 0) {
            this.clear();
            DIV_INFO.appendChild(this.getRules());
        }
        else if(e.value == 1){
            this.clear();
            DIV_INFO.appendChild(this.getSeting());
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
        if(document.getElementById("content") != null){
            document.getElementById("content").remove();
        }
    }


    getRules() {

        let div = document.createElement("div");
        div.setAttribute("id", "content");

        let ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<p>Covid-Game vlastně vůbec nen&iacute; hra, ale <strong>optimalizačn&iacute; &uacute;loha</strong>, ve kter&eacute; m&aacute;te za &uacute;kol pomoci viru naj&iacute;t cestu k c&iacute;li. <strong>Pohybuj&iacute;c&iacute;</strong> se virus se může <strong>zastavit pouze o zeď nebo někter&eacute;ho kamar&aacute;da</strong> (jin&yacute; virus). Dostat je rychle tam, kam potřebujeme, nen&iacute; proto vůbec jednoduch&eacute;. Do <strong>celkov&eacute;ho skore</strong> se započ&iacute;t&aacute;v&aacute; <strong>počet tahů</strong> (každ&yacute; krok ubere 1 bod) a počet <strong>nakažen&yacute;ch lid&iacute;</strong>.</p><p>Každ&yacute; nakažen&yacute; přid&aacute; tolik bodů, jak&aacute; byla jeho vzd&aacute;lenost od posledn&iacute;ho sebran&eacute;ho itemu, pot&eacute; trv&aacute; 4 kola, než dojde k tomu, že s danou pravděpodobnost&iacute; (&Uacute;MRTNOST) zemře, v tom př&iacute;padě znovu přid&aacute; score o 1/2 jeho vzdalenosti, nebo se vyl&eacute;č&iacute; v tom př&iacute;padě se ubere score rovno jeho vzd&aacute;lenosti. Po celou dobu, co je nakažen&yacute; m&aacute; každ&eacute; kolo danou pravděpodobnost&iacute; (NAKAŽLIVOST) nakaz&iacute; dal&scaron;&iacute;ho člověka, kter&yacute; bude m&iacute;t stejnou hodnotu score, jako ten co ho nakazil.</p><p><em> (Např. nakaz&iacute;m člověka kter&yacute; byl vzd&aacute;len 10 kroků, score se zvět&scaron;&iacute; o 10, každ&eacute; kolo m&aacute;m &scaron;anci že přibyde dal&scaron;&iacute; nakažen&yacute;, kter&yacute; mi přid&aacute; dal&scaron;&iacute;ch 10 bodů score. Po 4 dnech, buďto zemře, (přid&aacute; 5 bodů) nebo se uzdrav&iacute; (Odebere 10 bodů).</em></p>";
        div.appendChild(ruleText);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleText");
        ruleText.innerHTML = "<p><strong>FUNKCE</strong></p><p>Poukud <strong>najedete my&scaron;&iacute; zobraz&iacute; se V&aacute;m vzd&aacute;lenost k dan&eacute;mu itemu,</strong> v <strong>nastaven&iacute;</strong> lze nastavit, zda se bude vzd&aacute;lenost zobrazovat z <strong>aktu&aacute;ln&iacute; pozice</strong> na mapě, nebo se zobraz&iacute; jen vzd&aacute;lenost, od <strong>posledn&iacute;ho sebran&eacute;ho itemu</strong>, či <strong>nikoliv</strong>.</p><p>Pokud <strong>klikneme</strong> na item <strong>2x</strong> (Double klik) za body si můžeme <strong>koupit cestu.</strong> Zobrazen&iacute; cesty z jak&eacute;hokoliv m&iacute;sta na mapě stoj&iacute; <strong>20 bodů.</strong></p><p>Cesta zmiz&iacute;, když je item sebr&aacute;n, nebo dal&scaron;&iacute;m dvojklikem na item (Smaz&aacute;n&iacute; je <strong>zdarma</strong>).</p>";
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
        img.style.backgroundImage = "url(img/infecticity.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Šíření přidá 10% pravděpodobnosti NAKAŽLIVOSTI.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id", "imgPreviewLong");
        img.style.backgroundImage = "url(img/rip.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id", "ruleTextSecond");
        ruleText.innerHTML = "<p>Hrobeček přidá 10% pravděpodobnosti ÚMRTNOSTI.</p>";
        div.appendChild(ruleText);



        return div;
    }

    getSeting() {

        let div = document.createElement("div");
        div.setAttribute("id", "content");

        div.appendChild(this.getGraphic(POSITON.VERTICAL,"1 Hráč: ","input/radio/multiplayer/true",2,"disabled/"));
        div.appendChild(this.getGraphic(POSITON.VERTICAL,"2 Hráči: ","input/radio/multiplayer",2,"disabled/"));
        div.appendChild(this.getGraphic(POSITON.VERTICAL,"Velikost mapy: Střední 16x16","input/range/map_size/1", 1,"min/0/max/2"));
        div.appendChild(this.getGraphic(POSITON.HORIZONTAL,"Nápovědy: ","input/checkbox/help/true",0,"title/Při najetí na item se zobazí jak je daleko"));
        div.appendChild(this.getGraphic(POSITON.HORIZONTAL,"Přepočítat: ","select/Každý krok/Jen při chycení/helpType/",0,"title/Při najetí na item se zobazí jak je daleko, tímto nastavením určíte kdy se má vzdálenost přepočítat."))
        //div.appendChild(this.getGraphic(POSITON.HORIZONTAL,"Inkubační doba: ","input/number/incubation/4",0,"min/1/title/Jak dlouho trvá než se z akažené stane mrví nebo vyléčený."));


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

    clearMap(){

        for(let i = MAP_TABLE.children.length; i > 0; i--){
            MAP_TABLE.children[0].remove();
        }
        debugger;
    }


    changeElement(e){

        if(e.target.parentNode.children[0].innerHTML.toLowerCase().includes("velikost mapy")){
            DIFICULTY.MAP_SIZE = MAP_SIZE.onIndex(parseInt(e.target.value));
            window.UI.clearMap();
            window.game = new Game();
            e.target.parentNode.children[0].innerHTML = "Velikost mapy: " + MAP_SIZE.toString(parseInt(e.target.value));
        }

        if(e.target.parentNode.children[0].innerHTML.toLowerCase().includes("nápovědy")){
            if(e.target.checked){
                document.getElementsByName("helpType")[0].parentNode.style.display = "inherit";
                DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.onIndex(document.getElementsByName("helpType")[0].value == "Každý krok" ? 0: 1);
                window.game.map.drawItems();
            }
            else{
                document.getElementsByName("helpType")[0].parentNode.style.display = "none";
                DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.NEVER;
                window.game.map.drawItems();
            }
        }

        
        if(e.target.parentNode.children[0].innerHTML.toLowerCase().includes("přepočítat")){
            debugger;
            DIFICULTY.SHOW_TOOLTIP = SHOW_TOOLTIP.onIndex(e.target.value == "Každý krok" ? 0: 1);
            window.game.map.drawItems();
        }

    }

    generateNewMap(){
        window.UI.clearMap();
        window.game = new Game();
    }


    showAchievement(text, imgPath){

        if(document.getElementById("achievement") != null){
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


        divCont.onclick = function(){

            document.getElementById("achievementContent").classList.add("hide");

            setTimeout(() => {document.getElementById("achievement").remove()}, 1000);

        };

        let img = document.createElement("div");
        img.setAttribute("id", "achievementImg");
        img.style.backgroundImage = "url(" + imgPath + ")";

        divCont.appendChild(img);

        let txt = document.createElement("div");
        txt.setAttribute("id", "achievementText");
        txt.innerHTML = text;

        divCont.appendChild(txt);

        div.appendChild(divCont);

        document.body.appendChild(div);

        setTimeout(() => {
            document.getElementById("achievementContent").classList.remove("hide");
        },100);


        

    }

}