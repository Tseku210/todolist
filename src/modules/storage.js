import Project from './project';
import Task from './task';
import ToDo from './todo';

export default class Storage {
    static saveTodo(data){
        localStorage.setItem('todo', JSON.stringify(data));
    }

    static getTodo(){
        const todo = Object.assign(
            new ToDo(),
            JSON.parse(localStorage.getItem('todo'))
        )

        todo.setProjects(
            todo.getProjects().map((project) => Object.assign(new Project(), project))
        )

        todo.getProjects().forEach((project) => project.setTasks(project.getTasks().map((task) => Object.assign(new Task(), task))))

        return todo;
    }

    static addProject(project){
        const todo = Storage.getTodo();
        todo.addProject(project);
        Storage.saveTodo(todo);
    }

    static deleteProject(project){
        const todo = Storage.getTodo();
        todo.deleteProject(project);
        Storage.saveTodo(todo);
    }

    static addTask(projectName, task){
        const todo = Storage.getTodo();
        todo.getProject(projectName).addTask(task);
        Storage.saveTodo(todo);
    }

    static deleteTask(projectName, taskName){
        const todo = Storage.getTodo();
        todo.getProject(projectName).deleteTask(taskName);
        Storage.saveTodo(todo);
    }

    static deleteTasks() {
        const todo = Storage.getTodo();
        todo.getProjects().forEach((project) => project.deleteTasks());
        Storage.saveTodo(todo);
    }

    static renameTask(projectName, taskName, newTaskName){
        const todo = Storage.getTodo();
        todo.getProject(projectName).getTask(taskName).setName(newTaskName);
        Storage.saveTodo(todo);
    }

    static setTaskDate(projectName, taskName, newDueDate){
        const todo = Storage.getTodo();
        todo.getProject(projectName).getTask(taskName).setDate(newDueDate);
        Storage.saveTodo(todo);
    }

    static setPriority(projectName, taskName, newPriority){
        const todo = Storage.getTodo();
        todo.getProject(projectName).getTask(taskName).setPriority(newPriority);
        Storage.saveTodo(todo);
    }

    static updateTodayProject(){
        const todo = Storage.getTodo();
        todo.updateTodayProject();
        Storage.saveTodo(todo);
    }

    static updateWeekProject(){
        const todo = Storage.getTodo();
        todo.updateWeekProject();
        Storage.saveTodo(todo);
    }
}