import { Component } from '@angular/core';
import { Views } from './data/Views';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'logan-thoreson-capstone-fe';
  views = Views

  constructor(public account: AccountService) {}
}
