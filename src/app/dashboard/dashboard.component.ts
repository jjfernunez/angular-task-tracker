// dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray
} from '@angular/cdk/drag-drop';

interface Task {
  desc: string;
  days: number;
  assigned: string;
  status: 'in progress' | 'testing' | 'completed';
}

interface Member {
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  team = { name: 'Equipo A', members: [] as Member[] };
  newMember = '';
  showPopup = false;
  popupColumn: Task['status'] = 'in progress';
  editingTask: Task | null = null;
  newTask: Task = { desc: '', days: 1, assigned: '', status: 'in progress' };

  // Tres listas planas para CDK
  inProgress: Task[] = [];
  testing: Task[] = [];
  completed: Task[] = [];

  statuses = ['in progress', 'testing', 'completed'] as const;

  addMember() {
    if (!this.newMember.trim()) return;
    this.team.members.push({ name: this.newMember.trim(), tasks: [] });
    this.newMember = '';
    this.reloadLists();
  }

  openPopup(status: Task['status'], task: Task | null = null) {
    this.popupColumn = status;
    this.editingTask = task;
    this.newTask = task
      ? { ...task }
      : { desc: '', days: 1, assigned: '', status };
    this.showPopup = true;
  }

  createTask() {
    let member = this.team.members.find(m => m.name === this.newTask.assigned);
    if (!member) {
      member = { name: this.newTask.assigned, tasks: [] };
      this.team.members.push(member);
    }
    if (this.editingTask) {
      this.deleteTask(this.editingTask.assigned, this.editingTask.desc);
    }
    member.tasks.push({ ...this.newTask });
    this.showPopup = false;
    this.reloadLists();
  }

  deleteTask(memberName: string, desc: string) {
    const member = this.team.members.find(m => m.name === memberName);
    if (!member) return;
    member.tasks = member.tasks.filter(t => t.desc !== desc);
    this.reloadLists();
  }

  reloadLists() {
    const all = this.team.members.flatMap(m =>
      m.tasks.map(t => ({ ...t, assigned: m.name }))
    );
    this.inProgress = all.filter(t => t.status === 'in progress');
    this.testing    = all.filter(t => t.status === 'testing');
    this.completed  = all.filter(t => t.status === 'completed');
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: Task['status']) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Actualiza el status de la tarea
    const task = event.container.data[event.currentIndex];
    task.status = newStatus as Task['status'];

    // Refleja el cambio en el array original de members/tasks
    const member = this.team.members.find(m => m.name === task.assigned)!;
    const original = member.tasks.find(t => t.desc === task.desc)!;
    original.status = newStatus;

    // Recarga para mantener sincronizado
    this.reloadLists();
  }
}
