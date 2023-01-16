import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Recipe } from 'src/app/data/Recipe';
import { AccountService } from 'src/app/services/account.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent {
  constructor(private dialog: MatDialog, public account: AccountService) {}

  openAdd() {
    const dialogRef = this.dialog.open(AddRecipeComponent, {restoreFocus: false});
  }

  openEdit(recipe: Recipe) {
    const dialogRef = this.dialog.open(EditRecipeComponent, {restoreFocus: false, data: recipe});
  }

  openRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(RecipeComponent, {restoreFocus: false, data: recipe});
  }

}
