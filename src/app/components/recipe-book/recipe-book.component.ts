import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/services/account.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent {
  constructor(private dialog: MatDialog, public account: AccountService) {}

  openAdd() {
    const dialogRef = this.dialog.open(AddRecipeComponent, {restoreFocus: false});
  }

}
