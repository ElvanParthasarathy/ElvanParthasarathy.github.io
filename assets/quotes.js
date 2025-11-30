const QUOTES_PER_PAGE = 4;
let currentQuotePage = 1;

function formatMultiline(text) {
    if (!text) return "";
    return text.replace(/\n/g, "<br>");
}

function renderQuotesPage(page) {
    currentQuotePage = page;

    // Newest first: reverse a copy of the list
    const ordered = quotesList.slice().reverse();
    const start = (page - 1) * QUOTES_PER_PAGE;
    const pageItems = ordered.slice(start, start + QUOTES_PER_PAGE);

    const container = document.getElementById("quotes-container");
    if (!container) return;

    container.innerHTML = pageItems.map(q => `
        <div class="quote-card">
            ${q.original ? `<p class="quote-original">${formatMultiline(q.original)}</p>` : ""}
            ${q.translation ? `<p class="quote-translation">${formatMultiline(q.translation)}</p>` : ""}
            ${q.extra ? `<p class="quote-extra">${formatMultiline(q.extra)}</p>` : ""}
            <span class="quote-author">— ${q.author}</span>
        </div>
    `).join("");

    renderQuotePagination();
}

function renderQuotePagination() {
    const totalPages = Math.ceil(quotesList.length / QUOTES_PER_PAGE);
    const nav = document.getElementById("quotes-pagination");
    if (!nav) return;

    let buttonsHtml = "";
    for (let i = 1; i <= totalPages; i++) {
        buttonsHtml += `
            <button class="page-btn ${i === currentQuotePage ? "active" : ""}"
                    onclick="renderQuotesPage(${i})">
                ${i}
            </button>`;
    }
    nav.innerHTML = buttonsHtml;
}

// Initialize on load
window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("quotes-container");
    if (container) {
        renderQuotesPage(1);
    }
});
