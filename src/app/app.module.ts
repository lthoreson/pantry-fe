import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PantryComponent } from './components/pantry/pantry.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { RecipeBookComponent } from './components/recipe-book/recipe-book.component';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { EditItemComponent } from './components/edit-item/edit-item.component';
import { EditRecipeComponent } from './components/edit-recipe/edit-recipe.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import { AccountComponent } from './components/account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    PantryComponent,
    AddItemComponent,
    RecipeBookComponent,
    AddRecipeComponent,
    RecipeComponent,
    EditItemComponent,
    EditRecipeComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    MatStepperModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
