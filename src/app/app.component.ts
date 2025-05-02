import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  template: `<div class="container py-4"><app-dashboard></app-dashboard></div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
