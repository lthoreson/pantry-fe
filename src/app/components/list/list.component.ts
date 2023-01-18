import { Component } from '@angular/core';
import { Item } from 'src/app/data/Item';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  public list: Item[]
  constructor(pantry: PantryService) {
    this.list = pantry.getPantry().filter((i) => i.demand > 0)
  }

}
