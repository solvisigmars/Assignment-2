import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";


/* =========================
   QUOTE FEATURE
========================= */

/**
 * Fetch a quote from the API
 * @param {string} category - quote category
 */
const loadQuote = async (category = "general") => {
  try {
    const safeCategory = category || "general";
    const response = await axios.get(`${API_BASE}/quotes` , {params: { category: safeCategory}});
    const quote = response.data.quote;
    const author = response.data.author;

    const blokquote = document.getElementById("quote-text");
    const figcaption = document.getElementById("quote-author");

    if (blokquote) {
      blokquote.textContent = `“${quote}”`;
    }
    if (figcaption){
      figcaption.textContent = author;
    }
    
  } catch (error) {
    console.log("Error loading quote:", error);
  }
};

/**
 * Attach event listeners for quote feature
 */
const wireQuoteEvents = () => {
  const select = document.getElementById("quote-category-select");
  if (select) {
    select.addEventListener("change", (event) => {
      const selectedValue = event.target.value;
      loadQuote(selectedValue)
    });
  }
  const newQuoteBtn = document.getElementById("new-quote-btn");
  if (newQuoteBtn){
    newQuoteBtn.addEventListener("click", () => {
      const select = document.getElementById("quote-category-select");
      const curentValue = select ? select.value : "general";
      loadQuote(curentValue)
    });
  }
  
};

/* =========================
   INIT
========================= */

/**
 * Initialize application
 */
const init = async () => {
  wireQuoteEvents();

  const select = document.getElementById("quote-category-select");
  const category = select?.value || "general";

  await loadQuote(category);
};

/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();
