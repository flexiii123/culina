import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/recipe.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() currentView: string = 'home';
  @Output() uploadClick = new EventEmitter<void>();
  @Output() homeClick = new EventEmitter<void>();
  @Output() loginClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  currentUser: User | null = null;

  constructor(public authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onUploadClick() {
    this.uploadClick.emit();
  }

  onHomeClick() {
    this.homeClick.emit();
  }

  onLoginClick() {
    this.loginClick.emit();
  }

  onLogoutClick() {
    this.logoutClick.emit();
  }
}
