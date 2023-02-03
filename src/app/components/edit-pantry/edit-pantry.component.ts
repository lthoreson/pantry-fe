import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/data/Account';
import { Pantry } from 'src/app/data/Pantry';
import { AccountService } from 'src/app/services/account.service';
import { PantryService } from 'src/app/services/pantry.service';

@Component({
  selector: 'app-edit-pantry',
  templateUrl: './edit-pantry.component.html',
  styleUrls: ['./edit-pantry.component.css'],
  template: 'passed in {{ clickedPantry }}'
})
export class EditPantryComponent implements OnDestroy {
  public modifiedPantry: Pantry = JSON.parse(JSON.stringify(this.clickedPantry))
  displayedColumns: string[] = ['username'];
  public allAccounts: Account[] = []
  private allAccountsSubscription: Subscription
  public myControl = new FormControl('');
  private myControlSubscription: Subscription

  constructor(@Inject(MAT_DIALOG_DATA) public clickedPantry: Pantry, public account: AccountService, public pantry: PantryService) {
    this.allAccountsSubscription = account.accountsObservable().subscribe({
      next: (response) => {
        const members = this.modifiedPantry.members.map((m) => m.id)
        this.allAccounts = response.filter((a) => !members.includes(a.id))
      }
    })
    this.myControlSubscription = this.myControl.valueChanges.subscribe({
      next: (searchString) => {account.searchAccounts(searchString || '')}
    })
    console.log(this.modifiedPantry)
  }

  ngOnDestroy(): void {
    this.allAccountsSubscription.unsubscribe()
    this.myControlSubscription.unsubscribe()
  }

  public addMember(member: Account) {
    if (member.id) {
      this.modifiedPantry.members.push(member)
      this.allAccounts = []
      this.myControl.setValue('')
    }
  }

  public getMembers(): Account[] {
    return this.modifiedPantry.members
  }

  public removeMember(member: Account): void {
    const memberIndex = this.modifiedPantry.members.findIndex((m) => m.id === member.id)
    if (memberIndex !== -1) {
      this.modifiedPantry.members.splice(memberIndex, 1)
    }
  }

  public bequeath(member: Account): void {
    const memberIndex = this.modifiedPantry.members.findIndex((m) => m.id === member.id)
    if (memberIndex !== -1) {
      this.modifiedPantry.members.splice(memberIndex, 1)
      this.modifiedPantry.owner = member
      this.modifiedPantry.members.push(this.account.getAccountInfo())
    }
  }

}
