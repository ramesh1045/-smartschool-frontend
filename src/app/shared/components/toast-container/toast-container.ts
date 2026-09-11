import { Component, inject } from '@angular/core';
import { ToastService, ToastVariant } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  iconFor(variant: ToastVariant): string {
    const icons: Record<ToastVariant, string> = {
      success: 'bi-check-circle-fill',
      danger: 'bi-exclamation-octagon-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
    };
    return icons[variant];
  }
}
