/**
 * @description Container pro itemy obsahující jejich obtížnost pozici v mapě vzdálenost hráče k itemu a validního souseda pro Multiplayer
 * @author Dominik Frolík
 * @see www.dominikfrolik.cz
 */
class Item {

    /**
     * Založení instace Itemu
     * @param {Point} position 
     * @param {Int} dificulty 
     * @param {Int} distance 
     * @param {Enum} type 
     * @param {Point} validNeighbour 
     */
    constructor(position, dificulty, distance, type, validNeighbour) {

        this.position = position;// Point - pozice v mapě na které semá daný item vykreslit 
        this.dificulty = dificulty; // Obtížnost itemu
        this.immunity = this.dificulty; // Dle obtížnosti životnost itemu (dekrementuje se po stoupnutí na item)
        this.distance = distance; // Vzdálenost hráče od itemu
        this.type = type; //Enum typ itemu
        this.liveSpan = PEOPLE_INFECTED_DAY; // hondota jak dlouho má item, pokud se jedná o typ human nebo group zůstat infekční (počet kol), potom co je item sebrán
        this.drawPath = false; //Boolena = hodnota za je k itemu aktuálně vykreslená cesta
        this.validNeighbour = validNeighbour;// Validní pozice, na kterou lze stoupnout pouze v multiplayeru 
    }

}
