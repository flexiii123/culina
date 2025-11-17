import { Component, OnInit } from '@angular/core';
import { RecipeService } from './services/recipe.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentView: 'home' | 'detail' | 'upload' = 'home';
  selectedRecipeId: number | null = null;
  showLoginDialog = false;
  showRegisterDialog = false;

  constructor(
    public authService: AuthService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.authService.checkAuthStatus();
  }

  onRecipeClick(recipeId: number) {
    this.selectedRecipeId = recipeId;
    this.currentView = 'detail';
  }

  onBackToHome() {
    this.currentView = 'home';
    this.selectedRecipeId = null;
  }

  onUploadClick() {
    if (!this.authService.isAuthenticated()) {
      this.showLoginDialog = true;
    } else {
      this.currentView = 'upload';
    }
  }

  onRecipeUploaded() {
    this.currentView = 'home';
    // Rezepte neu laden
    window.location.reload();
  }

  openLogin() {
    this.showLoginDialog = true;
    this.showRegisterDialog = false;
  }

  openRegister() {
    this.showRegisterDialog = true;
    this.showLoginDialog = false;
  }

  closeDialogs() {
    this.showLoginDialog = false;
    this.showRegisterDialog = false;
  }

  onLoginSuccess() {
    this.closeDialogs();
    if (this.currentView === 'upload') {
      // Bleib auf Upload-Seite
    } else {
      window.location.reload();
    }
  }

  logout() {
    this.authService.logout();
    this.currentView = 'home';
  }
}
