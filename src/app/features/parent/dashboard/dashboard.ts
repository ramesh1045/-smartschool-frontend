import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-parent-dashboard",
  standalone: true,
  templateUrl: "./dashboard.html",
})
export class ParentDashboardPlaceholder {
  authService = inject(AuthService);
}
