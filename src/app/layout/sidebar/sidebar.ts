import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  private authService = inject(AuthService);

  readonly brandLabel = 'SmartSchool';

  readonly navItems = computed<NavItem[]>(() => {
    switch (this.authService.role()) {
      case 'SUPER_ADMIN':
        return [
          { label: 'Dashboard', icon: 'bi-speedometer2', route: '/super-admin' },
          { label: 'Schools', icon: 'bi-building', route: '/super-admin/schools' },
        ];
      case 'SCHOOL_ADMIN':
        return [
          { label: 'Dashboard', icon: 'bi-speedometer2', route: '/school-admin' },
          { label: 'Students', icon: 'bi-mortarboard', route: '/school-admin/students' },
          { label: 'Teachers', icon: 'bi-person-workspace', route: '/school-admin/teachers' },
          { label: 'Parents', icon: 'bi-people', route: '/school-admin/parents' },
          { label: 'Classes', icon: 'bi-diagram-3', route: '/school-admin/classes' },
          { label: 'Exams', icon: 'bi-clipboard-check', route: '/school-admin/exams' },
        ];
      case 'TEACHER':
        return [
          { label: 'Dashboard', icon: 'bi-speedometer2', route: '/teacher' },
          { label: 'Homework', icon: 'bi-journal-text', route: '/teacher/homework' },
          { label: 'Tasks', icon: 'bi-list-check', route: '/teacher/tasks' },
          { label: 'Attendance', icon: 'bi-calendar2-check', route: '/teacher/attendance' },
          { label: 'Marks', icon: 'bi-award', route: '/teacher/marks' },
        ];
      case 'PARENT':
        return [
          { label: 'Dashboard', icon: 'bi-speedometer2', route: '/parent' },
          { label: 'Homework', icon: 'bi-journal-text', route: '/parent/homework' },
          { label: 'Attendance', icon: 'bi-calendar2-check', route: '/parent/attendance' },
          { label: 'Exams & Marks', icon: 'bi-award', route: '/parent/exams' },
          { label: 'Complaints', icon: 'bi-chat-left-text', route: '/parent/complaints' },
        ];
      default:
        return [];
    }
  });
}
