// 1. MECHANIZM ZAKŁADEK
function openTab(evt, tabId) {
    // Ukryj wszystkie treści
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.style.display = 'none');

    // Usuń klasę active ze wszystkich przycisków
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Pokaż wybraną zakładkę i dodaj klasę active
    document.getElementById(tabId).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

// Inicjalizacja pierwszej zakładki na starcie
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('tab1').style.display = 'block';
});

// 2. EVENT LISTENERY
document.getElementById("calcDpiBtn").addEventListener("click", calculateDpi);
document.getElementById("calcDropBtn").addEventListener("click", calculateDrop);

function calculateDpi() {
    const DPI_X = Number(document.getElementById("dpi").value);
    const DPI_Y = 400; 
    const NOZZLES = 1024;
    const speed = Number(document.getElementById("speed").value); // m/min
    const heads = Number(document.getElementById("heads").value);

    // SZEROKOŚĆ: (dysze / 400 DPI) * cale na metry
    const widthMeters = (heads * NOZZLES / DPI_Y) * 0.0254;

    // DŁUGOŚĆ: ile metrów bieżących to 1m2 przy danej szerokości
    const lengthMeters = 1 / widthMeters;

    // LINIE: długość w calach * DPI wzdłużne
    const totalLines = Math.round((lengthMeters * 39.3701) * DPI_X);

    // CZĘSTOTLIWOŚĆ (Hz)
    const speed_mm_s = (speed * 1000) / 60;
    const pitch_mm = 25.4 / DPI_X;
    const freq = speed_mm_s / pitch_mm;

    // CZAS WYDRUKU: (Długość / Prędkość)
    // Prędkość w m/s to speed/60
    const time_s = lengthMeters / (speed / 60);

    // WYŚWIETLANIE WYNIKÓW
    document.getElementById("freqResult").innerText = `${freq.toFixed(1)} Hz`;
    document.getElementById("linesResult").innerText = totalLines.toLocaleString();
    document.getElementById("timeResult").innerText = `${time_s.toFixed(2)} s`;

    // AUTOMATYKA: Przesłanie wartości do pola w zakładce 2
    document.getElementById("lines").value = totalLines;
}

function calculateDrop() {
    const weight = Number(document.getElementById("weight").value); // g
    const density = Number(document.getElementById("density").value); // kg/l
    const lines = Number(document.getElementById("lines").value);
    const heads = Number(document.getElementById("heads").value); // Pobierane z pola heads w tab1
    const mode = Number(document.getElementById("dropMode").value);
    const NOZZLES_PER_HEAD = 1024;

    if (!weight || !lines) {
        alert("BŁĄD: Najpierw oblicz linie w zakładce 1, a potem wpisz wagę tuszu!");
        return;
    }

    // 1. Objętość w mililitrach (g / g/ml)
    const volMl = weight / density;
    
    // 2. Objętość w piktolitrach (1 ml = 10^9 pL)
    const volPl = volMl * 1_000_000_000;

    // 3. Całkowita liczba kropel (Pikseli) na 1m2
    const totalDrops = lines * (heads * NOZZLES_PER_HEAD);

    // 4. Objętość bazowej kropli
    const drop_pl = volPl / totalDrops;

    // WYŚWIETLANIE
    document.getElementById("dropResult").innerText = `${drop_pl.toFixed(2)} pL`;
    document.getElementById("binaryResult").innerText = `${(drop_pl * mode).toFixed(2)} pL`;
    document.getElementById("usageResult").innerText = `${weight.toFixed(3)} g/m²`;
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}