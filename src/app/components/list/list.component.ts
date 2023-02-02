import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Item } from 'src/app/data/Item';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  public list: Item[]
  public checkboxes = this.fb.group({})
  constructor(public pantry: PantryService, private fb: FormBuilder) {
    this.list = this.filterItems()
    this.addFormControls()
  }

  public addFormControls(): void {
    // create form controls for each item in the filtered list
    for (let item of this.list) {
      this.checkboxes.addControl(item.name, new FormControl(false))
    }
  }

  public filterItems(): Item[] {
    // filter requested items from pantry
    return this.pantry.getPantry().items.filter((i) => i.demand > 0)
  }

  public groceryRun(): void {
    for (let item of this.list) {
      if (this.checkboxes.getRawValue()[item.name as keyof Object]) {
        item.quantity += item.demand
        item.demand = 0
        this.pantry.modItem(item)
        this.checkboxes.removeControl(item.name)
      }
    }
    this.list = this.filterItems()
  }

}
