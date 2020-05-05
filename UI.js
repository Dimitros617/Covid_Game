class UI {

    constructor() {

        DIV_INFO.appendChild(this.getResizer());
        DIV_INFO.children[0].appendChild(new Option("Pravidla",0,true,true));
        DIV_INFO.children[0].appendChild(new Option("Nastavení",1, false, false));

        this.infoChange(DIV_INFO.children[0]);

    }

    infoChange(e){

        if(e.value == 0){
            this.clear();
            DIV_INFO.appendChild(this.getRules());
        }

    }

    getResizer(){

        let div = document.createElement("div");
        div.setAttribute("id","resizer");
        div.innerHTML = "Zvětšit";

        div.onclick = function(e){

            let list = DIV_INFO.classList;

            if(list.length == 0){
                DIV_INFO.classList.add("expand");
                DIV_INFO.children[2].classList.add("expand");
                e.target.innerHTML = "Zmenšit";
            }
            else{
                DIV_INFO.classList.remove("expand");
                DIV_INFO.children[2].classList.remove("expand");
                e.target.innerHTML = "Zvětšit";
            }

        }

        return div;

    }

    clear(){

    }


    getRules(){

        let div = document.createElement("div");
        div.setAttribute("id","content");

        let ruleText = document.createElement("div");
        ruleText.setAttribute("id","ruleText");
        ruleText.innerHTML = "<p>Covid-Game vlastně vůbec nen&iacute; hra, ale <strong>optimalizačn&iacute; &uacute;loha</strong>, ve kter&eacute; m&aacute;te za &uacute;kol pomoci viru naj&iacute;t cestu k c&iacute;li. <strong>Pohybuj&iacute;c&iacute;</strong> se virus se může <strong>zastavit pouze o zeď nebo někter&eacute;ho kamar&aacute;da</strong> (jin&yacute; virus). Dostat je rychle tam, kam potřebujeme, nen&iacute; proto vůbec jednoduch&eacute;. Do <strong>celkov&eacute;ho skore</strong> se započ&iacute;t&aacute;v&aacute; <strong>počet tahů</strong> (každ&yacute; krok ubere 1 bod) a počet <strong>nakažen&yacute;ch lid&iacute;</strong>.</p><p>Každ&yacute; nakažen&yacute; přid&aacute; tolik bodů, jak&aacute; byla jeho vzd&aacute;lenost od posledn&iacute;ho sebran&eacute;ho itemu, pot&eacute; trv&aacute; 4 kola, než dojde k tomu, že s danou pravděpodobnost&iacute; (&Uacute;MRTNOST) zemře, v tom př&iacute;padě znovu přid&aacute; score o 1/2 jeho vzdalenosti, nebo se vyl&eacute;č&iacute; v tom př&iacute;padě se ubere 2/3 jeho vzdalenosti. Po celou dobu, co je nakažen&yacute; m&aacute; každ&eacute; kolo danou pravděpodobnost&iacute; (NAKAŽLIVOST) nakaz&iacute; dal&scaron;&iacute;ho člověka, kter&yacute; bude m&iacute;t stejnou hodnotu score, jako ten co ho nakazil.</p><p><em> (Např. nakaz&iacute;m člověka kter&yacute; byl vzd&aacute;len 10 kroků, score se zvět&scaron;&iacute; o 10, každ&eacute; kolo m&aacute;m &scaron;anci že přibyde dal&scaron;&iacute; nakažen&yacute;, kter&yacute; mi přid&aacute; dal&scaron;&iacute;ch 10 bodů score. Po 4 dnech, buďto zemře, (přid&aacute; 5 bodů) nebo se uzdrav&iacute; (Odebere 7 bodů).</em></p>";
        div.appendChild(ruleText);


        let img = document.createElement("div");
        img.setAttribute("id","imgPreview");
        img.style.backgroundImage = "url(img/humans.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id","ruleTextSecond");
        ruleText.innerHTML = "<p>Člověk bez roušky se nakazí ihned po stoupnutí na jeho pozici.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id","imgPreview");
        img.style.backgroundImage = "url(img/humansDefend.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id","ruleTextSecond");
        ruleText.innerHTML = "<p>Člověk s rouškou si ji po stoupnutí na jeho pozici sundá, a je nutné buďto počkat jedno kolo na místě, nebo se na pole vrátit jindy.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id","imgPreviewLong");
        img.style.backgroundImage = "url(img/0.0.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id","ruleTextSecond");
        ruleText.innerHTML = "<p>Skupinkase počítá jako 5* člověk bez roušky.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id","imgPreviewLong");
        img.style.backgroundImage = "url(img/infecticity.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id","ruleTextSecond");
        ruleText.innerHTML = "<p>Šíření přidá 10% pravděpodobnosti NAKAŽLIVOSTI.</p>";
        div.appendChild(ruleText);

        img = document.createElement("div");
        img.setAttribute("id","imgPreviewLong");
        img.style.backgroundImage = "url(img/rip.png)";
        div.appendChild(img);

        ruleText = document.createElement("div");
        ruleText.setAttribute("id","ruleTextSecond");
        ruleText.innerHTML = "<p>Hrobeček přidá 10% pravděpodobnosti ÚMRTNOSTI.</p>";
        div.appendChild(ruleText);



        return div;
    }

    getSeting(){
        
    }

}