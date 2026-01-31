// 1. TAB MANAGEMENT - REQUIRED FOR INTERFACE TO RESPOND
function openTab(evt, tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.style.display = 'none');

    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

// Ensure tab1 is visible on load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('tab1').style.display = 'block';
});

// 2. EVENT LISTENERS
document.getElementById("calcDpiBtn").addEventListener("click", calculateDpi);
document.getElementById("calcDropBtn").addEventListener("click", calculateDrop);

// 3. LOGIC CALCULATIONS
function calculateDpi() {
    const DPI_X = Number(document.getElementById("dpi").value);
    const speed = Number(document.getElementById("speed").value);
    const heads = Number(document.getElementById("heads").value);
    const DPI_Y = 400; 
    const NOZZLES = 1024;

    // 1. OBLICZENIA (bez zmian)
    const widthMeters = (heads * NOZZLES / DPI_Y) * 0.0254;
    const lengthMeters = 1 / widthMeters;
    const totalLines = Math.round((lengthMeters * 39.3701) * DPI_X);
    const speed_mm_s = (speed * 1000) / 60;
    const freq = speed_mm_s / (25.4 / DPI_X);
    const time_s = lengthMeters / (speed / 60);

    // 2. LOGIKA SAFETY GUARD (Dimatix StarFire + Waveform Limit)
    // Limit: 400dpi * 40m/min = 16000
    const maxSpeedForDpi = 16000 / DPI_X;
    const freqElement = document.getElementById("freqResult");
    
    if (speed > maxSpeedForDpi) {
        freqElement.style.color = "#ef4444"; // Czerwony alert
        freqElement.innerText = `${freq.toFixed(1)} Hz - OVER LIMIT (Max: ${maxSpeedForDpi} m/min)`;
    } else {
        freqElement.style.color = "var(--accent)"; // Standardowy zielony
        freqElement.innerText = `${freq.toFixed(1)} Hz - OK`;
    }

    // WYNIKI
    document.getElementById("linesResult").innerText = totalLines.toLocaleString();
    document.getElementById("timeResult").innerText = `${time_s.toFixed(2)} sec`;
    document.getElementById("lines").value = totalLines;
}

function calculateDrop() {
    const weight = Number(document.getElementById("weight").value); // [g]
    const density = Number(document.getElementById("density").value); // [kg/l]
    const lines = Number(document.getElementById("lines").value);
    const heads = Number(document.getElementById("heads").value);
    const mode = Number(document.getElementById("dropMode").value);
    const NOZZLES_PER_HEAD = 1024;

    if (!weight || !lines) {
        alert("ERROR: Calculate lines in Step 1 first and enter ink weight!");
        return;
    }

    // 1. Volume in ml: weight / density
    const volMl = weight / density;
    // 2. Volume in pL: ml * 10^9
    const volPl = volMl * 1_000_000_000;
    // 3. Total drops (Pixels)
    const totalDrops = lines * (heads * NOZZLES_PER_HEAD);
    // 4. Single Drop Volume
    const drop_pl = volPl / totalDrops;

    // OUTPUTS IN ENGLISH
    document.getElementById("dropResult").innerText = `${drop_pl.toFixed(2)} pL`;
    document.getElementById("binaryResult").innerText = `${(drop_pl * mode).toFixed(2)} pL`;
    document.getElementById("usageResult").innerText = `${weight.toFixed(3)} g/m²`;
}

