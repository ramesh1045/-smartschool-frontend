import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-school-admin-dashboard",
  standalone: true,
  templateUrl: "./dashboard.html",
})
export class SchoolAdminDashboardPlaceholder {
  authService = inject(AuthService);
}
