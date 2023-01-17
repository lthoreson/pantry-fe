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
  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, public pantry: PantryService) { }

  public sumItemCalories() {
    return this.recipe.ingredients.reduce((accumulated, current) => accumulated + (current.weight * current.item.calories),0)
  }
}
