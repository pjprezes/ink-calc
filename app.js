// ... (openTab function remains the same as in)

function calculateDpi() {
    // ... (logic from)
    
    // OUTPUTS IN ENGLISH
    document.getElementById("freqResult").innerText = `${freq.toFixed(1)} Hz`;
    document.getElementById("linesResult").innerText = totalLines.toLocaleString();
    document.getElementById("timeResult").innerText = `${time_s.toFixed(2)} sec`;

    document.getElementById("lines").value = totalLines;
}

function calculateDrop() {
    // ... (logic from)

    if (!weight || !lines) {
        alert("ERROR: Calculate lines in Step 1 first and enter ink weight!");
        return;
    }

    // ... (volume calculations from)

    // OUTPUTS IN ENGLISH
    document.getElementById("dropResult").innerText = `${drop_pl.toFixed(2)} pL`;
    document.getElementById("binaryResult").innerText = `${(drop_pl * mode).toFixed(2)} pL`;
    document.getElementById("usageResult").innerText = `${weight.toFixed(3)} g/m²`;
}
