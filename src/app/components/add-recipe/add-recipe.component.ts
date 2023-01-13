import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
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
    fourthCtrl: ['', Validators.required],
  });
  constructor(public account: AccountService, public pantry: PantryService, private fb: FormBuilder) {
    this.ingredients = this.pantry.getPantry().map((i) => new Ingredient(i, 0))
    for (let i of this.ingredients) {
      this.addCon(i.item.name)
    }
    console.log(this.thirdFormGroup.value)
  }

  public addCon(name: string) {
    this.thirdFormGroup.addControl(name, new FormControl(''))
  }

  public filterIngredients(): Ingredient[] {
    this.ingredients.forEach((value) => value.weight = Number(this.thirdFormGroup.value[value.item.name as keyof Object]))
    console.log(this.ingredients)
    return this.ingredients.filter((i) => i.weight > 0)
  }

}
