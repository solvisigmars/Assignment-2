import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";
const BASE_URL = "http://localhost:3000/api/v1";

/* =========================
   TASK FEATURE
========================= */
// Gets task with a get request.
const getTasks = async () => {
  // Try to get the tasks if it fails we catch the error.
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.log("Error getting tasks", error);
  }
};

const loadTasks = async () => {
  try {
    // gets the tasks 
    const tasks = await getTasks();
    // Renders the tasks to display
    renderTasks(tasks);
  } catch (error) {
    console.log(error);
  }
};

const renderTasks = (tasks) => {
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";
  if (taskList) {
    taskList.innerHTML = "";
    // Go through each task in the list 
    tasks.forEach((task) => {
      // Create a li element so we get a lsit of tasks
      const li = document.createElement("li");

      // Create a checkbox input for each task
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.finished === 1;

      // Task text content created here
      const label = document.createElement("span");
      label.textContent = task.task;
      
      // If the checkbox is clicked the task status in the backend is updated. 0 if not checked, 1 if checked
      checkbox.addEventListener("change", async () => {
        const taskStatus = checkbox.checked ? 1 : 0;
        try {
          await changeTaskStatus(task.id, taskStatus);
        } catch (error) {
          console.log(error);
        }
      });

      li.append(checkbox);
      li.append(label);
      taskList.append(li);
    });
  }
};

const changeTaskStatus = async (taskId, tasksStatus) => {
  return await axios.patch(`${BASE_URL}/tasks/${taskId}`, {
    finished: tasksStatus,
  });
};

const createTask = async (taskText) => {
  return await axios.post(`${BASE_URL}/tasks`, {
    task: taskText,
  });
};

const handleCreateTask = async () => {
  const input = document.getElementById("new-task");
  const taskText = input.value;

  // If there is no text we can't create a new task
  if (!taskText) return;

  try {
    await createTask(taskText);
    input.value = "";
    await loadTasks();
  } catch (error) {
    console.log(error);
  }
};

const wireTaskEvents = () => {
  const button = document.getElementById("add-task-btn");
  const input = document.getElementById("new-task");
  if (button) {
    button.addEventListener("click", handleCreateTask);
  }

  if (input) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCreateTask();
      }
    });
  }
};

/* =========================
   NOTE FEATURE
========================= */
const getNotes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/notes`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error getting notes", error);
    return "";
  }
};

const renderNotes = (notes) => {
  const textArea = document.getElementById("notes-text");
  if (textArea) {
    textArea.value = notes;
  }
};

const loadNotes = async () => {
  try {
    const notes = await getNotes();
    renderNotes(notes.notes);
  } catch (error) {
    console.log(error);
  }
};

const saveNotes = async (text) => {
  try {
    const button = document.getElementById("save-notes-btn");
    if (button) button.disabled = true;
    const response = await axios.put(`${BASE_URL}/notes`, {
      notes: text,
    });
    await loadNotes();
    return response.data
  } catch (error) {
    console.log(error);
  }
};

const wireNotesEvent = () => {
  const textArea = document.getElementById("notes-text");
  const button = document.getElementById("save-notes-btn");
  // When the text is modified the button becomes eabled.
  textArea.addEventListener("input", () => {
    button.disabled = false;
  });
  // When the save button is clicked the modified notes are updated in the backend
  button.addEventListener("click", () => {
    const text = textArea.value;
    saveNotes(text);
  });
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
  wireTaskEvents();
  wireNotesEvent();

  const select = document.getElementById("quote-category-select");
  const category = select?.value || "general";
  await loadQuote(category);
  await loadTasks();
  await loadNotes();
};

/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();
