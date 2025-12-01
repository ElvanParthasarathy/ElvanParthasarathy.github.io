document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('quotes-container');
    const paginationContainer = document.getElementById('pagination-container');
    const mainContent = document.querySelector('.main-content'); // Select the scrollable container
    
    // Configuration
    const ITEMS_PER_PAGE = 5; 
    let currentPage = 1;

    // Data Preparation
    const allQuotes = [...quotesData].reverse();

    function renderQuotes(page, isInitialLoad = false) {
        
        // HELPER: The actual rendering logic
        const executeRender = () => {
            container.innerHTML = ''; 
            
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const pageQuotes = allQuotes.slice(start, end);

            if (pageQuotes.length === 0) {
                container.innerHTML = '<div class="no-quotes">No quotes found.</div>';
            } else {
                pageQuotes.forEach(quote => {
                    const card = createQuoteCard(quote);
                    container.appendChild(card);
                });
            }
            
            renderPaginationControls(page);

            // FIX 2: Scroll to the absolute top of the container (0), 
            // instead of jumping to the header element. 
            // This ensures top padding and Back button are visible.
            if (mainContent) {
                mainContent.scrollTop = 0;
            }
        };

        // FIX 1: If it's the first load, render INSTANTLY. 
        // Do not fade out, do not wait. This stops the "sudden movement/lag".
        if (isInitialLoad) {
            executeRender();
            container.style.opacity = 1; // Ensure visible
        } else {
            // For pagination clicks, do the smooth fade transition
            container.style.opacity = 0;
            setTimeout(() => {
                executeRender();
                requestAnimationFrame(() => {
                    container.style.opacity = 1;
                });
            }, 300);
        }
    }

    function createQuoteCard(quote) {
        const div = document.createElement('div');
        div.className = 'quote-card';

        const formatText = (text) => text ? text.replace(/\n/g, '<br>') : '';

        // Determine Original Language Title
        let originalTitle = "Original";
        if (quote.lang === 'en') originalTitle = "English Original";
        if (quote.lang === 'ta') originalTitle = "Tamil Original";

        let htmlContent = `
            <div class="quote-mark">“</div>
            <div class="quote-content">
                <span class="quote-tag">${quote.tag || 'General'}</span>
                
                <!-- Original Text Section -->
                <div class="quote-sub-label"><strong>${originalTitle}</strong></div>
                <p class="quote-text original-text lang-${quote.lang}">${formatText(quote.text)}</p>
        `;

        if (quote.transliteration) {
            htmlContent += `
                <div class="quote-divider"></div>
                <!-- Transliteration Section -->
                <div class="quote-sub-label"><strong>Malayalam Transliteration</strong></div>
                <p class="quote-text transliteration-text">${formatText(quote.transliteration)}</p>
            `;
        }

        if (quote.translation) {
            htmlContent += `
                <div class="quote-divider"></div>
                <!-- Translation Section -->
                <div class="quote-sub-label"><strong>English Translation</strong></div>
                <p class="quote-text translation-text">${formatText(quote.translation)}</p>
            `;
        }

        htmlContent += `
                <div class="quote-meta">
                    <span class="quote-author">— ${quote.author}</span>
                </div>
            </div>
        `;

        div.innerHTML = htmlContent;
        return div;
    }

    function renderPaginationControls(page) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(allQuotes.length / ITEMS_PER_PAGE);

        if (totalPages <= 1) return; 

        const createBtn = (text, targetPage, isActive, isDisabled) => {
            const btn = document.createElement('button');
            btn.className = `page-btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
            btn.innerHTML = text;
            if (!isDisabled) {
                btn.onclick = () => changePage(targetPage);
            }
            return btn;
        };

        paginationContainer.appendChild(createBtn('←', page - 1, false, page === 1));

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.appendChild(createBtn(i, i, i === page, false));
        }

        paginationContainer.appendChild(createBtn('→', page + 1, false, page === totalPages));
    }

    function changePage(newPage) {
        const totalPages = Math.ceil(allQuotes.length / ITEMS_PER_PAGE);
        if (newPage < 1 || newPage > totalPages) return;
        
        currentPage = newPage;
        // Pass false because this IS NOT the initial load
        renderQuotes(currentPage, false);
    }

    // Trigger Initial Render with TRUE flag
    renderQuotes(currentPage, true);
});