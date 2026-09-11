import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-super-admin-dashboard",
  standalone: true,
  templateUrl: "./dashboard.html",
})
export class SuperAdminDashboardPlaceholder {
  authService = inject(AuthService);
}
