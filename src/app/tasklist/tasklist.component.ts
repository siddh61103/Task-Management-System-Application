import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  currentMonth = ('0'+(new Date().getMonth()+1)).slice(-2);
  taskArray = [
    {
      taskname: "Brush teeth",
      priority: "Low",
      isCompleted: false,
      description: "Enter Description",
      isProgress: false,
      dueDate: `${new Date().getFullYear()}-${this.currentMonth}-${new Date().getDate()}`,
      isEditable: false
    }
  ];
  
  sortOption = 'date'; // Default sort option

  ngOnInit() {
    this.loadTasksFromLocalStorage();
    this.sortTasks(); // Ensure tasks are sorted on initialization
  }

  onSubmit(form: NgForm) {
    const newTask = {
      taskname: form.controls['task'].value,
      description: form.controls['description'].value,
      priority: form.controls['priority'].value,
      isCompleted: false,
      isProgress: false,
      dueDate: form.controls['date'].value,
      isEditable: false
    };
    this.taskArray.push(newTask);
    this.sortTasks();
    this.saveTasksToLocalStorage();
    form.reset();
  }

  onDelete(index: number) {
    this.taskArray.splice(index, 1);
    this.sortTasks();
    this.saveTasksToLocalStorage();
  }

  onCheck(index: number) {
    this.taskArray[index].isCompleted = !this.taskArray[index].isCompleted;
    this.sortTasks();
    this.saveTasksToLocalStorage();
  }

  onProgress(index: number) {
    this.taskArray[index].isProgress = !this.taskArray[index].isProgress;
    this.sortTasks();
    this.saveTasksToLocalStorage();
  }

  onEdit(index: number) {
    this.taskArray[index].isEditable = true;
  }

  onSave(index: number, newtask: string) {
    this.taskArray[index].taskname = newtask;
    this.taskArray[index].isEditable = false;
    this.sortTasks();
    this.saveTasksToLocalStorage();
  }

  sortTasks() {
    switch (this.sortOption) {
      case 'priority':
        this.taskArray.sort((a, b) => this.comparePriority(a.priority, b.priority));
        break;
      case 'date':
        this.taskArray.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'status':
        this.taskArray.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
        break;
    }
  }

  comparePriority(a: string, b: string): number {
    const priorityOrder: { [key: string]: number } = { High: 1, Medium: 2, Low: 3 };
    return (priorityOrder[a as keyof typeof priorityOrder] || 0) - (priorityOrder[b as keyof typeof priorityOrder] || 0);
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.taskArray));
  }

  loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.taskArray = JSON.parse(tasks);
    }
  }

  exportToCSV() {
    const csvData = this.convertToCSV(this.taskArray);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'tasks.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  convertToCSV(data: any[]) {
    const headers = ['Task Name', 'Description', 'Completed', 'In Progress', 'Priority', 'Due Date'];
    const rows = data.map(task => 
      `${task.taskname},${task.description},${task.isCompleted},${task.isProgress},${task.priority},${task.dueDate}`
    );
    return [headers.join(','), ...rows].join('\n');
  }
}
