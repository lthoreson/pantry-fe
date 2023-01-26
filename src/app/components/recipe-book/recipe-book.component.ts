import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Ingredient } from 'src/app/data/Ingredient';
import { Recipe } from 'src/app/data/Recipe';
import { AccountService } from 'src/app/services/account.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';
import { LoginComponent } from '../login/login.component';
import { RecipeComponent } from '../recipe/recipe.component';
import { RegisterComponent } from '../register/register.component';
import { ShareComponent } from '../share/share.component';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;
  public filtered = false
  
  constructor(private dialog: MatDialog, public account: AccountService) {
  }

  openAdd() {
    const dialogRef = this.dialog.open(AddRecipeComponent, {restoreFocus: false});
  }

  openEdit(recipe: Recipe) {
    const dialogRef = this.dialog.open(EditRecipeComponent, {restoreFocus: false, data: recipe});
  }

  openRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(RecipeComponent, {restoreFocus: false, data: recipe});
  }

  openShare(recipe: Recipe) {
    const dialogRef = this.dialog.open(ShareComponent, {restoreFocus: false, data: recipe});
  }

  public filter(recipes: Recipe[], shared: boolean) {
    // filter by shared status
    const shareFilter = recipes.filter((recipe) => recipe.shared === shared)
    // return all shared recipes
    if (shared) {
      return shareFilter
    }
    // return available non-shared recipes
    if (this.filtered) {
      return shareFilter.filter((recipe) => {
        for (let i of recipe.ingredients) {
          if (i.weight > i.item.quantity) {
            return false
          }
        }
        return true
      })
    }
    // return all non-shared recipes
    return shareFilter
  }

}
