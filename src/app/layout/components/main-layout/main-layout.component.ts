import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent],
  template: `
    <app-topbar />
    <div class="container py-3">
      <router-outlet />
    </div>
  `
})
export class MainLayoutComponent {}
