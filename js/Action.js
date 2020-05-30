/**
 * @description Třída slouží jako kontainer pro uložení akcí, podle který se řídí celá hra. Podle aktuálního score či kola se ve hře začnou generovat daný počet itemů daného typu obtížnosti, a zprávy pro uživatele
 * @author Dominik Frolík
 * @see www.dominikfrolik.cz
 */
class Action {

    /**
     * @description Založení intance Akce
     */
    constructor(typeOfScore, value, news, itemCount, chance, type, repeat) {
        this.typeOfScore = typeOfScore; //Enum pro typ score kdy se má akce vykonat
        this.value = value;// Hodnata score při které se má vykonat, pokud je <0 akce se vykoná pokud je hodnota menší, pokud je >=0 akce se vykoná pokud je hodnota větší nebo rovna dané hodnotě
        this.news = news; // Zpráva vypisující se uživately do řádku ŽÍVĚ
        this.itemCount = itemCount; //Počet itemů, které se mají začít vykreslovat v mapě 
        this.dificulty = type == ITEMTYPE.HUMAN ? chance <= RANDOM_NUMBER(0,100) ? 0 : 1 : 0; // Obtížnost itemu pokud je k dyspozici
        this.type = type; // Typ itemu který cheme vykreslovat
        this.repeat = repeat; // Boolean - Opakování zda se má počet itemů vykreslit jen jednorázově a po sebrání hráčem se již nebudou generovat dále
    }

}
