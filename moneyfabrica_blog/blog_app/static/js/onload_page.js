// display a confirmation window after successful newsletter subscription

window.onload = function() {
    if (window.location.search.includes("confirmed=true")) {
        const overlay = document.querySelector(".overlay");
        const element = document.querySelector(".confirmed-window");

        overlay.style.display = "block";
        element.style.display = "block";
    }
}

