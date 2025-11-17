import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  email = '';
  password = '';
  submitting = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Bitte fülle alle Felder aus.';
      return;
    }

    this.submitting = true;
    this.error = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.loginSuccess.emit();
        } else {
          this.error = response.message;
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Login-Fehler:', error);
        this.error = error.error?.message || 'Login fehlgeschlagen. Bitte versuche es erneut.';
        this.submitting = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  onSwitchToRegister() {
    this.switchToRegister.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
