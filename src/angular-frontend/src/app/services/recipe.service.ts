import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Recipe, RecipeDetail, ApiResponse } from '../models/recipe.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getRecipes(page: number = 1, limit: number = 20): Observable<ApiResponse<{ recipes: Recipe[], pagination: any }>> {
    console.log('📤 Ajax-Request wird an PHP-Backend gesendet:', {
      endpoint: `${this.apiUrl}/recipes/list.php`,
      method: 'GET',
      params: { page, limit }
    });

    return this.http.get<ApiResponse<{ recipes: Recipe[], pagination: any }>>(
      `${this.apiUrl}/recipes/list.php?page=${page}&limit=${limit}`
    ).pipe(
      tap(response => {
        console.log('✅ Rezepte erfolgreich geladen:', response.data?.recipes.length);
      })
    );
  }

  getRecipeById(id: number): Observable<ApiResponse<RecipeDetail>> {
    console.log('📤 Ajax-Request wird an PHP-Backend gesendet:', {
      endpoint: `${this.apiUrl}/recipes/detail.php`,
      method: 'GET',
      params: { id }
    });

    return this.http.get<ApiResponse<RecipeDetail>>(
      `${this.apiUrl}/recipes/detail.php?id=${id}`
    ).pipe(
      tap(response => {
        console.log('✅ Rezeptdetails erfolgreich geladen:', response.data?.title);
      })
    );
  }

  createRecipe(formData: FormData): Observable<ApiResponse<any>> {
    console.log('📤 Ajax-Request (mit Datei-Upload) wird an PHP-Backend gesendet:', {
      endpoint: `${this.apiUrl}/recipes/create.php`,
      method: 'POST',
      contentType: 'multipart/form-data',
      data: {
        title: formData.get('title'),
        description: formData.get('description'),
        cookTime: formData.get('cookTime'),
        difficulty: formData.get('difficulty'),
        ingredients: 'Array',
        instructions: 'Array',
        image: 'File'
      }
    });

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/recipes/create.php`,
      formData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('✅ Rezept erfolgreich erstellt:', response.data);
      })
    );
  }

  createRating(recipeId: number, rating: number, comment: string): Observable<ApiResponse<any>> {
    console.log('📤 Ajax-Request (asynchron) wird an PHP-Backend gesendet:', {
      endpoint: `${this.apiUrl}/ratings/create.php`,
      method: 'POST',
      data: { recipe_id: recipeId, rating, comment }
    });

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/ratings/create.php`,
      { recipe_id: recipeId, rating, comment },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('✅ Bewertung erfolgreich erstellt (Ajax ohne Reload):', response.data);
      })
    );
  }
}
