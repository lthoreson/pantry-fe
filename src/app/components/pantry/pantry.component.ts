import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Item } from 'src/app/data/Item';
import { AccountService } from 'src/app/services/account.service';
import { PantryService } from 'src/app/services/pantry.service';
import { AddItemComponent } from '../add-item/add-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.css']
})
export class PantryComponent {
  constructor(public dialog: MatDialog, public account: AccountService, public pantry: PantryService) {}

  openAdd() {
    const dialogRef = this.dialog.open(AddItemComponent, {restoreFocus: false});
  }

  openEdit(item: Item) {
    const dialogRef = this.dialog.open(EditItemComponent, {restoreFocus: false, data: item});
  }

  public outOfStockStyle(quantity: number): string {
    return quantity === 0 ? '.6' : '1'
  }

}
