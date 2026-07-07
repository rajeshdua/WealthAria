// WealthAria JavaScript

document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to WealthAria!");

    const buttons = document.querySelectorAll(".btn, .btn2");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            console.log("Button clicked.");
        });
    });
});