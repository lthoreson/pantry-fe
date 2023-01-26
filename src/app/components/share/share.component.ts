import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Account } from 'src/app/data/Account';
import { Recipe } from 'src/app/data/Recipe';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
  template: 'passed in {{ recipe }}'
})
export class ShareComponent {
  public allAccounts: Account[] = []

  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, private http: HttpClient, public account: AccountService) {
    this.getAllAccounts()
  }

  private getAllAccounts(): void {
    this.http.get<Account[]>('http://localhost:8081/account').pipe(take(1)).subscribe({
      next: (response) => {
        this.allAccounts = response
        const myIndex = this.allAccounts.findIndex((user) => user.id === this.account.getAccountInfo().id)
        this.allAccounts.splice(myIndex, 1)
      }
    })
  }

  public disableButton(buttonId: string) {
    const target = document.getElementById(buttonId) as HTMLButtonElement
    target.disabled = true
  }

}
