let riversData;
let maxLength = -7; //lunghezza massima del fiume
let yPositionOffset = 0; // scroll verticale
let xPositionOffset = 0; // scroll orizzontale
let totalWidth = 0; // Larghezza totale per tutte le righe, calcolare scrolling orizz.

function preload() {
    riversData = loadTable('assets/rivers.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Valore lunghezza massima per normalizzare le linee
    for (let i = 0; i < riversData.getRowCount(); i++) {
        let riverLength = riversData.getNum(i, 'length'); //lunghezza del fiume
        if (riverLength > maxLength) {
            maxLength = riverLength;
        }
    }

    // Calcola la larghezza totale per lo scrolling orizzontale
    for (let i = 0; i < riversData.getRowCount(); i++) {
        let riverLength = riversData.getNum(i, 'length'); //lunghezza del fiume
        let countries = riversData.getString(i, 'countries').split(","); //ottengo i paesi attraversati dal fiume

        // Calcola la lunghezza della linea del fiume in base alla larghezza della finestra 
        let lineLength = map(riverLength, 0, maxLength, 0, width - 150); 

        // Calcola la larghezza totale occupata dai rettangoli dei paesi
        let totalCountryWidth = 0;
        for (let j = 0; j < countries.length; j++) {
            let country = countries[j].trim();
            totalCountryWidth += textWidth(country) + 20; // Somma la larghezza di ogni rettangolo
        }

        // La larghezza totale per quella riga: include linea del fiume e rettangoli
        totalWidth += lineLength + totalCountryWidth + 80; // 80px di margine extra
    }

    noLoop(); // Disegna solo una volta
}

function draw() {
    background('#f0e5d8'); // Cambiato il colore di sfondo a un beige chiaro

    // Disegno il titolo e sottotitolo (solo in alto)
    if (yPositionOffset === 0) {
        textSize(36);
        fill(50, 50, 50); // Cambiato il colore del testo a grigio scuro
        textAlign(CENTER, TOP);
        text("Rivers of the World", width / 2, 20); // Titolo modificato

        // sottotitolo
        textSize(18);
        fill(70, 70, 70); // Colore del sottotitolo più chiaro
        textAlign(CENTER, TOP);
        text("Exploring the rivers and the countries they pass through", width / 2, 60); // Sottotitolo modificato
    }

    // Distanza tra il sottotitolo e la prima riga
    let spaceAfterSubtitle = 120; // Maggiore distanza tra il sottotitolo e la prima riga

    // Posizione verticale per la prima riga
    let yPosition = 60 + spaceAfterSubtitle - yPositionOffset; // Inizia dopo il sottotitolo e con un offset verticale

    let gap = 90; // Maggiore distanza tra le righe
    let rectHeight = 25; // Altezza dei rettangoli paesi
    let xStart = 50 - xPositionOffset; // Posizione orizzontale iniziale per la linea

    // Ciclo per ogni fiume
    for (let i = 0; i < riversData.getRowCount(); i++) {
        let riverName = riversData.getString(i, 'name');
        let riverLength = riversData.getNum(i, 'length');
        let countries = riversData.getString(i, 'countries').split(","); // Paesi attraversati dal fiume

        // Calcolo per la lunghezza della linea del fiume
        let lineLength = map(riverLength, 0, maxLength, 0, width - 150); // Mappa la lunghezza del fiume

        // Calcola la larghezza totale dei rettangoli paesi
        let totalCountryWidth = 0;
        for (let j = 0; j < countries.length; j++) {
            let country = countries[j].trim();
            totalCountryWidth += textWidth(country) + 20; // Somma la larghezza di ogni rettangolo
        }

        // La linea del fiume ora deve coprire sia la sua lunghezza che quella dei rettangoli dei paesi
        let totalLineLength = lineLength + totalCountryWidth;

        // Margine fisso per fare in modo che la linea superi l'ultimo rettangolo
        totalLineLength = max(totalLineLength, lineLength + totalCountryWidth + 80); 

        // Disegna la linea del fiume come una curva fluida
        stroke(50, 100, 200); // Colore blu per la linea
        strokeWeight(6);
        noFill();
        beginShape();
        let curveFactor = 20; // Definisce quanto curva la linea
        for (let j = 0; j < totalLineLength; j++) {
            let x = xStart + j;
            let y = yPosition + sin(j * 0.05) * curveFactor; // Aggiunge un effetto sinuoso alla linea
            vertex(x, y);
        }
        endShape();

        // Disegna i rettangoli per i paesi attraversati, con angoli stondati e effetto opaco
        let countrySpacing = 30; // Spazio tra i rettangoli
        let xOffset = xStart + lineLength + countrySpacing; // Inizia a disegnare rettangoli dopo la linea

        for (let j = 0; j < countries.length; j++) {
            let country = countries[j].trim();
            let rectWidth = textWidth(country) + 20; // Calcola la larghezza del rettangolo in base al nome del paese
            
            // Aggiungi l'effetto opaco (alfa) e gli angoli stondati
            noStroke(); 
            fill(100, 150, 50, 150); // Verde con opacità (150 su 255)
            rect(xOffset, yPosition - rectHeight / 2, rectWidth, rectHeight, 19); // Gli angoli stondati con raggio di 12px

            // Nome del paese 
            fill(255); // Colore bianco per il testo
            textSize(12); 
            textAlign(CENTER, CENTER);
            text(country, xOffset + rectWidth / 2, yPosition); // Nome del paese nel rettangolo

            xOffset += rectWidth + 10; // Spazio tra i rettangoli
        }

        // Nome del fiume sotto la linea
        textSize(16);
        textStyle(BOLD);  
        fill(0, 0, 255); 
        textAlign(LEFT, TOP); // Allinea il testo a sinistra, sopra la linea
        text(riverName, xStart, yPosition + 40); // Nome del fiume sotto la linea
        textStyle(NORMAL); // Ripristina lo stile normale per il resto del testo

        // Aggiorna la posizione verticale per la prossima riga
        yPosition += gap + rectHeight; // Spazio per la prossima riga
    }
}

// Ridimensiona il canvas se la finestra cambia dimensione
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Aggiungi una funzione per gestire lo scrolling
function mouseWheel(event) {
    // Modifica l'offset verticale per lo scrolling 
    if (event.deltaY !== 0) {
        yPositionOffset += event.deltaY;
        yPositionOffset = constrain(yPositionOffset, 0, (riversData.getRowCount() * (60 + 2 * 25) - height)); 
    }

    if (event.deltaX !== 0) {
        xPositionOffset += event.deltaX;
        xPositionOffset = constrain(xPositionOffset, 0, totalWidth - width); 
    }

    redraw();
}
