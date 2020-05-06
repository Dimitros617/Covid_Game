const TITLE = "GAME | COVID-19";
const PEOPLE_INFECTED_DAY = 4; // Počet dní před tím než zemřou

const SCORE_DATA_DEFAULT = {

    SCORE: 10,
    INFECTED: new Array(),
    DEAD: 0,
    HEAL: 0,
    MORTALITY: 50,
    CURE: 0,

};

const SCORE = x => document.getElementById("score").innerHTML = x > 1000000 ? (x / 1000000).toFixed(2) + "M" : x > 1000 ? (x / 1000).toFixed(2) + "K" : x;
const MORTALITY = x => document.getElementById("mortality").innerHTML =  x > 100 ? 100 + "%": x + "%";
const CURE = x => document.getElementById("cure").innerHTML = x > 100 ? 100 + "%": x + "%";
const INFECTED = x => document.getElementById("infected").innerHTML = x > 1000 ? (x / 1000).toFixed(2) + "K" : x;
const DEAD = x => document.getElementById("dead").innerHTML = x > 1000 ? (x / 1000).toFixed(2) + "K" : x;
const HEAL = x => document.getElementById("Heal").innerHTML = x > 1000 ? (x / 1000).toFixed(2) + "K" : x;

const NEWS = x => document.getElementById("text").innerHTML = x;
const ROUND = x => document.getElementById("round").innerHTML = "KOLO - " + x;

const ACHIEVEMENT = (text, img) => window.UI.showAchievement(text, img);
/**
 * 
 * @param {Boolean} x = true, pokud cheme zobrazi loadin, nebo false pokud ho chcem ukončit
 * @param {String} y = Co má být jako zpráva loadingu
 */
const LOADING = (x, y) => {
    if (y != undefined) document.getElementById("loadingText").innerHTML = y;
    document.getElementById("loading").style.opacity = x == true ? "1" : "0";
}


const MAP_TABLE = document.getElementById("map");
const DIV_INFO = document.getElementById("info");
const ADD_MORTALITY = document.getElementById("addMortality");
const ADD_CURE = document.getElementById("addCure");


const SCORE_DATA = {

    SCORE: SCORE_DATA_DEFAULT.SCORE,
    INFECTED: SCORE_DATA_DEFAULT.INFECTED,
    DEAD: SCORE_DATA_DEFAULT.DEAD,
    HEAL: SCORE_DATA_DEFAULT.HEAL,
    MORTALITY: SCORE_DATA_DEFAULT.MORTALITY,
    CURE: SCORE_DATA_DEFAULT.CURE,

    onIndex(x) {
        switch (x) {
            case 3:
                return this.SCORE;
            case 4:
                return this.INFECTED.length;
            case 5:
                return this.DEAD;
            case 6:
                return this.HEAL;
            case 7:
                return this.MORTALITY;
            case 8:
                return this.CURE;
            default:
                return null;
        }
    }
};


const MAP_SIZE = {

    EASY: 12,
    MEDIUM: 16,
    HARD: 20,

    onIndex(x) {
        switch (x) {
            case 0:
                return this.EASY;
            case 1:
                return this.MEDIUM;
            case 2:
                return this.HARD;

            default:
                break;
        }
    },

    toString(x) {
        switch (x) {
            case 0:
                return "Malá 12x12";
            case 1:
                return "Střední 16x16";
            case 2:
                return "Velká 20x20";
            default:
                break;
        }
    }
};

const SHOW_TOOLTIP = {

    EVERY_STEP: 0,
    EVERY_CATCH: 1,
    NEVER: 2,

    onIndex(x) {
        switch (x) {
            case 0:
                return this.EVERY_STEP;
            case 1:
                return this.EVERY_CATCH;
            case 2:
                return this.NEVER;

            default:
                break;
        }
    },
};

const MULTIPLAYER = {

    FALSE: 0,
    TRUE: 1,

};

const GAME_MODE = {

    ARCADE: 0,
    ONE_POINT: 1,
    EDUCATION: 2,

};

const DIFICULTY = {

    MAP_SIZE: MAP_SIZE.MEDIUM,
    MULTIPLAYER: MULTIPLAYER.FALSE,
    SHOW_TOOLTIP: SHOW_TOOLTIP.EVERY_STEP,
    GAME_MODE: GAME_MODE.ARCADE,

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

    SCORE: 3,
    INFECTED: 4,
    DEAD: 5,
    HEAL: 6,
    MORTALITY: 7,
    CURE: 8,

};

const DIRECTION = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
};

const ITEMTYPE = {

    HUMAN: "human",
    GROUP: "group",
    GROUP_SIZE: 5,
    CURE: "cure",
    CURE_VALUE: 10, // O kolik procent klesne léčba, když hráč sebere item
    MORTALITY: "mortality",
    MORTALITY_VALUE: 10, // O kolik procen vzroste umrtnost když hráč item sebere

    length: 4,

    onIndex(x) {
        switch (x) {
            case 0:
                return this.HUMAN;
            case 1:
                return this.GROUP;
            case 2:
                return this.CURE;
            case 3:
                return this.MORTALITY;
            default:
                return null;
        }
    }

};

const POSITON = {
    VERTICAL: 0,
    HORIZONTAL: 1,
}

const RANDOM_NUMBER = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
























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


