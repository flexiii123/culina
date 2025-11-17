import { Component, EventEmitter, Output } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.component.html',
  styleUrls: ['./upload-recipe.component.css']
})
export class UploadRecipeComponent {
  @Output() recipeUploaded = new EventEmitter<void>();
  @Output() cancelClick = new EventEmitter<void>();

  title = '';
  description = '';
  cookTime = '';
  difficulty: 'Einfach' | 'Mittel' | 'Schwer' = 'Mittel';
  ingredients: string[] = [''];
  instructions: string[] = [''];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  submitting = false;

  constructor(private recipeService: RecipeService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Bildvorschau erstellen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addIngredient() {
    this.ingredients.push('');
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.splice(index, 1);
    }
  }

  updateIngredient(index: number, value: string) {
    this.ingredients[index] = value;
  }

  addInstruction() {
    this.instructions.push('');
  }

  removeInstruction(index: number) {
    if (this.instructions.length > 1) {
      this.instructions.splice(index, 1);
    }
  }

  updateInstruction(index: number, value: string) {
    this.instructions[index] = value;
  }

  onSubmit() {
    // Validierung
    if (!this.title || !this.description || !this.cookTime || !this.selectedFile) {
      alert('Bitte fülle alle Pflichtfelder aus und wähle ein Bild aus.');
      return;
    }

    const filteredIngredients = this.ingredients.filter(i => i.trim() !== '');
    const filteredInstructions = this.instructions.filter(i => i.trim() !== '');

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      alert('Bitte füge mindestens eine Zutat und eine Anweisung hinzu.');
      return;
    }

    // FormData erstellen
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('cookTime', this.cookTime);
    formData.append('difficulty', this.difficulty);
    formData.append('ingredients', JSON.stringify(filteredIngredients));
    formData.append('instructions', JSON.stringify(filteredInstructions));
    formData.append('image', this.selectedFile);

    this.submitting = true;

    this.recipeService.createRecipe(formData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Rezept erfolgreich hochgeladen!');
          this.recipeUploaded.emit();
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Fehler beim Hochladen:', error);
        alert(error.error?.message || 'Fehler beim Hochladen des Rezepts.');
        this.submitting = false;
      }
    });
  }

  onCancel() {
    this.cancelClick.emit();
  }
}
