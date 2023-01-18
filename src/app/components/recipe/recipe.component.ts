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
  public enoughIngredients = true
  public submitButtonText = "Make Recipe"
  // This deep copy will be multiplied from the original
  public multipleRecipe: Recipe = JSON.parse(JSON.stringify(this.recipe))

  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, public pantry: PantryService) {
    this.checkPantry()
  }

  public sumItemCalories(): number {
    return this.multipleRecipe.ingredients.reduce((accumulated, current) => accumulated + (current.weight * current.item.calories),0)
  }

  public checkPantry(): void {
    let enoughForAll = true
    for (let ingredient of this.multipleRecipe.ingredients) {
      if (!this.enoughOfItem(ingredient)) {
        enoughForAll = false
        this.submitButtonText = "Request Item"
      } 
    }
    this.enoughIngredients = enoughForAll
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

  public enoughOfItem(ingredient: Ingredient): boolean {
    return ingredient.weight < ingredient.item.quantity
  }

  public requestItems(): void {
    for (let ingredient of this.multipleRecipe.ingredients) {
      if (!this.enoughOfItem(ingredient)) {
        const target = this.pantry.getPantry().find((i) => i.id === ingredient.item.id)
        if (target) {
          target.demand += ingredient.weight - target.quantity
          this.pantry.modItem(target)
        }
      } 
    }
  }

}
