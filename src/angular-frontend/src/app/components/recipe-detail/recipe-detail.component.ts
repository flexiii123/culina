import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { RecipeDetail } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipeId!: number;
  @Output() backClick = new EventEmitter<void>();

  recipe: RecipeDetail | null = null;
  loading = true;
  error: string | null = null;

  // Rating Form
  showRatingForm = false;
  selectedRating = 0;
  ratingComment = '';
  submittingRating = false;

  constructor(
    private recipeService: RecipeService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (this.recipeId) {
      this.loadRecipe();
    }
  }

  loadRecipe() {
    this.loading = true;
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recipe = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Fehler beim Laden des Rezepts:', error);
        this.error = 'Rezept konnte nicht geladen werden.';
        this.loading = false;
      }
    });
  }

  onBackClick() {
    this.backClick.emit();
  }

  onAddRatingClick() {
    if (!this.authService.isAuthenticated()) {
      alert('Bitte melde dich an, um eine Bewertung abzugeben.');
      return;
    }
    this.showRatingForm = true;
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  submitRating() {
    if (this.selectedRating === 0) {
      alert('Bitte wähle eine Bewertung aus.');
      return;
    }

    this.submittingRating = true;

    this.recipeService.createRating(this.recipeId, this.selectedRating, this.ratingComment)
      .subscribe({
        next: (response) => {
          if (response.success) {
            alert('Bewertung erfolgreich hinzugefügt!');
            this.showRatingForm = false;
            this.selectedRating = 0;
            this.ratingComment = '';
            // Rezept neu laden, um neue Bewertung anzuzeigen
            this.loadRecipe();
          }
          this.submittingRating = false;
        },
        error: (error) => {
          console.error('Fehler beim Speichern der Bewertung:', error);
          alert(error.error?.message || 'Fehler beim Speichern der Bewertung.');
          this.submittingRating = false;
        }
      });
  }

  cancelRating() {
    this.showRatingForm = false;
    this.selectedRating = 0;
    this.ratingComment = '';
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }

  getRatingStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Einfach': return 'bg-green-100 text-green-800';
      case 'Mittel': return 'bg-yellow-100 text-yellow-800';
      case 'Schwer': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
