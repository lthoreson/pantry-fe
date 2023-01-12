import { Component } from '@angular/core';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  constructor(public pantry: PantryService) {}

}
