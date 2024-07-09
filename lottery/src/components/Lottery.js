import { useState, useEffect } from "react";

function Lottery() {
    //ebbe gyüjtjük majd a mi számainkat 
    const [userNumbers, setUserNumbers] = useState([]);
    //ezeket fogjuk random legenerálni és ezek ellen fogunk játszani
    const [randomNumbers, setRandomNumbers] = useState([]);
    //ezek, hogy mennyi a találat ha megegyezik a random meg a userNumbers!!
    const [hits, setHits] = useState(0);
    //hogy elkezdődött-e már a játék
    const [started, setStarted] = useState(false);
    //a tábla legeneráláséához kell majd 
    const [numbers, setNumbers] = useState([]);

    /*
    Ez lesz amikor ki tudjuk majd választani a számot, úgyhogy rákattintunk majd a cellre és abból kell nekünk az innerText, ami bele van írva 
    tehát ez a függvény vár egy cell-t 
    */
    const cellClick = (cell) => {
        //lementjük, hogy mi az a szám, ami benne van a cell-be és majd ezt tesszük bele a mi userNumbers tömbünkbe!!!
        const n = parseInt(cell.innerText);
        //ezt a class-ot fogja megkapni az egész cell, hogy tudjuk, hogy melyik van már kiválasztva melyik nincsen!!! 
        //ez majd kell a feltételeknél is, hogy melyiket tudjuk belerakni a tömbbe, amin nincsen ez a highlighted class
        const highlighted = cell.classList.add("highlighted");

        /*
        Itt lesz majd két kikötés az egyik az, hogy nem lehet több mint 5 elemü a userNumbers tömb és, hogy nem lehet olyat belerakni 
        ami highlighted, vagyis ha olyanra kattintunk ami highlighted, akkor azt az else if ágban ki fogjuk venni a tömbünkből
        */
        if (!highlighted && userNumbers.length < 5) {
            /*
            ha megfelelt a két feltételnek, hogy nem highlighted és a tömbünknek a length-je az kisebb, mint 5, akkor belerakja 
            2 dolgot kell itt csinálni
            1. belerakni a tömbbe a setUserNumbers-vel, ahol kibontjuk az eddigi tömböt a spread operator-val és beletesszük az új
                elemet, ami itt nekünk az n! vagyis a cell-nek, amit megkap ez a függvény annak az innerText-je parseInt-elve!!! 
            2. rárakni a highlighted class-t a cell-re, mert így tudjuk, hogy az már benne van a tömbbe!! 
            */
            //class rárakása
            cell.classList.add("highlighted");
            //belerakjuk a tömbbe a setUserNumbers-vel a userNumbers tömbbe 
            setUserNumbers([...userNumbers, n]);
        } else if (highlighted) {
            /*
            ha viszont highlighted, akkor meg kell keresni index alapján, hogy melyik cell az amit ki akarunk szedni 
                ezt az indexOf() segítségével tudjuk meg, hogy megadjuk neki az n-t, hiszen az a cell amit itt meg fog kapni a függvény
                és a splice-val meg az index alapján kiszedjük 
            */
            //így találjuk meg a tömbben, hogy melyik elemrők van szó 
            const index = userNumbers.indexOf(n);
            /*
            kiszedés 4 részből áll 
            1. csinálunk egy új array-t
            2. kiszedjük az új array-ből a megfelelő indexű elemet 
            3. a set-vel megadjuk ezt az új tömböt a réginek, tehát a userNumberst set-eljük az új tömbbel
            4. a legvégén levesszük róla a kijelőlést, tehát a highlighted class-t 
            */
            //új tömb a spread operator segítségével egy változóban elmentve
            const un = [...userNumbers];
            //új tömbből a splice-val kiszedjük a megfelelő elemet az index alapján 
            un.splice(index, 1);
            //ezzel az új tömbbel, amiben már nincsen benne az amit ki akartunk szedni, ezzel frissítjük a userNumbers useState-s tömbünket!!! 
            setUserNumbers(un);
            //levesszük a kijelölést
            cell.classList.remove("highlighted");

        }
    };

    /*
    Ha meg vannak a számaink, akkor ez a send függvénnyel, amit majd megadunk egy button-nak onClick-vel, ezzel beküldjük a mi
    számainkat és csak akkor generáljuk le a randomNumbers-eket!!! 
    Ez azért fontos, mert a userNumbers és a randomNumbers is ki lesz írva és ha már elöbb lenne legenerálva a randomNumbrs, mint a 
    userNumbers, akkor tudnánk, hogy mik a nyerőszámok
    */
    const send = () => {
        //fontos, hogy a kikötés, hogy még nincsen 5 (tehát a tömbnek a length-je az nem egyenlő 5-vel) eleme a userNumbers-nek, 
        //akkor rögtön return, hogy ne is menjünk tovább 
        if (userNumbers.length !== 5)
            return;
        /*
        A randomNumbers-öket a push-val fogjuk majd belerakni egy tömbbe, amit most létrehozunk és ha meg van minden szán, akkor ezzel 
        a tömbbel fogjuk majd set-elni a randomNumbers tömbünket 
        */

        const rn = [];

        while (rn.length < 5) {
            const rand = Math.floor(Math.random() * 90) + 1;
            /*
            1. Math.floor(Math.random) csinál egy random számot egy és nulla között 
            2. ezt meg kell *-ni 90-vel és akkor lesz egy random számunk 0-89 között 
            3. és ehhez majd hozzá kell adni egyet, hogy 1-90-ig legyen egy random számunk

            nagyon fontos itt a kikötés, hogy csak akkor rakjuk bele a random számunkat, tehát a rand-ot ha azt még nem tartalmazza a rn tömb
            fontos itt az includes és azt kell tagadni, mert jelen esetben azt akarjuk, hogy ne legyen benne!!!! 
            */
            if (!rn.includes(rand)) {
                rn.push(rand);
            }
            //itt frissítjük a randomNumbers tömböt, azzal a tömbbel, amit most csináltunk 
            setRandomNumbers(rn);
            //itt pedig ha meg vannak a számok, akkor started az false helyett true lesz!! 
            setStarted(true);
        }

    };

    /*
    Ez a started ez azért kellett, mert ennek a változására indul a játék és ilyenkor hasonlítjük összes, hogy mi van a tömbben 
    és ilyenkor tudjuk növelni a hits-et is, tehát mivel a started-tól függ, annak a változásától ezért erre csinálunk egy useEffect-et
    */
    useEffect(() => {
        if (!started)
            return;
        //ha a started az még false, akkor returnölünk

        setHits(0);
        //ezt fontos, hogy akkor nullázuk le amikor bejöttünk ide nem amiután összeszámoltuk, hanem majd a következő körben kell, hogy 0 legyen
        /*
        ez nagyon fontos, hogyha van két tömbünk és meg akarjuk nézni, hogy egyeznek-e az elemei, akkor végigmegyünk 
        az egyiken és minden egyes körben megnézzük, hogy az adott elem benne van-e a másik tömbben, tehát
        itt is kell a include()!!!!!!
        */
        for (const n of userNumbers) {
            if (randomNumbers.includes(n)) {
                //és ha benne van akkor növeljük a hits useState-s változónak az értékét!!! 
                setHits(h => h + 1);
            }
        }
        //és a started-ot megint false-ra állíjuk és akkor ez nem fog újra lefutni, mert az elején -> if(!started) return 
        setStarted(false);
    }, [started]);

    /*
    és lesz egy olyan gomb, hogy új játék, ilyenkor meg minden kiűrítünk a numbers-t, userNumbers-t, randomNumbers-t
    */
    const newNumbers = () => {
        setUserNumbers([]);
        setNumbers([]);
        setRandomNumbers([]);
    };

    /*
    és a numbers változására csinálunk egy useEffect-et, amiben legyártjuk az új táblát, mert ugye itt az elöbb a newNumbers-vel 
    megváltozott az állapota, ki lett űrítve, ezért itt meg kell csinálni az új táblát 
    2. fontos dolog 
    1. kikötés ha a numbers nem tartalmaz 90 elemet, akkor kell megcsinálni az új táblát 
    2. new Array(90).keys(), ezzel rakjuk bele majd a számokat 
        new Array csinál nekünk egy 90 üres elemű tömböt, keys meg egy array-nek ugye mindig az index-ek, ezért feltölti 0-89-ig!!!!
    */
    useEffect(()=> {
        if(numbers.length !== 90) {
            setNumbers(...new Array(90).keys());
            //ha meg azt akarnánk, hogy 1-90-ig legyenek a számok, akkor -> [...new Array(90).keys()].map(i => i + 1);
            //és az is fontos, hogy itt spread operator legyen a new Array előtt, hogy feltötse az array-t számokkal!! 
        }
    }, [numbers]);

    return(
        <div className="display">
            <div className="cell">
                találatok: {hits}
            </div>
            <div className="cell">
                nyertes: {randomNumbers.join(", ")}
            </div>
            <div className="lottery-numbers">
                {
                    numbers.map((n, i)=> 
                        <div key={i} onClick={(e)=>cellClick(e.target)} className="cell">
                            {n+1}
                        </div>
                    )
                }
            </div>

            <button onClick={send}>Beküldés</button>

            <button onClick={newNumbers}>Új számok</button>
        </div>
    );

}

export default Lottery;

/*
- Kell nekünk egy randomNumbers tömb, amiben generálunk számokat 1-90-ig random 
- egy userNumbers, amiben mi kiválasztjuk a tábláról, hogy melyik számot szeretnénk! 
    fontos, hogy mindig csak 5 számot max tudjunk majd kiválasztani, fontos, hogy ugyanaz a szám nem szerepelhet kétszer!!!! -> while 
    ezt majd úgy nézzük meg, hogy amit már kiválasztottunk arra rakunk egy highlighted classt és amin ez a highlighted class van azt 
    ne lehessen majd kiválasztani mégegyszer, meg az is fontos, hogy a tömbbe nem lehet több, mint 5 elem!!! 
    majd a függvény ami azt csinálja, hogy bekéri a számokat és belerakja a userNumbers tömbbe, az majd vár egy cell-t, aminek nekünk az innerText
    -je kell majd, mert ez lesz maga a szám és fontos, hogy ezt parseInt-elni is kell majd!!!!! és ezt majd azért tudjuk megszerezni, mert ezt 
    az egész táblát azt itt fogjuk majd csinálni egy new Array(90) segítségével, amihez majd csinálunk egy numbers nevű 
    useState-s változót az lesz majd az értéke!!!!!! és fontos, hogy ez 0-89-ig fog csinálni számokat, ezért majd egyet hozzá kell adni, hogy jó 
    legyen!!! 

    *****
    <div className="display">
        <div className="cell">
            találatok: {hits}
        </div>
        <div className="cell">
            nyertes: {randomNumbers.join(", ")}
        </div>

Itt csak kiírjuk majd hits-et meg a randomNumbers-eket, ami fontos, hogy egy useState-s változó értékét mindig egy {} kell majd kiírni 
meg ha egy tömb van, akkor azt join()-olni kell vagy (", ") vagy akár lehet ("\n") is ha új sorba akarjuk!!!

<div className="lottery-numbers">
    {
        numbers.map((n, i)=> 
            <div key={i} onClick={(e)=>cellClick(e.target)} className="cell">
                {n+1}
            </div>
            )
    }
</div>

fontos, hogy onclick-vel itt adjuk meg a cellClick-nek az egész cell-t és akkor itt még csak az event (e)-ből nem a e.target.value-t 
adjuk meg mert majd ott fontos, hogy az egész div-et megkapjuk!!! ezért csak itt a e.target-et adjuk majd át neki 
mert ha a value is itt lenne, arra példáúl nem tudnánk classList.add meg remove-os dolgokat csinálni!!!
{n+1}
ez meg azért kell, mert a numbers -> [...new Array(90).keys()] az csak 0-89-ig csinálja meg és nekünk 1-90 ig kell tehát itt a map-ben 
minden ciklusban hozzáadunk egyet a number(n)-hez és azt írjuk majd ki!!!!!!
*/