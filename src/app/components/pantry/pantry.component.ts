import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AccountService } from 'src/app/services/account.service';
import { PantryService } from 'src/app/services/pantry.service';
import { AddItemComponent } from '../add-item/add-item.component';

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

}
