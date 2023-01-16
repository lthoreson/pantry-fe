import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/data/Ingredient';
import { AccountService } from 'src/app/services/account.service';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent {
  ingredients: Ingredient[]

  nameFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });

  imageFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });

  ingredientsFormGroup = this.fb.group({});

  stepsFormGroup = this.fb.group({
    steps: this.fb.array([new FormControl('')])
  });
  
  constructor(public account: AccountService, public pantry: PantryService, private fb: FormBuilder) {
    // Build ingredient list from pantry items. Set initial weight to zero.
    this.ingredients = this.pantry.getPantry().map((i) => new Ingredient(i, 0))
    // add a a form control for each ingredient by name to store the input values
    for (let i of this.ingredients) {
      this.addIngredientControl(i.item.name)
    }
  }
  // add ingredient form control
  public addIngredientControl(name: string): void {
    this.ingredientsFormGroup.addControl(name, new FormControl(''))
  }
  // getter function for FormArray of form control aliases
  public get steps(): FormArray {
    return this.stepsFormGroup.get('steps') as FormArray
  }
  // adds a step when user clicks
  public addStep(): void {
    this.steps.push(this.fb.control(''));
  }
  // remove blanks from ingredients
  public filterIngredients(): Ingredient[] {
    this.ingredients.forEach((value) => value.weight = Number(this.ingredientsFormGroup.value[value.item.name as keyof Object]))
    return this.ingredients.filter((i) => i.weight > 0)
  }
  // remove blanks from steps
  public filterSteps(): string[] {
    return this.steps.value.filter((step: string) => step !== '')
  }
}
