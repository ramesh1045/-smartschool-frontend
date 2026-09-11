import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-teacher-dashboard",
  standalone: true,
  templateUrl: "./dashboard.html",
})
export class TeacherDashboardPlaceholder {
  authService = inject(AuthService);
}
