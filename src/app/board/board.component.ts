import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.component.html'
})
export class BoardComponent {
  @Input() tasks: any[] = [];
  @Output() statusChanged = new EventEmitter<any>();

  onStatusUpdate(task: any) {
    this.statusChanged.emit({ desc: task.desc, assigned: task.assigned, status: task.status });
  }
}
