import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription, take } from 'rxjs';
import { Account } from 'src/app/data/Account';
import { Recipe } from 'src/app/data/Recipe';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
  template: 'passed in {{ recipe }}'
})
export class ShareComponent implements OnDestroy {
  public allAccounts: Account[] = []
  private allAccountsSubscription: Subscription
  myControl = new FormControl('');
  private myControlSubscription: Subscription

  constructor(@Inject(MAT_DIALOG_DATA) public recipe: Recipe, private http: HttpClient, public account: AccountService) {
    this.allAccountsSubscription = account.accountsObservable().subscribe({
      next: (response) => {this.allAccounts = response}
    })
    this.myControlSubscription = this.myControl.valueChanges.subscribe({
      next: (searchString) => {account.searchAccounts(searchString || '')}
    })
  }

  ngOnDestroy(): void {
    this.allAccountsSubscription.unsubscribe()
    this.myControlSubscription.unsubscribe()
  }

  public disableButton(buttonId: string) {
    const target = document.getElementById(buttonId) as HTMLButtonElement
    target.disabled = true
  }

}
