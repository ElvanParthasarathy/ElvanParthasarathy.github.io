function setActive() {
    const current = location.pathname.split("/").pop();
    const links = document.querySelectorAll(".sidebar-nav a");

    links.forEach(link => {
        link.classList.remove("active-link");
        if (link.getAttribute("href") === current) {
            link.classList.add("active-link");
        }
    });
}

window.addEventListener("load", setActive);

