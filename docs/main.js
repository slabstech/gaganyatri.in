document.getElementById("spaceSuitButton").addEventListener("click", function() {
    var infoDiv = document.getElementById("spaceSuitInfo");
    if (infoDiv.style.display === "none") {
        infoDiv.style.display = "block";
    } else {
        infoDiv.style.display = "none";
    }
});
document.getElementById("primeAstronautButton").addEventListener("click", function() {
    var infoDiv = document.getElementById("prime-astronaut-info");
    if (infoDiv.style.display === "none") {
        infoDiv.style.display = "block";
    } else {
        infoDiv.style.display = "none";
    }
});
document.getElementById("backupAstronautButton").addEventListener("click", function() {
    var infoDiv = document.getElementById("backup-astronaut-info");
    if (infoDiv.style.display === "none") {
        infoDiv.style.display = "block";
    } else {
        infoDiv.style.display = "none";
    }
});