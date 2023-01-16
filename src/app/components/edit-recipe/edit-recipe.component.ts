import { Component, Inject } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ingredient } from 'src/app/data/Ingredient';
import { Recipe } from 'src/app/data/Recipe';
import { AccountService } from 'src/app/services/account.service';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css'],
  template: 'passed in {{ recipe }}'
})
export class EditRecipeComponent {
  ingredients: Ingredient[]

  // name form step input
  firstFormGroup = this.fb.group({
    firstCtrl: [this.recipe.name, Validators.required],
  });

  // image form step input
  secondFormGroup = this.fb.group({
    secondCtrl: [this.recipe.image, Validators.required],
  });

  // ingredients form step inputs
  thirdFormGroup = this.fb.group({});

  // steps form step inputs
  fourthFormGroup = this.fb.group({
    steps: this.fb.array([])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, public account: AccountService, public pantry: PantryService, private fb: FormBuilder) {
    // build ingredient objects for all items with initial weight of zero
    this.ingredients = this.pantry.getPantry().map((item) => new Ingredient(item, 0))
    // copy weights from recipe into this.ingredients
    for (let ingredient of this.recipe.ingredients) {
      const target = this.ingredients.find((i) => i.item.id === ingredient.item.id)
      if (target) {
        target.weight = ingredient.weight
      }
    }
    // copy steps from recipe into form controls
    for (let step of this.recipe.steps) {
      this.addStep(step)
    }

    // add a a form control for each ingredient by name to store the input values
    for (let i of this.ingredients) {
      this.addCon(i.item.name, i.weight)
    }
  }

  // add ingredient form control
  public addCon(name: string, weight: number): void {
    this.thirdFormGroup.addControl(name, new FormControl(weight))
  }

  // getter function for FormArray of form control aliases
  public get steps(): FormArray {
    return this.fourthFormGroup.get('steps') as FormArray
  }

  // adds a step when user clicks
  public addStep(step: string): void {
    this.steps.push(this.fb.control(step));
  }

  // remove blanks from ingredients
  public filterIngredients(): Ingredient[] {
    this.ingredients.forEach((value) => value.weight = Number(this.thirdFormGroup.value[value.item.name as keyof Object]))
    return this.ingredients.filter((i) => i.weight > 0)
  }

  // remove blanks from steps
  public filterSteps(): string[] {
    return this.steps.value.filter((step: string) => step !== '')
  }

}
