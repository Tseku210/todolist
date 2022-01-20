export default class Task {
    constructor(name, priority=1, dueDate="no Date"){
        this.name = name;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setDate(dueDate){
        this.dueDate = dueDate;
    }

    getDate(){
        return this.dueDate;
    }

    setPriority(priority){
        this.priority = priority;
    }

    getPriority(){
        return this.priority;
    }

    getDateFormatted(){
        const day = this.dueDate.split('/')[0];
        const month = this.dueDate.split('/')[1];
        const year = this.dueDate.split('/')[2];
        return `${month}/${day}/${year}`;
    }
}