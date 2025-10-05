const addCard = document.getElementById("addCard");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const container = document.querySelector(".container");

let editingCard = null;

// 🟢 Load tasks from localStorage on startup
window.addEventListener("load", loadTasks);

// Open popup to add task
addCard.addEventListener("click", () => {
  overlay.classList.add("active");
  taskInput.value = "";
  addTaskBtn.textContent = "Add Task";
  editingCard = null;
});

// Close popup
closeBtn.addEventListener("click", () => {
  overlay.classList.remove("active");
  taskInput.value = "";
  editingCard = null;
});

// Add or Save Task
addTaskBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if (!task) return alert("Enter a task!");

  if (editingCard) {
    // Update existing task
    editingCard.querySelector(".task-text").textContent = task;
    saveTasks();
    editingCard = null;
    overlay.classList.remove("active");
    taskInput.value = "";
    addTaskBtn.textContent = "Add Task";
    return;
  }

  // Create new task
  overlay.classList.remove("active");
  const newCard = createTaskCard(task);
  container.insertBefore(newCard, addCard);
  saveTasks(); // Save to localStorage
  taskInput.value = "";
});

// 🟢 Create card element function
function createTaskCard(taskText) {
  const newCard = document.createElement("div");
  newCard.className = "card";
  newCard.innerHTML = `
    <div class="card-info">
      <span class="menu">⋮</span>
      <p class="task-text">${taskText}</p>
      <div class="menu-options">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;

  // Menu toggle
  const menu = newCard.querySelector(".menu");
  const menuOptions = newCard.querySelector(".menu-options");

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
    menuOptions.style.display =
      menuOptions.style.display === "flex" ? "none" : "flex";
  });

  // Edit button
  newCard.querySelector(".edit-btn").addEventListener("click", () => {
    editingCard = newCard;
    const oldText = newCard.querySelector(".task-text").textContent;
    taskInput.value = oldText;
    addTaskBtn.textContent = "Save Changes";
    overlay.classList.add("active");
    menuOptions.style.display = "none";
  });

  // Delete button
  newCard.querySelector(".delete-btn").addEventListener("click", () => {
    newCard.remove();
    saveTasks();
  });

  return newCard;
}

// 🟢 Save all tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-text").forEach((el) => {
    tasks.push(el.textContent);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🟢 Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((taskText) => {
    const card = createTaskCard(taskText);
    container.insertBefore(card, addCard);
  });
}

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "login.html";
}

let users = JSON.parse(localStorage.getItem("users")) || {};
let user = users[currentUser];

function saveTasks() {
  users[currentUser].tasks = tasks;
  localStorage.setItem("users", JSON.stringify(users));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}


function openReadonly(title, text) {
  document.getElementById("readonlyTitle").innerText = title;
  document.getElementById("readonlyText").innerText = text;
  document.getElementById("readonlyOverlay").classList.add("active");
}

function closeReadonly() {
  document.getElementById("readonlyOverlay").classList.remove("active");
}

/* Example: attach click event to task cards */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('.card-title')?.innerText || "Untitled Task";
    const text = card.querySelector('.card-details')?.innerText || "No details available.";
    openReadonly(title, text);
  });
});
