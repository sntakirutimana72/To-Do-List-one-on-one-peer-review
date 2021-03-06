import {
  populateTasks, createNewTask, removeCompletedTasks,
  removeTask, onTaskSelect, setTaskDescription,
} from './modules/CRUD.js';
import { $select } from './modules/selectors.js';
import setTaskState from './modules/set-state.js';
import './index.css';

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
