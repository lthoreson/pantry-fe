import { Component } from '@angular/core';
import { Item } from 'src/app/data/Item';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  public newItem: Item = new Item(null, '',0,'',0,0,0)
  constructor(public pantry: PantryService) {}

}
