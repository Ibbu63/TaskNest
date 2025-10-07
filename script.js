document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const addCard = document.getElementById('addCard');

  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeBtn');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskTitleInput = document.getElementById('taskTitleInput');

  // Ensure subtask container exists in HTML
  let subtaskContainer = document.getElementById('subtaskContainer');
  if (!subtaskContainer) {
    subtaskContainer = document.createElement('div');
    subtaskContainer.id = 'subtaskContainer';
    overlay.querySelector('.task-popup').insertBefore(subtaskContainer, addTaskBtn);
  }

  const readonlyOverlay = document.getElementById('readonlyOverlay');
  const readonlyTitle = document.getElementById('readonlyTitle');
  const readonlyText = document.getElementById('readonlyText');

  let subtaskCount = 0;

  // "+" button for adding subtasks
  const addSubtaskBtn = document.createElement('button');
  addSubtaskBtn.id = 'addSubtaskBtn';
  addSubtaskBtn.innerText = '+';
  addSubtaskBtn.style.marginBottom = '10px';
  addSubtaskBtn.addEventListener('click', () => addSubtask());
  subtaskContainer.appendChild(addSubtaskBtn);

  function addSubtask(value = '') {
    subtaskCount++;
    const subtask = document.createElement('div');
    subtask.className = 'subtask';
    subtask.style.display = 'flex';
    subtask.style.marginBottom = '8px';
    subtask.style.alignItems = 'center';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Task ${subtaskCount}`;
    input.value = value;
    input.style.flex = '1';
    input.style.padding = '8px';
    input.style.borderRadius = '5px';
    input.style.border = '2px solid #f7ba2b';
    input.style.background = '#111';
    input.style.color = '#fff';

    const removeBtn = document.createElement('button');
    removeBtn.innerText = '✖';
    removeBtn.style.marginLeft = '5px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.addEventListener('click', () => subtask.remove());

    subtask.appendChild(input);
    subtask.appendChild(removeBtn);

    subtaskContainer.insertBefore(subtask, addSubtaskBtn);
    input.focus();
  }

  // --- Open Add Task Popup ---
  addCard.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    taskTitleInput.value = '';
    subtaskContainer.innerHTML = '';
    subtaskCount = 0;
    subtaskContainer.appendChild(addSubtaskBtn);
    addSubtask();
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
  });

  // --- Save New Task ---
  addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim() || 'Untitled Task';

    const subtasksInputs = subtaskContainer.querySelectorAll('.subtask input');
    const tasksArray = Array.from(subtasksInputs)
      .map(s => s.value.trim() || s.placeholder)
      .filter(s => s);

    if (tasksArray.length === 0) return alert('Add at least one task!');

    createTaskCard(title, tasksArray);

    overlay.classList.remove('active');
    overlay.classList.add('hidden');
  });

  // --- Create Task Card ---
  function createTaskCard(title, tasksArray) {
    const card = document.createElement('div');
    card.className = 'card';

    const info = document.createElement('div');
    info.className = 'card-info';

    const h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.innerText = title;

    const p = document.createElement('p');
    p.className = 'card-details';
    p.innerText = tasksArray.join('\n');

    info.appendChild(h3);
    info.appendChild(p);
    card.appendChild(info);

    card.subtasks = tasksArray;

    // Tick button (remove entire card)
    const tickBtn = document.createElement('button');
    tickBtn.className = 'card-tick';
    tickBtn.innerText = '✔';
    tickBtn.addEventListener('click', e => {
      e.stopPropagation();
      card.remove();
    });
    card.appendChild(tickBtn);

    // Three-dot menu (Edit/Delete)
    const menu = document.createElement('div');
    menu.className = 'card-menu';
    menu.innerHTML = '&#8942;';
    card.appendChild(menu);

    const menuOptions = document.createElement('div');
    menuOptions.className = 'menu-options hidden';
    menuOptions.innerHTML = `<div class="edit-option">Edit</div><div class="delete-option">Delete</div>`;
    card.appendChild(menuOptions);

    menu.addEventListener('click', e => {
      e.stopPropagation();
      menuOptions.classList.toggle('hidden');
    });

    menuOptions.querySelector('.delete-option').addEventListener('click', e => {
      e.stopPropagation();
      card.remove();
    });

    menuOptions.querySelector('.edit-option').addEventListener('click', e => {
      e.stopPropagation();
      menuOptions.classList.add('hidden');
      openEdit(card);
    });

    container.insertBefore(card, addCard.nextSibling);

    card.addEventListener('click', () => openReadonly(title, card));
  }

  // --- Readonly Overlay ---
  function openReadonly(title, card) {
    readonlyTitle.innerText = title;
    readonlyText.innerHTML = '';
    readonlyText.className = 'readonly-text';

    card.subtasks.forEach((task, i) => {
      const subtaskDiv = document.createElement('div');
      subtaskDiv.className = 'readonly-subtask';
      subtaskDiv.style.position = 'relative';
      subtaskDiv.style.display = 'flex';
      subtaskDiv.style.justifyContent = 'space-between';
      subtaskDiv.style.alignItems = 'center';
      subtaskDiv.style.marginBottom = '10px';
      subtaskDiv.style.fontSize = '1.1rem';
      subtaskDiv.style.borderBottom = '1px solid #f7ba2b';
      subtaskDiv.style.paddingBottom = '5px';

      const span = document.createElement('span');
      span.innerText = task;

      const tickBtn = document.createElement('button');
      tickBtn.className = 'tick-btn';
      tickBtn.innerText = '✔';
      tickBtn.style.cursor = 'pointer';
      tickBtn.addEventListener('click', () => {
        // Particle effect
        const particleCount = 10;
        for (let j = 0; j < particleCount; j++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.position = 'absolute';
          particle.style.width = '6px';
          particle.style.height = '6px';
          particle.style.background = '#f7ba2b';
          particle.style.borderRadius = '50%';
          particle.style.left = subtaskDiv.offsetWidth / 2 + 'px';
          particle.style.top = subtaskDiv.offsetHeight / 2 + 'px';
          subtaskDiv.appendChild(particle);

          const angle = Math.random() * 2 * Math.PI;
          const distance = 50 + Math.random() * 50;
          setTimeout(() => {
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = 0;
          }, 10);

          setTimeout(() => particle.remove(), 600);
        }

        // Remove subtask visually
        subtaskDiv.style.transition = 'all 0.6s ease';
        subtaskDiv.style.opacity = 0;
        setTimeout(() => {
          subtaskDiv.remove();
          const index = card.subtasks.indexOf(task);
          if (index > -1) card.subtasks.splice(index, 1);

          if (card.subtasks.length === 0) {
            card.remove();
            readonlyOverlay.classList.remove('active');
          }
        }, 600);
      });

      subtaskDiv.appendChild(span);
      subtaskDiv.appendChild(tickBtn);
      readonlyText.appendChild(subtaskDiv);
    });

    readonlyOverlay.classList.add('active');
  }

  window.closeReadonly = () => {
    readonlyOverlay.classList.remove('active');
  };

  // --- Edit Task ---
  const editOverlay = document.createElement('div');
  editOverlay.className = 'edit-overlay hidden';
  editOverlay.innerHTML = `
    <div class="edit-content">
      <button class="close-edit">&times;</button>
      <h2>Edit Task</h2>
      <input type="text" class="edit-title" placeholder="Task Title">
      <div class="edit-subtask-container"></div>
      <button class="edit-save-btn">Save</button>
    </div>
  `;
  document.body.appendChild(editOverlay);

  const editTitleInput = editOverlay.querySelector('.edit-title');
  const editSubtaskContainer = editOverlay.querySelector('.edit-subtask-container');
  const editSaveBtn = editOverlay.querySelector('.edit-save-btn');
  const editCloseBtn = editOverlay.querySelector('.close-edit');

  const editAddSubtaskBtn = document.createElement('button');
  editAddSubtaskBtn.className = 'edit-add-subtask-btn';
  editAddSubtaskBtn.innerText = '+';
  editAddSubtaskBtn.style.marginBottom = '10px';
  editAddSubtaskBtn.addEventListener('click', () => addEditSubtask());

  editCloseBtn.addEventListener('click', () => editOverlay.classList.remove('active'));

  function openEdit(card) {
    editTitleInput.value = card.querySelector('.card-title').innerText;
    editSubtaskContainer.innerHTML = '';
    editSubtaskContainer.appendChild(editAddSubtaskBtn);

    card.subtasks.forEach((t, i) => addEditSubtask(t, i + 1));

    editOverlay.classList.add('active');

    editSaveBtn.onclick = () => {
      editSaveBtn.disabled = true;
      card.querySelector('.card-title').innerText = editTitleInput.value || 'Untitled Task';

      const subtasksInputs = editSubtaskContainer.querySelectorAll('.subtask input');
      const updatedTasks = Array.from(subtasksInputs).map(s => s.value.trim() || s.placeholder).filter(s => s);

      card.subtasks = updatedTasks;
      card.querySelector('.card-details').innerText = updatedTasks.join('\n') || 'No details provided.';
      editOverlay.classList.remove('active');
      editSaveBtn.disabled = false;
    };
  }

  function addEditSubtask(value = '', index) {
    const subtask = document.createElement('div');
    subtask.className = 'subtask';
    subtask.style.display = 'flex';
    subtask.style.marginBottom = '8px';
    subtask.style.alignItems = 'center';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Task ${index || subtaskCount}`;
    input.value = value;
    input.style.flex = '1';
    input.style.padding = '8px';
    input.style.borderRadius = '5px';
    input.style.border = '2px solid #f7ba2b';
    input.style.background = '#111';
    input.style.color = '#fff';

    const removeBtn = document.createElement('button');
    removeBtn.innerText = '✖';
    removeBtn.style.marginLeft = '5px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.addEventListener('click', () => subtask.remove());

    subtask.appendChild(input);
    subtask.appendChild(removeBtn);

    editSubtaskContainer.insertBefore(subtask, editAddSubtaskBtn);
    input.focus();
  }

  // --- Logout ---
  window.logout = () => {
    window.location.href = "index.html";
  };
});
