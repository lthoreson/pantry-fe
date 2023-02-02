import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/data/Item';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
  template: 'passed in {{ item }}'
})
export class EditItemComponent {
  public modifiedItem: Item = JSON.parse(JSON.stringify(this.item))
  constructor(@Inject(MAT_DIALOG_DATA) public item: Item, public pantry: PantryService) {}

}
