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

  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });

  thirdFormGroup = this.fb.group({});

  fourthFormGroup = this.fb.group({
    steps: this.fb.array([new FormControl('')])
  });

  constructor(public account: AccountService, public pantry: PantryService, private fb: FormBuilder) {
    this.ingredients = this.pantry.getPantry().map((i) => new Ingredient(i, 0))
    for (let i of this.ingredients) {
      this.addCon(i.item.name)
    }
  }

  public addCon(name: string): void {
    this.thirdFormGroup.addControl(name, new FormControl(''))
  }

  public get steps(): FormArray {
    return this.fourthFormGroup.get('steps') as FormArray
  }

  public addStep(): void {
    this.steps.push(this.fb.control(''));
  }

  public filterIngredients(): Ingredient[] {
    this.ingredients.forEach((value) => value.weight = Number(this.thirdFormGroup.value[value.item.name as keyof Object]))
    return this.ingredients.filter((i) => i.weight > 0)
  }

  public filterSteps(): string[] {
    return this.steps.value.filter((step: string) => step !== '')
  }
}
