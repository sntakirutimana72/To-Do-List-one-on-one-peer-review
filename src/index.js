import './index.css';

/**
 *
 * @param {String} selector
 * @param {HTMLElement} parentTree
 * @returns
 */
function $select (selector, tree = document.body) {
  return tree.querySelector(selector);
}

/**
*
* @param {String} selector
* @param {HTMLElement} parentTree
* @returns
*/
function $selectAll (selector, tree = document.body) {
  return tree.querySelectorAll(selector);
}

/**
*
* @param {HTMLElement} element
* @param {String} attribute
* @param {String | Boolean | undefined} value
* @returns
*/
function $attrib (element, attribute, value) {
  if (value === undefined) return element.getAttribute(attribute);

  element.setAttribute(attribute, value);
}

/**
*
* @param {HTMLElement} element
* @param {String} attribute
* @returns
*/
function $is (element, attribute) {
  return element.hasAttribute(attribute);
}

/**
*
* @param {HTMLElement} element
* @param {String} attribute
* @returns
*/
function $prop (element, attribute) {
  return element.removeAttribute(attribute);
}

/**
*
* @param {String} tagName
* @returns
*/
function createElement (tagName) {
  return document.createElement(tagName);
}

const propClearTaskTrigger = (enforce) => {
  const trigger = $select('.clear-all-btn');
  const isDisabled = $is(trigger, 'disabled');

  if (isDisabled) {
    $prop(trigger, 'disabled');
  } else if (!enforce) $attrib(trigger, 'disabled', true);
};

const dataKey = 'to-do-list';

class TasksManager {
  constructor() {
    this.allTasks = [];
  }

  get tasks() {
    return this.allTasks;
  }

  get size() {
    return this.allTasks.length;
  }

  set tasks(tasks) {
    this.allTasks = tasks;

    return this;
  }

  assign(task) {
    this.allTasks.push(task);

    return this;
  }

  setDescription(index, description) {
    this.allTasks[parseInt(index, 10)].description = description;

    return this;
  }

  setState(index) {
    const state = this.allTasks[index].completed;
    this.allTasks[index].completed = !state;

    return this;
  }

  get hasDisabled() {
    return this.allTasks.find(({ completed }) => completed === true) !== undefined;
  }

  setIndex(index) {
    this.allTasks[index].index = index;

    return this;
  }

  setShadow(index) {
    delete this.allTasks[parseInt(index, 10)];

    return this;
  }

  filter() {
    this.allTasks = this.allTasks.filter((task) => task !== undefined);

    return this;
  }

  remove(index) {
    this.allTasks.splice(index, 1);

    return this;
  }
}

const TManager = new TasksManager();

const queryTasks = () => {
  const temp = localStorage.getItem(dataKey);

  if (temp !== null) TManager.tasks = JSON.parse(temp);
};

const commitTasks = () => localStorage.setItem(dataKey, JSON.stringify(TManager.tasks));

const setTaskState = ({ parentElement }) => {
  parentElement.classList.toggle('status-completed');

  TManager.setState(parseInt(parentElement.id, 10));

  propClearTaskTrigger(TManager.hasDisabled);

  commitTasks();
};

const listView = $select('.to-do-list');

const renderTaskTemplate = ({ index, description, completed }) => {
  const component = createElement('li');

  component.id = index;
  component.classList.add('flex-align-center', 'row', 'task-item');

  if (completed) component.classList.add('status-completed');

  component.innerHTML = `
    <input type='checkbox'${completed ? ' checked' : ''} class='task-stat'>
    <input type='text' class='task-desc' placeholder='${description}'>
    <button type='button' class='task-opt task-drag fa-solid fa-ellipsis-vertical'></button>
  `;

  return component;
};

const reorderTasks = (index = 0) => {
  for (index; index < TManager.size; index += 1) {
    TManager.setIndex(index);
    listView.children[index].id = index;
  }

  commitTasks();
};

const alterTaskOptionButton = (element) => {
  const [, , button] = element.children;

  if (button.classList.contains('task-drag')) {
    button.classList.remove('task-drag', 'fa-ellipsis-vertical');
    button.classList.add('task-trash', 'fa-trash');
  } else {
    button.classList.remove('task-trash', 'fa-trash');
    button.classList.add('task-drag', 'fa-ellipsis-vertical');
  }
};

const onTaskSelect = ({ parentElement }) => {
  const currentSelection = $select('.task-selected', listView);

  if (parentElement === currentSelection) return;

  if (currentSelection !== null) {
    currentSelection.classList.remove('task-selected');
    alterTaskOptionButton(currentSelection);
  }

  parentElement.classList.add('task-selected');
  alterTaskOptionButton(parentElement);
};

const removeTask = ({ parentElement }) => {
  const index = parseInt(parentElement.id, 10);

  TManager.remove(index);
  listView.removeChild(parentElement);
  reorderTasks(index);

  if (parentElement.children[0].checked && !TManager.hasDisabled) propClearTaskTrigger();
};

function createNewTask(event) {
  event.preventDefault();

  const newTask = {
    index: TManager.size,
    description: this.elements.desc.value,
    completed: false,
  };

  TManager.assign(newTask);
  listView.appendChild(renderTaskTemplate(newTask));

  commitTasks();

  this.reset();
}

function populateTasks() {
  return new Promise((resolve, reject) => {
    queryTasks();

    TManager.tasks.forEach((taskObj) => listView.appendChild(renderTaskTemplate(taskObj)));

    if (TManager.hasDisabled) propClearTaskTrigger();

    resolve();
  });
}

const setTaskDescription = (field) => {
  const { parentElement } = field;

  TManager.setDescription(parentElement.id, field.value);

  field.placeholder = field.value;
  field.value = '';

  commitTasks();
};

const removeCompletedTasks = () => {
  $selectAll(':checked', listView).forEach(({ parentElement }) => {
    TManager.setShadow(parentElement.id);
    listView.removeChild(parentElement);
  });

  TManager.filter();
  propClearTaskTrigger();
  reorderTasks();
};

window.addEventListener('DOMContentLoaded', () => {
  populateTasks().then(() => {});

  document.forms[0].onsubmit = createNewTask;

  $select('.clear-all-btn').onclick = removeCompletedTasks;

  document.body.addEventListener('click', ({ target }) => {
    if (target.classList.contains('task-trash')) {
      removeTask(target);
    } else if (target.classList.contains('task-desc')) {
      onTaskSelect(target);
    } else if (target.classList.contains('task-item')) {
      onTaskSelect({ parentElement: target });
    }
  });

  document.body.addEventListener('change', ({ target }) => {
    if (target.classList.contains('task-desc')) {
      setTaskDescription(target);
    } else if (target.classList.contains('task-stat')) {
      onTaskSelect(target);
      setTaskState(target);
    }
  });
});
