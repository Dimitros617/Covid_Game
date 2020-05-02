const TITLE = "GAME | COVID-19";
const PEOPLE_INFECTED_DAY = 4; // Počet dní před tím než zemřou
const START_SCORE = 100;


const SCORE = x => document.getElementById("score").innerHTML = x;
const INFECTICITY = x => document.getElementById("Infecticity").innerHTML = x + "%";
const HEALING = x => document.getElementById("Healing").innerHTML = x + "%";
const INFECTED = x => document.getElementById("infected").innerHTML = x;
const DEAD = x => document.getElementById("dead").innerHTML = x;
const HEAL = x => document.getElementById("Heal").innerHTML = x;

const NEWS = x => document.getElementById("text").innerHTML = x;
const ROUND = x => document.getElementById("round").innerHTML = "KOLO - " + x;

const MAP_TABLE = document.getElementById("map");


const MAP_SIZE = {
    EASY: 12,
    MEDIUM: 16,
    HARD: 20,
};

const SHOW_TOOLTIP = {
    EVERY_STEP: 0,
    EVERY_CATCH: 1,
    NEVER: 2,
};

const MULTIPLAYER = {
    FALSE: 0,
    TRUE: 1,
};

const DIFICULTY = {
    MAP_SIZE: MAP_SIZE.MEDIUM,
    MULTIPLAYER: MULTIPLAYER.FALSE,
    SHOW_TOOLTIP: SHOW_TOOLTIP.EVERY_STEP,
};

const RETURN = {
    BOOLEAN: 0,
    OBJECT: 1,
    COUNT: 2,
    DRAW: 3,
    PATH: 4,
};

const TYPE = {
    ALL: 0,
    LAST: 1,
    RAND: 2,
};

const ITEMTYPE = {
    HUMAN: "human",
    GROUP: "group",
    INFECTICITY: "infecticity",

    length: 3,

    onIndex(x) {
        switch (x) {
            case 0:
                return this.HUMAN;
            case 1:
                return this.GROUP;
            case 2:
                return this.INFECTICITY;
            default:
               return null;
        }
    }
};
























function loadCookie() {

    /*
        if (document.cookie == ""){
        alert("Vítejte, stránka se pravidelně aktualizuje každých 5 min. Pokud Vám na stránce něco chybí nebo nefunguje kontaktujte mě. Jo a mimochodem web používá cookies, takže kliknutím na OK je potvrzujete.")
        return;
    }

    var data ="";
    var rawData = document.cookie.split(';');

    for(var i = 0 ; i < rawData.length; i++)
        if(rawData[i].includes("©FROLÍK"))
            data = rawData[i];


    if(data.length == 0){
        getElement("mainNakazenych").value = 0;
        return;
    }
    data = data.split('|');
    data.pop();

    getElement("mainNakazenych").value = parseInt(data[0]);
    zmenaCount(getElement("mainNakazenych"));


    for (var i = 1; i <= 3; i++) {

        var el = document.getElementById(("box" + i)).children[0];
        if (data[i].length == 1) {

            el.value = data[i];
            zmenaBox(el, ('box' + i));
        }
        else {

            el.value = data[i].split(':')[0];
            zmenaBox(el, ('box' + i));
            var el2 = document.getElementById(('box' + i)).children[1].children[0];
            var hodnota = data[i].split(':')[1]
            el2.value = hodnota;

            var options = el2.options;
            for (var j = 1; j< options.length; j++) {
                if (options[j].value == hodnota) {
                    el2.selectedIndex = j;
                    break;
                }
            }
            
            zmenaKraje(el2);
        }
    }*/
}

function saveAll() {

    /*var a = getElement("mainNakazenych").value;
    var str = (a == ""? 0: a) + "|";

    for (var i = 1; i <= 3; i++) {

        var id = 'box' + i;
        var value = document.getElementById(id).children[0].value == null ? "x" : document.getElementById(id).children[0].value;
        var secondValue = "";
        if (value == "1") {
            secondValue = document.getElementById(id).children[1].children[0].value;
            secondValue = secondValue == null ? ":" + 0 : ":" + secondValue;
        }
        var str = str + value + secondValue + "|";
    }

    var str = str + "©FROLÍK";
    deleteAllCookies();
    document.cookie = str + ";max-age=604800";*/
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}


