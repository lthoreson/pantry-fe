import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ingredient } from 'src/app/data/Ingredient';
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
  // deep copy recipe
  public multipleRecipe: Recipe = JSON.parse(JSON.stringify(this.recipe))

  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, public pantry: PantryService) {
    this.checkPantry()
  }

  public sumItemCalories(): number {
    return this.multipleRecipe.ingredients.reduce((accumulated, current) => accumulated + (current.weight * current.item.calories),0)
  }

  public checkPantry(): void {
    for (let ingredient of this.multipleRecipe.ingredients) {
      if (ingredient.weight > ingredient.item.quantity) {
        this.disabledState = true
        this.submitButtonText = "Go Shopping"
      } else {
        this.disabledState = false
        this.submitButtonText = "Make Recipe"
      }
    }
  }

  // change weights by multiplying original by param
  public multiplyRecipe(multiple: string): void {
    for(let ingredient of this.multipleRecipe.ingredients) {
      const originalIngredient = this.recipe.ingredients.find((i) => i.item.id === ingredient.item.id)
      if (originalIngredient) {
        ingredient.weight = originalIngredient.weight * Number(multiple)
      }
    }
  }

  public ingredientColor(ingredient: Ingredient): string {
    return ingredient.weight > ingredient.item.quantity ? 'red' : 'black'
  }
}
