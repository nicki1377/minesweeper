
document.getElementById("revealButton").addEventListener("click", function() {
    const hiddenContent = document.getElementById("hiddenContent");
    // toggle visibility
    hiddenContent.style.visibility = "visible";

    const buttonElement = document.getElementById("revealButton");
    buttonElement.style.color = "cyan";
});