import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'danger' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  variant: ToastVariant;
  text: string;
}

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(text: string, variant: ToastVariant = 'info', durationMs = 4000): void {
    const toast: ToastMessage = { id: nextId++, variant, text };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), durationMs);
  }

  success(text: string): void {
    this.show(text, 'success');
  }

  error(text: string): void {
    this.show(text, 'danger', 6000);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
