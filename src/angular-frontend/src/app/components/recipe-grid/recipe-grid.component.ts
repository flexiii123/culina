import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-grid',
  templateUrl: './recipe-grid.component.html',
  styleUrls: ['./recipe-grid.component.css']
})
export class RecipeGridComponent implements OnInit {
  @Output() recipeClick = new EventEmitter<number>();

  recipes: Recipe[] = [];
  loading = true;
  error: string | null = null;

  backendUrl = 'http://localhost:8000';
  
  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.loading = true;
    this.recipeService.getRecipes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recipes = response.data.recipes;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Rezepte:', error);
        this.error = 'Rezepte konnten nicht geladen werden. Verwende Mock-Daten.';
        this.loadMockRecipes();
        this.loading = false;
      }
    });
  }

  loadMockRecipes() {
    // Mock-Daten für Demonstration
    this.recipes = [
      {
        id: 1,
        title: 'Pasta Carbonara',
        description: 'Klassische italienische Pasta mit cremiger Sauce',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
        cookTime: '30 Min',
        difficulty: 'Mittel',
        author: 'Maria Rossi',
        authorId: 1,
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        averageRating: 4.5,
        ratingCount: 12
      },
      {
        id: 2,
        title: 'Thai Green Curry',
        description: 'Würziges grünes Curry mit Kokosmilch und Gemüse',
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
        cookTime: '45 Min',
        difficulty: 'Schwer',
        author: 'Chen Wei',
        authorId: 2,
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen',
        averageRating: 4.8,
        ratingCount: 24
      },
      {
        id: 3,
        title: 'Caesar Salad',
        description: 'Frischer Salat mit Parmesan und hausgemachtem Dressing',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
        cookTime: '15 Min',
        difficulty: 'Einfach',
        author: 'John Smith',
        authorId: 3,
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        averageRating: 4.2,
        ratingCount: 8
      }
    ];
  }

  onRecipeClick(recipeId: number) {
    this.recipeClick.emit(recipeId);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Einfach': return 'bg-green-100 text-green-800';
      case 'Mittel': return 'bg-yellow-100 text-yellow-800';
      case 'Schwer': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }
}
