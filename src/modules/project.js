import { isThisWeek, isToday, compareAsc, subDays, toDate } from "date-fns";
import Task from "./task";

export default class Project {
    constructor(name){
        this.name = name;
        this.tasks = [];
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }
    setTasks(tasks){
        this.tasks = tasks;
    }
    getTasks(){
        return this.tasks;
    }
    getTask(taskName){
        return this.tasks.find((task) => task.getName() === taskName);
    }
    contains(taskName){
        return this.tasks.some((task) => task.getName() === taskName);
    }

    addTask(newTask){
        if (this.tasks.find((task) => task.getName() === newTask.name)) return;
        this.tasks.push(newTask);
    }

    deleteTask(taskName){
        this.tasks = this.tasks.filter((task) => task.getName() !== taskName);
    }

    deleteTasks() {
        this.tasks = [];
    }

    orderTasks(){
        let high = [];
        let medium = [];
        let low = [];

        if (this.tasks.length === 0) return this.tasks;

        for(let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].getPriority() === 3){
                high.push(this.tasks[i]);
            } else if (this.tasks[i].getPriority() === 2){
                medium.push(this.tasks[i]);
            } else if (this.tasks[i].getPriority() === 1){
                low.push(this.tasks[i]);
            }
        };

        let orderedTasks = [];

        let realOrderedTasks = orderedTasks.concat(
            high.sort(compareAsc).reverse(),
            medium.sort(compareAsc).reverse(),
            low.sort(compareAsc).reverse()
        );
        
        this.tasks = realOrderedTasks;
        return this.tasks;
    }

    getTasksToday(){
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getDateFormatted());
            return isToday(toDate(taskDate));
        })
    }

    getTasksThisWeek(){
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getDateFormatted());
            return isThisWeek(subDays(toDate(taskDate), 1))
        })
    }
}