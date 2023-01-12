import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;

  constructor(public dialog: MatDialog) {}

  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {restoreFocus: false});
    dialogRef.afterClosed().subscribe(() => this.menuTrigger?.focus());
  }

  openRegister() {
    const dialogRef = this.dialog.open(RegisterComponent, {restoreFocus: false});
    dialogRef.afterClosed().subscribe(() => this.menuTrigger?.focus());
  }

}
