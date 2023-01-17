import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Recipe } from 'src/app/data/Recipe';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
  template: 'passed in {{ recipe }}'
})
export class RecipeComponent {
  public disabledState = false
  public submitButtonText = "Make Recipe"

  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, public pantry: PantryService) {
    this.checkPantry()
  }

  public sumItemCalories() {
    return this.recipe.ingredients.reduce((accumulated, current) => accumulated + (current.weight * current.item.calories),0)
  }

  public checkPantry() {
    for (let ingredient of this.recipe.ingredients) {
      if (ingredient.weight > ingredient.item.quantity) {
        this.disabledState = true
        this.submitButtonText = "Missing Items in Pantry"
      }
    }
  }
}
