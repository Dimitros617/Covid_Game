class Player {

    map;
    position;

    me;

    constructor(map, name) {

        this.map = map;

        this.position = new Point(0, 0);
        this.me = document.createElement("div");
        this.me.setAttribute("id", "player");
        this.me.setAttribute("name", name);
        MAP_TABLE.appendChild(this.me);
        this.initMe();
    }

    initMe(){
        this.me.onclick = function(e){
            if(DIFICULTY.MULTIPLAYER == MULTIPLAYER.TRUE){
            window.game.flipPlayers(e.target.getAttribute("name"));
            window.game.secondPlayer.me.classList.add("blackAndWhite");
            window.game.player.me.classList.remove("blackAndWhite");
            window.game.map.player = window.game.player;
            window.game.map.setAvailableDirection(window.game.map.player.position);
            }
        };
    }


    moveTo(point) {

        this.position = point;
        let x = this.map.map.getBoundingClientRect().width / this.map.size;
        let y = this.map.map.getBoundingClientRect().height / this.map.size;
        this.me.style.marginLeft = x * point.x + x / 2 - this.me.getBoundingClientRect().width / 2;
        this.me.style.marginTop = y * point.y + y / 2 - this.me.getBoundingClientRect().height / 2;
        this.map.setAvailableDirection(this.position);
    }

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
