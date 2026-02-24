import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";
const BASE_URL = "http://localhost:3000/api/v1";

/* =========================
   TASK FEATURE
========================= */

const getTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error getting tasks", error);
  }
};

const renderTasks = (tasks) => {
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";
  if (taskList) {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.finished === 1;

      li.textContent = task.task;

      checkbox.addEventListener("change", async () => {
        const taskStatus = checkbox.checked ? 1 : 0;
        try {
          await changeTaskStatus(task.id, taskStatus);
        } catch (error) {
          console.log(error);
        }
      });

      li.append(checkbox);
      taskList.append(li);
    });
  }
};

const changeTaskStatus = async (taskId, tasksStatus) => {
  return await axios.patch(`${BASE_URL}/tasks/${taskId}`, {
    finished: tasksStatus,
  });
};

const createTask = (async) => {
  
};

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
    const response = await axios.get(`${API_BASE}/quotes`, {
      params: { category: safeCategory },
    });
    const quote = response.data.quote;
    const author = response.data.author;

    const blokquote = document.getElementById("quote-text");
    const figcaption = document.getElementById("quote-author");

    if (blokquote) {
      blokquote.textContent = `“${quote}”`;
    }
    if (figcaption) {
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
      loadQuote(selectedValue);
    });
  }
  const newQuoteBtn = document.getElementById("new-quote-btn");
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", () => {
      const select = document.getElementById("quote-category-select");
      const curentValue = select ? select.value : "general";
      loadQuote(curentValue);
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
  const tasks = await getTasks();

  await loadQuote(category);
  await getTasks();
  renderTasks(tasks);
};

/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();
