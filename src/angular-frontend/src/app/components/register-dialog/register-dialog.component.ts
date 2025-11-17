import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  submitting = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit() {
    // Validierung
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Bitte fülle alle Felder aus.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwörter stimmen nicht überein.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Passwort muss mindestens 6 Zeichen lang sein.';
      return;
    }

    this.submitting = true;
    this.error = null;

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.registerSuccess.emit();
        } else {
          this.error = response.message;
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Registrierungs-Fehler:', error);
        this.error = error.error?.message || 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
        this.submitting = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
