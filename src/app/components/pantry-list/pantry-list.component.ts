import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pantry } from 'src/app/data/Pantry';
import { Views } from 'src/app/data/Views';
import { AccountService } from 'src/app/services/account.service';
import { PantryService } from 'src/app/services/pantry.service';
import { AddPantryComponent } from '../add-pantry/add-pantry.component';
import { EditPantryComponent } from '../edit-pantry/edit-pantry.component';

@Component({
  selector: 'app-pantry-list',
  templateUrl: './pantry-list.component.html',
  styleUrls: ['./pantry-list.component.css']
})
export class PantryListComponent implements OnInit{
  constructor(public dialog: MatDialog, public account: AccountService, public pantry: PantryService) { }

  ngOnInit(): void {
    this.pantry.loadPantryList()
  }

  openAdd() {
    const dialogRef = this.dialog.open(AddPantryComponent, { restoreFocus: false });
  }

  // openEdit(item: Item) {
  //   const dialogRef = this.dialog.open(EditItemComponent, { restoreFocus: false, data: item });
  // }

  openPantry(id: number | null) {
    this.pantry.loadPantry(Number(id))
    this.account.setView(Views.all)
  }

  openEdit(clickedPantry: Pantry) {
    const dialogRef = this.dialog.open(EditPantryComponent, { restoreFocus: false, data: clickedPantry });
  }


}
