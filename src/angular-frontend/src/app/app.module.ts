import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { RecipeGridComponent } from './components/recipe-grid/recipe-grid.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { UploadRecipeComponent } from './components/upload-recipe/upload-recipe.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './components/register-dialog/register-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipeGridComponent,
    RecipeDetailComponent,
    UploadRecipeComponent,
    LoginDialogComponent,
    RegisterDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
