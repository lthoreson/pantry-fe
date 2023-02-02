import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, startWith, map, Subject } from 'rxjs';
import { Ingredient } from 'src/app/data/Ingredient';
import { Item } from 'src/app/data/Item';
import { AccountService } from 'src/app/services/account.service';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent {
  items: Item[]
  ingredients: Ingredient[] = []
  searchSuggestions: Item[]
  blank: Item = new Item(null,'',0,'',0,0,0)

  nameFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });

  imageFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });

  stepsFormGroup = this.fb.group({
    steps: this.fb.array([new FormControl('')])
  });
  
  constructor(public account: AccountService, public pantry: PantryService, private fb: FormBuilder) {
    // Build ingredient list from pantry items.
    this.items = this.pantry.getPantry().items
    
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
  public addIngredient() {
    const newSelection = new Ingredient(new Item(null,'',0,'',0,0,0),0)
    this.ingredients.unshift(newSelection)
  }

  // getter function for FormArray of form control aliases
  public get steps(): FormArray {
    return this.stepsFormGroup.get('steps') as FormArray
  }

  // adds a step when user clicks
  public addStep(): void {
    this.steps.push(this.fb.control(''));
  }

  // remove blanks from items for submission
  public filterIngredients(): Ingredient[] {
    return this.ingredients.filter((i) => i.weight > 0 && i.item.id !== null)
  }

  // remove blanks from steps for submission
  public filterSteps(): string[] {
    return this.steps.value.filter((step: string) => step !== '')
  }
}
