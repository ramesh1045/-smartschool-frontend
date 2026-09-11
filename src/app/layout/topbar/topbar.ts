import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class TopbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  roleLabel(): string {
    const labels: Record<string, string> = {
      SUPER_ADMIN: 'Super Admin',
      SCHOOL_ADMIN: 'School Admin',
      TEACHER: 'Teacher',
      PARENT: 'Parent',
    };
    return labels[this.authService.role() ?? ''] ?? '';
  }
}
