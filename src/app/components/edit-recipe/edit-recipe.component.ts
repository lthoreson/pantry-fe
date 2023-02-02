import { Component, Inject } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, map, Subject } from 'rxjs';
import { Ingredient } from 'src/app/data/Ingredient';
import { Item } from 'src/app/data/Item';
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
  items: Item[]
  ingredients: Ingredient[]
  searchSuggestions: Item[]
  blank: Item = new Item(null,'',0,'',0,0,0)

  // stores validated recipe name input
  nameFormGroup = this.fb.group({
    firstCtrl: [this.recipe.name, Validators.required],
  });

  // stores validated recipe image input
  imageFormGroup = this.fb.group({
    secondCtrl: [this.recipe.image, Validators.required],
  });

  // stores recipe step inputs
  stepsFormGroup = this.fb.group({
    steps: this.fb.array([])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, public account: AccountService, public pantry: PantryService, private fb: FormBuilder) {
    // Build ingredient list from pantry items.
    this.items = this.pantry.getPantry().items

    // copy steps from recipe into form controls
    for (let step of this.recipe.steps) {
      this.addStep(step)
    }

    // add inputs for all initial recipe ingredients (deep copy to avoid editing directly)
    this.ingredients = JSON.parse(JSON.stringify(recipe.ingredients))

    this.searchSuggestions = this.filterOptions('')
  }

  public filterOptions(searchString: string): Item[] {
    const searchLowerCase = searchString.toLowerCase()
    const selectedItems = this.ingredients.map((i) => i.item.id)

    // only suggest new items that start with the search string
    return this.items.filter(option => {
      const duplicate = selectedItems.includes(option.id)
      const search = option.name.toLowerCase().startsWith(searchLowerCase)
      return search && !duplicate
    });
  }

  public submitSearch(event: Event, ingredient: Ingredient): void {
    let searchString = (event.target as HTMLInputElement).value
    if (ingredient.item.id !== null) {
      ingredient.item = this.blank
      searchString = ''
    }
    this.searchSuggestions = this.filterOptions(searchString)
  }

  // adds an ingredient input
  public addIngredient(): void {
    const newSelection = new Ingredient(this.blank,0)
    this.ingredients.unshift(newSelection)
  }

  // getter function for FormArray of form control aliases
  public get steps(): FormArray {
    return this.stepsFormGroup.get('steps') as FormArray
  }

  // adds a step when user clicks
  public addStep(step: string): void {
    this.steps.push(this.fb.control(step));
  }

  // remove blanks from items for submission
  public filterIngredients(): Ingredient[] {
    return this.ingredients.filter((i) => i.weight > 0 && i.item.id !== null)
  }

  // remove blanks from steps
  public filterSteps(): string[] {
    return this.steps.value.filter((step: string) => step !== '')
  }

}
