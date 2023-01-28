import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
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
  selections: Ingredient[] = []

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Item[]>;

  nameFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });

  imageFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });

  itemsFormGroup = this.fb.group({});

  stepsFormGroup = this.fb.group({
    steps: this.fb.array([new FormControl('')])
  });
  
  constructor(public account: AccountService, public pantry: PantryService, private fb: FormBuilder) {
    // Build ingredient list from pantry items. Set initial weight to zero.
    this.items = this.pantry.getPantry()
    // add a a form control for each ingredient by name to store the input values
    for (let i of this.items) {
      this.itemsFormGroup.addControl(i.name, new FormControl(''))
    }
    // filter ingredient options for autocomplete dropdown
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  // getter function for FormArray of form control aliases
  public get steps(): FormArray {
    return this.stepsFormGroup.get('steps') as FormArray
  }
  // adds a step when user clicks
  public addStep(): void {
    this.steps.push(this.fb.control(''));
  }
  // remove blanks from items
  public filterSelections(): Ingredient[] {
    return this.selections.filter((i) => i.weight > 0 && i.item.id !== null)
  }
  // remove blanks from steps
  public filterSteps(): string[] {
    return this.steps.value.filter((step: string) => step !== '')
  }

  private _filter(searchString: string): Item[] {
    const searchLowerCase = searchString.toLowerCase();
    // only suggest new items that start with the search string
    return this.items.filter(option => {
      const selectedItems = []
      for (let i of this.selections) {
        selectedItems.push(i.item)
      }
      const duplicate = selectedItems.includes(option)
      const search = option.name.toLowerCase().startsWith(searchLowerCase)
      return search && !duplicate ? true : false
    });
  }

  public addSelection() {
    const newSelection = new Ingredient(new Item(null,'',0,'',0,0,0),0)
    this.selections.push(newSelection)
  }
}
