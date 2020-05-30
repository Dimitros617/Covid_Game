/**
 * @description Metoda se stará o grafické i funkční ovládání a vykreslování hráče 
 * @author Dominik Frolík
 * @see www.dominikfrolik.cz
 */
class Player {

    map; // Intace třídy Map
    position; // Instance třídy Point obsahující aktuální pozici hráče v mapě

    me; // Pointer na HTML element hráče

    /**
     * @description donstuktor nastaví pozici hráče na X0: Y0 vytvoří div a graficky ho nastaví do HTML
     * @param {Map} map = Instance mapy na kterou se má hráč vykreslovat
     * @param {String} name = name atribut elementu player 
     */
    constructor(map, name) {

        this.map = map;

        this.position = new Point(0, 0);
        this.me = document.createElement("div");
        this.me.setAttribute("id", "player");
        this.me.setAttribute("name", name);
        MAP_TABLE.appendChild(this.me);
        window.easterEggPlayerCounter = 0;

        this.initMe();
    }


    /**
     * @description inicializace click eventu pro element hráče v HTML
     */
    initMe(){
        this.me.onclick = function(e){

            if(window.easterEggPlayerCounter++ == 10){
                ACHIEVEMENT("Aktivoval si tajný bonus a získáváš + 10 bodů", "img/copyright.png");
                SCORE((SCORE_DATA.SCORE+=10));
            }
            if(DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE){
            window.game.flipPlayers(e.target.getAttribute("name"));
            window.game.secondPlayer.me.classList.add("blackAndWhite");
            window.game.player.me.classList.remove("blackAndWhite");
            window.game.map.player = window.game.player;
            window.game.map.setAvailableDirection(window.game.map.player.position);
            }
        };
    }


    /**
     * @description grafická změna pozice hráče v mapě, a následné vykreslení validních pozic z dané pozice
     * @param {Point} point = pozice na kterou se má hráč posunout
     */
    moveTo(point) {

        this.position = point;
        let x = this.map.map.offsetWidth / this.map.size;
        let y = this.map.map.offsetHeight / this.map.size;
        this.me.style.marginLeft = x * point.x + x / 2 - this.me.getBoundingClientRect().width / 2;
        this.me.style.marginTop = y * point.y + y / 2 - this.me.getBoundingClientRect().height / 2;
        this.map.setAvailableDirection(this.position);
    }


    /**
     * @description mapa slouží k přesunu hráče na náhodnou validní pozici, která neobsahuje žádný item.
     */
    resetPosition() {
        let randValidPoint = this.map.allValidPosition[RANDOM_NUMBER(0, this.map.allValidPosition.length - 1)];
        if (this.map.item.length != 0) {
            do {
                randValidPoint = this.map.allValidPosition[RANDOM_NUMBER(0, this.map.allValidPosition.length - 1)];
                console.log("Nalezen random point validní, hledám nové místo pro hráče");
            } while (this.map.isItemOnPoint(randValidPoint) || (window.game.player.x == randValidPoint.x && window.game.player.y == randValidPoint.y))
        }
        else {
            this.position = new Point(randValidPoint.x, randValidPoint.y);
            this.moveTo(this.position);
        }
    }

}
