document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const addCard = document.getElementById('addCard');

  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeBtn');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskInput = document.getElementById('taskInput');
  const taskTitleInput = document.getElementById('taskTitleInput');

  const readonlyOverlay = document.getElementById('readonlyOverlay');
  const readonlyTitle = document.getElementById('readonlyTitle');
  const readonlyText = document.getElementById('readonlyText');

  // --- CREATE FULLSCREEN EDIT OVERLAY ---
  const editOverlay = document.createElement('div');
  editOverlay.className = 'edit-overlay hidden';
  editOverlay.innerHTML = `
    <div class="edit-content">
      <button class="close-edit">&times;</button>
      <h2>Edit Task</h2>
      <input type="text" class="edit-title" placeholder="Task Title">
      <textarea class="edit-text" placeholder="Task Details"></textarea>
      <button class="save-btn">Save</button>
    </div>
  `;
  document.body.appendChild(editOverlay);

  const editTitleInput = editOverlay.querySelector('.edit-title');
  const editTextInput = editOverlay.querySelector('.edit-text');
  const editSaveBtn = editOverlay.querySelector('.save-btn');
  const editCloseBtn = editOverlay.querySelector('.close-edit');

  editCloseBtn.addEventListener('click', () => editOverlay.classList.remove('active'));

  // --- OPEN ADD POPUP ---
  addCard.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    taskTitleInput.value = '';
    taskInput.value = '';
    taskTitleInput.focus();
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
  });

  addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim() || 'Untitled Task';
    const text = taskInput.value.trim() || 'No details provided.';
    createTaskCard(title, text);
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
  });

  // --- CREATE CARD ---
  function createTaskCard(title, text) {
    const card = document.createElement('div');
    card.className = 'card';

    const info = document.createElement('div');
    info.className = 'card-info';

    const h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.innerText = title;

    const p = document.createElement('p');
    p.className = 'card-details';
    p.innerText = text;

    info.appendChild(h3);
    info.appendChild(p);
    card.appendChild(info);

// --- Inside createTaskCard function ---
  const tickBtn = document.createElement('button');
  tickBtn.className = 'card-tick';
  tickBtn.innerText = '✔';
  card.appendChild(tickBtn);

  tickBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent opening read-only
    card.remove();       // remove completed task
  });
// Add tick button to add-task popup only once




    // --- THREE DOT MENU ---
    const menu = document.createElement('div');
    menu.className = 'card-menu';
    menu.innerHTML = '&#8942;';
    card.appendChild(menu);

    const menuOptions = document.createElement('div');
    menuOptions.className = 'menu-options hidden';
    menuOptions.innerHTML = `
      <div class="edit-option">Edit</div>
      <div class="delete-option">Delete</div>
    `;
    card.appendChild(menuOptions);

    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      menuOptions.classList.toggle('hidden');
    });

    menuOptions.querySelector('.delete-option').addEventListener('click', (e) => {
      e.stopPropagation();
      card.remove();
    });

    menuOptions.querySelector('.edit-option').addEventListener('click', (e) => {
      e.stopPropagation();
      menuOptions.classList.add('hidden');
      openEdit(card);
    });

    container.insertBefore(card, addCard.nextSibling);

    card.addEventListener('click', () => openReadonly(h3.innerText, p.innerText));
  }

  // --- OPEN READONLY ---
  function openReadonly(title, text) {
    readonlyTitle.innerText = title;
    readonlyText.innerText = text;
    readonlyOverlay.classList.add('active');
    readonlyText.className = 'readonly-text'; // golden border
  }

  window.closeReadonly = function () {
    readonlyOverlay.classList.remove('active');
  };

  // --- OPEN FULLSCREEN EDIT ---
  function openEdit(card) {
    const title = card.querySelector('.card-title').innerText;
    const text = card.querySelector('.card-details').innerText;

    editTitleInput.value = title;
    editTextInput.value = text;

    editOverlay.classList.add('active');

    editSaveBtn.onclick = () => {
      card.querySelector('.card-title').innerText = editTitleInput.value || 'Untitled Task';
      card.querySelector('.card-details').innerText = editTextInput.value || 'No details provided.';
      editOverlay.classList.remove('active');
    };
  }

  // --- LOGOUT ---
  window.logout = function () {
    window.location.href = "index.html";
  };
});
