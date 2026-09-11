import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastContainerComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent {}
