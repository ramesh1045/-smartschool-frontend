import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly currentYear = new Date().getFullYear();

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      const user = await this.authService.login(this.form.getRawValue());
      const target =
        user.role === 'SUPER_ADMIN'
          ? '/super-admin'
          : user.role === 'SCHOOL_ADMIN'
          ? '/school-admin'
          : user.role === 'TEACHER'
          ? '/teacher'
          : '/parent';
      this.router.navigateByUrl(target);
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message as string | undefined) ?? 'Login failed. Please try again.'
          : 'Login failed. Please try again.';
      this.errorMessage.set(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
