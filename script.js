const sortCategorySelect = document.getElementById('sortCategory');

sortCategorySelect.addEventListener('change', filterTasksByCategory);

function filterTasksByCategory() {
    const selectedCategory = sortCategorySelect.value;
    
    if (selectedCategory === 'All') {
        renderTasks();
    } else {
        const filteredTasks = tasks.filter(task => task.category === selectedCategory);
        renderTasks(filteredTasks);
    }
}

const updateStatusSelect = document.getElementById('update');

updateStatusSelect.addEventListener('change', filterTasksByStatus);

sortCategorySelect.addEventListener('change', applyFilters);
updateStatusSelect.addEventListener('change', applyFilters);

function applyFilters() {
    const selectedCategory = sortCategorySelect.value;
    const selectedStatus = updateStatusSelect.value;

    const filteredTasks = tasks.filter(task => {
        const categoryMatch = selectedCategory === 'All' || task.category === selectedCategory;
        const statusMatch = selectedStatus === 'All' ||
            (selectedStatus === 'Completed' && task.completed) ||
            (selectedStatus === 'Pending' && !task.completed);

        return categoryMatch && statusMatch;
    });

    renderTasks(filteredTasks);
}

function filterTasksByStatus() {
    const selectedStatus = updateStatusSelect.value;
    
    if (selectedStatus === 'All') {
        renderTasks();
    } else if (selectedStatus === 'Completed') {
        const completedTasks = tasks.filter(task => task.completed);
        renderTasks(completedTasks);
    } else if (selectedStatus === 'Pending') {
        const pendingTasks = tasks.filter(task => !task.completed);
        renderTasks(pendingTasks);
    }
}

function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = '';
    filteredTasks.sort((a, b) => {
        if (a.completed && !b.completed) {
            return 1; 
        } else if (!a.completed && b.completed) {
            return -1; 
        } else {

            return new Date(a.dueDate) - new Date(b.dueDate);
        }
    });

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', task.completed ? 'completed' : 'pending');
        if (task.deleted) {
            taskItem.classList.add('deleted');
        }
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-name ${task.completed ? 'completed' : ''}">${task.name}</span>
            <span class="task-category">${task.category}</span>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;

    });
}

const taskNameInput = document.getElementById('taskName');
const dueDateInput = document.getElementById('dueDate'); 
const categorySelect = document.getElementById('category');
const addTaskButton = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('search');

let tasks = [];

addTaskButton.addEventListener('click', addTask);
searchInput.addEventListener('input', searchTasks);

const showDueDateButton = document.getElementById('showDueDate');

showDueDateButton.addEventListener('click', showDueDate);

function showDueDate() {
    const dueDate = dueDateInput.value;
    alert(`Due Date: ${dueDate}`);
}


function addTask() {
    const taskName = taskNameInput.value;
    const dueDate = dueDateInput.value;
    const category = categorySelect.value;
    
    if (!taskName || !dueDate) {
      alert('Please fill in both task name and due date.');
      return;
    }
  
    const currentDate = new Date();
    const selectedDueDate = new Date(dueDate);
  
    if (selectedDueDate < currentDate) {
      alert('Please select an upcoming due date.');
      return;
    }
  
    const newTask = {
      id: Date.now(),
      name: taskName,
      category: category,
      dueDate: dueDate,
      createdDate: currentDate.toISOString(), // Store creation date
      completed: false,
    };
  
    tasks.push(newTask);
    renderTasks();
    taskNameInput.value = '';
    dueDateInput.value = '';
  }

  function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
  }  


function toggleCompletion(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
}

function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');
  
      const createdDate = new Date(task.createdDate).toLocaleString();
      const dueDate = new Date(task.dueDate).toLocaleDateString();
  
      const checkboxStyle = task.completed ? 'style="text-decoration: line-through;"' : '';
      const editButtonStyle = task.completed ? 'disabled style="background-color: grey; text-decoration: line-through;"' : '';
  
      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} ${checkboxStyle}>
        <span class="task-name ${task.completed ? 'completed' : ''}">${task.name}</span>
        <span class="task-category">${task.category}</span>
        <span class="task-created">Date Created: ${createdDate}</span> <!-- Display creation date -->
        <span class="task-due">Date Due: ${dueDate}</span> <!-- Display due date -->
        <button class="edit-button" ${editButtonStyle}>Edit</button>
        <button class="delete-button">Delete</button>
      `;
  
      const taskCheckbox = taskItem.querySelector('.task-checkbox');
      taskCheckbox.addEventListener('change', () => toggleCompletion(task.id));
  
      const editButton = taskItem.querySelector('.edit-button');
      editButton.addEventListener('click', () => editTask(task.id));
  
      const deleteButton = taskItem.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => deleteTask(task.id));
  
      taskList.appendChild(taskItem);
    });
  }
  

function editTask(taskId) {
  const taskToEdit = tasks.find(task => task.id === taskId);
  if (!taskToEdit) return;

  const newName = prompt('Edit task name:', taskToEdit.name);
  if (newName !== null) {
    taskToEdit.name = newName;
    renderTasks();
  }
}

renderTasks();