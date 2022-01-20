import Project from './project';
import Storage from './storage';
import Task from './task';
import { format } from 'date-fns';

export default class UI {
    static loadHomepage(){
        UI.loadProjects();
        UI.projectButtons();
        UI.openProject('Home', document.getElementById('button-home-project'));
    }

    static loadProjects(){
        Storage.getTodo().getProjects().forEach((project) => {
            if (project.name !== 'Home' && project.name !== 'Today' && project.name !== 'This Week'){
                UI.createProject(project.name)
            }
        })
        UI.addProjectButtons();
    }

    static loadTasks(projectName) {
        Storage.getTodo().getProject(projectName).orderTasks().forEach((task) => {
            UI.createTask(task.name, task.dueDate)
        })
        UI.taskButtons();
        if (projectName !== 'Today' && projectName !== 'This Week'){
            UI.addTaskButtons();
        }
    }

    static loadProjectContent(projectName){
        const projectPreview = document.querySelector('.todos');

        projectPreview.innerHTML = `
            <h2 id="todosHeading">${projectName}</h2>
            <div id="tasksList"></div>
        `

        UI.loadTasks(projectName);
    }

    // creating content

    static createProject(name){
        const newProjects = document.querySelector(".proj");
        const icon = document.getElementById("new-project-form-dropdown");

        newProjects.innerHTML += `
            <button class="project-item">
            <div class="project-left-panel">
                <span>${icon.value}</span>
                <p>${name}</p>
            </div>
            <div class="project-right-panel">
                <i class="fas fa-times fa-sm project-delete-icon"></i>
            </div>
            </button>
        `
    }

    static createTask(name, dueDate){
        const tasksList = document.getElementById('tasksList');

        tasksList.innerHTML += `
            <button class="task">
                <div class="left-task-panel">
                    <i class="far fa-circle fa-lg circle"></i>
                    <p class="task-content">${name}</p>
                </div>
                <div class="right-task-panel">
                    <div class="task-date">${dueDate}</div>
                    <div class="task-edit">
                        <i class="fas fa-ellipsis-h fa-lg button-task-edit"></i>
                        <i class="fas fa-times fa-sm"></i>
                    </div>
                </div>
            </button>
        `
    }

    static clear() {
        UI.clearProjectPreview();
        UI.clearProjects();
        UI.clearTasks();
    }

    static clearProjectPreview() {
        const projectPreview = document.querySelector('.todos');
        projectPreview.textContent = ''
    }

    static clearProjects() {
        const projectList = document.querySelector('.proj');
        projectList.textContent = '';
    }

    static clearTasks() {
        const tasksList = document.getElementById('tasksList');
        tasksList.textContent = '';
    }

    static closeAllPopups() {
        UI.closeAddProjectPopup();
        if (document.getElementById('add-task-button')) {
            UI.closeAddTaskPopup()
        };
    }


    // add event listener

    static addProjectButtons(){
        const addProjectButton = document.getElementById('button-add-project');
        const addProjectPopupButton = document.getElementById('button-add-project-popup');
        const cancelProjectPopupButton = document.getElementById('button-cancel-project-button');

        addProjectButton.addEventListener('click', UI.openAddProjectPopup)
        addProjectPopupButton.addEventListener('click', UI.addProject)
        cancelProjectPopupButton.addEventListener('click', UI.closeAddProjectPopup)
    }
    
    static openAddProjectPopup() {
        const addProjectPopup = document.querySelector('.project-form');
        const addOverlayBlur = document.querySelector('.overlay-new');
        UI.closeAllPopups();
        addOverlayBlur.classList.add('create-overlay');
        addProjectPopup.classList.add('create-form')
    }

    static closeAddProjectPopup() {
        const addProjectPopup = document.querySelector('.project-form');
        const addProjectInputPopup = document.getElementById('input-add-project-popup');
        const addOverlayBlur = document.querySelector('.overlay-new');

        addProjectPopup.classList.remove('create-form');
        addOverlayBlur.classList.remove('create-overlay');
        addProjectInputPopup.value = '';
    }

    static addProject() {
        const addProjectInputPopup = document.getElementById('input-add-project-popup');
        const projectName = addProjectInputPopup.value;
        
        if (projectName === ''){
            alert("Project name can't be empty");
            return
        }

        if (Storage.getTodo().contains(projectName)) {
            addProjectInputPopup.value = '';
            alert("Project names must be different");
            return;
        }

        Storage.addProject(new Project(projectName));
        UI.createProject(projectName);
        UI.closeAddProjectPopup();
    }

    static projectButtons() {
        const homeProjectButton = document.getElementById('button-home-project');
        const todayProjectButton = document.getElementById('button-today-project')
        const weekProjectButton = document.getElementById('button-week-project')
        const projectButtons = document.querySelectorAll('.project-item')

        homeProjectButton.addEventListener('click', UI.openHomeTasks)
        todayProjectButton.addEventListener('click', UI.openTodayTasks)
        weekProjectButton.addEventListener('click', UI.openWeekTasks)
        projectButtons.forEach((projectButton) => {
            projectButton.addEventListener('click', UI.handleProjectButton)
        })
    }

    static openHomeTasks() {
        UI.openProject('Home', this)
    }

    static openTodayTasks() {
        Storage.updateTodayProject();
        UI.openProject('Today', this);
    }

    static openWeekTasks() {
        Storage.updateWeekProject();
        UI.openProject('This Week', this);
    }

    static handleProjectButton(e) {
        const projectName = this.children[0].children[1].innerHTML;

        if (e.target.classList.contains('fa-times')){
            UI.deleteProject(projectName, this);
            return;
        }

        UI.openProject(projectName, this);
    }

    static openProject(projectName, projectButton) {
        const defaultProjectButtons = document.querySelectorAll('.button-default-project');
        const projectButtons = document.querySelectorAll('.project-item');
        const buttons = [...defaultProjectButtons, ...projectButtons];

        buttons.forEach((button) => button.classList.remove('active'));
        projectButton.classList.add('active');
        UI.closeAddProjectPopup();
        UI.loadProjectContent(projectName);
    }

    static deleteProject(projectName, button){
        if (button.classList.contains('active')){
            UI.clearProjectPreview();
        }
        Storage.deleteProject(projectName);
        UI.clearProjects();
        UI.loadProjects();
    }

    // add task event listener

    static addTaskButtons() {
        const addTaskButton = document.getElementById('add-task-button');
        const addTaskPopupButton = document.getElementById('button-add-task-submit');
        const cancelTaskPopupButton = document.getElementById('button-cancel-task-button');
        const addPriorityButtons = document.querySelectorAll('.new-form-add-priority-button')

        addTaskButton.addEventListener('click', UI.openAddTaskPopup);
        addTaskPopupButton.addEventListener('click', UI.addTask);
        cancelTaskPopupButton.addEventListener('click', UI.closeAddTaskPopup);
        addPriorityButtons.forEach((button) => button.addEventListener('click', UI.priorityButtonActive))
    }
    
    // start of priority button logic
    static priorityButtonActive(e){
        UI.closeOtherPriorityActive();
        e.target.classList.add('priority-active');
    }
    
    static closeOtherPriorityActive() {
        const priorityButtons = document.querySelectorAll('.new-form-add-priority-button');
        priorityButtons.forEach((button) => {
            button.classList.remove('priority-active');
        })
    }
    // end of priority button logic

    static openAddTaskPopup() {
        const addTaskPopup = document.querySelector('.new-task');
        const addOverlayBlur = document.querySelector('.overlay-new');
        UI.closeAllPopups();
        addOverlayBlur.classList.add('create-overlay');
        addTaskPopup.classList.add('create-form');
    }

    static closeAddTaskPopup() {
        const addTaskPopup = document.querySelector('.new-task');
        const addTaskInputsPopup = document.querySelector('.new-form-text');
        const addOverlayBlur = document.querySelector('.overlay-new');
        addTaskPopup.classList.remove('create-form');
        addOverlayBlur.classList.remove('create-overlay');
        addTaskInputsPopup.innerHTML = '';
    }

    static addTask() {
        const projectName = document.getElementById('todosHeading').innerHTML;
        const addTaskPopupInput = document.querySelector('.title');
        const taskName = addTaskPopupInput.value;
        const addTaskPopupDate = document.querySelector('.new-form-date-input');
        const taskPopupPriority = Number(document.querySelector('.priority-active').dataset.priority)
        const dueDate = format(new Date(addTaskPopupDate.value), 'dd/MM/yyyy');

        if (taskName === ''){
            alert("Task name must be different");
            return;
        }
        if (Storage.getTodo().getProject(projectName).contains(taskName)){
            alert('Task names must be different');
            addTaskPopupInput.value = '';
            return;
        }


        Storage.addTask(projectName, new Task(taskName, taskPopupPriority, dueDate));

        UI.closeAddTaskPopup();
        UI.clearTasks();
        UI.loadTasks(projectName);
    }

    static taskButtons() {
        const taskButtons = document.querySelectorAll('.task');

        taskButtons.forEach((button) => {
            button.addEventListener('click', UI.handleTaskButton);
        })
    }

    static handleTaskButton(e) {
        if (e.target.classList.contains('fa-circle')){
            UI.setTaskCompleted(this);
            return;
        }
        if (e.target.classList.contains('button-task-edit')){
            UI.openTaskEdit(this);
            return;
        }
        if (e.target.classList.contains('fa-times')){
            UI.deleteTask(this);
            return;
        }
    }

    static setTaskCompleted(taskButton) {
        const projectName = document.getElementById("todosHeading").innerHTML;
        const taskName = taskButton.children[0].children[1].textContent.trim();

        if (projectName === 'Today' || projectName === 'This Week') {
            const parentProjectName = taskName.split('(')[1].split(')')[0];
            Storage.deleteTask(parentProjectName, taskName.split(' ')[0])
            if (projectName === 'Today'){
                Storage.updateTodayProject();
            } else {
                Storage.updateWeekProject();
            }
        } else {
            Storage.deleteTask(projectName, taskName);
        }

        UI.clearTasks();
        UI.loadTasks(projectName);
    }

    static deleteTask(taskButton) {
        const projectName = document.getElementById("todosHeading").innerHTML;
        const taskName = taskButton.children[0].children[1].textContent.trim();

        if (projectName === 'Today' || projectName === 'This Weel'){
            const mainProjectName = taskName.split('(')[1].split(')')[0];
            Storage.deleteTask(mainProjectName, taskName);
        }
        Storage.deleteTask(projectName, taskName);
        UI.clearTasks();
        UI.loadTasks(projectName);
    }

    static openTaskEdit(button) {
        let editWindow = document.querySelector('.edit-task');
        let editTitleInput = document.getElementById('edit-task-title');
        let updateEditButton = document.getElementById('edit-task-update');
        let editDueDate = document.getElementById('edit-task-edit-dueDate');
        let priorityButtons = document.querySelectorAll('.new-form-priority-edit-button')
        let closeButton = document.getElementById('button-cancel-task-edit-button');
        const addOverlayBlur = document.querySelector('.overlay-new');

        const taskName = button.children[0].children[1].textContent.trim();
        const projectName = document.getElementById('todosHeading').textContent.trim();

        editWindow.classList.add('create-form');
        addOverlayBlur.classList.add('create-overlay');
        editTitleInput.innerHTML = taskName;
        let newDate = format(new Date(Storage.getTodo().getProject(projectName).getTask(taskName).getDateFormatted()), 'yyyy-MM-dd')
        editDueDate.value = newDate;

        const priorityValue = Storage.getTodo().getProject(projectName).getTask(taskName).getPriority();
        const priorityEditButton = document.querySelector(`[data-edit-priority = "${priorityValue}"]`)

        priorityEditButton.classList.add('priority-edit-active');

        closeButton.addEventListener('click', UI.closeTaskEdit);

        priorityButtons.forEach((btn) => {
            btn.addEventListener('click', UI.priorityEditButtonActive)
        })

        updateEditButton.addEventListener('click', () => UI.updateTask(button))
        // note: change/add clear function
        // also need to clear priority button class after each submit
    }

    static closeTaskEdit() {
        const editWindow = document.querySelector('.edit-task');
        const addOverlayBlur = document.querySelector('.overlay-new');
        addOverlayBlur.classList.remove('create-overlay');
        editWindow.classList.remove('create-form');
        UI.closeEditButtonActive();
    }

    static updateTask(button) {
        const newTitle = document.getElementById('edit-task-title').value;
        const newDueDate = document.getElementById('edit-task-edit-dueDate').value;
        const taskName = button.children[0].children[1].textContent.trim();
        const newPriority = Number(document.querySelector('.priority-edit-active').dataset.editPriority);
        const projectName = document.getElementById('todosHeading').textContent.trim();

        if (projectName === 'Today' || projectName === 'This Week'){
            const mainProjectName = taskName.split('(')[1].split(')')[0];
            const mainTaskName = taskName.split(' ')[0];
            Storage.renameTask(
                projectName,
                taskName,
                `${newTitle} (${mainProjectName})`
              )
            Storage.renameTask(mainProjectName, mainTaskName, newTitle);
            Storage.setTaskDate(projectName, taskName, newDueDate);
            Storage.setTaskDate(mainProjectName, mainTaskName, newDueDate);
            Storage.setPriority(projectName, taskName, newPriority);
            Storage.setPriority(mainProjectName, mainTaskName, newPriority);
            if (projectName === 'Today'){
                Storage.updateTodayProject();
            } else {
                Storage.updateWeekProject();
            }
        } else {
            Storage.renameTask(projectName, taskName, newTitle);
            Storage.setTaskDate(projectName, taskName, format(new Date(newDueDate), 'dd/MM/yyyy'));
            Storage.setPriority(projectName, taskName, newPriority);
        }

        UI.clearTasks();
        UI.loadTasks(projectName);
    }

    static priorityEditButtonActive(e) {
        UI.closeOtherEditPriorityActive();
        e.target.classList.add('priority-edit-active');
    }

    static closeOtherEditPriorityActive() {
        const priorityButtons = document.querySelectorAll('.new-form-priority-edit-button');
        priorityButtons.forEach((button) => {
            button.classList.remove('priority-edit-active');
        })
    }
    static closeEditButtonActive() {
        const priorityButtons = document.querySelectorAll('.new-form-priority-edit-button');
        priorityButtons.forEach((button) => {
            button.classList.remove('priority-edit-active');
        })
    }
}