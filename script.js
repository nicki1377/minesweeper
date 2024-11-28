
document.getElementById("revealButton").addEventListener("click", function() {
    const hiddenContent = document.getElementById("hiddenContent");
    // toggle visibility
    hiddenContent.style.visibility = "visible";

    const buttonElement = document.getElementById("revealButton");
    buttonElement.style.color = "cyan";
});

const elements = document.querySelectorAll('.square-button');
elements.forEach((element) => {
    element.addEventListener('click', function() {
        element.style.backgroundColor = 'white';
        element.textContent = '3';
    });
});