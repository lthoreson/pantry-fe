import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { Account } from '../data/Account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private session: Account = new Account(null, '', '')
  private url: string = 'http://localhost:8080/account'

  constructor(private http: HttpClient, private snack: MatSnackBar) {
    const lastLogin = localStorage.getItem('lastLogin')
    if (lastLogin) {
      const account = JSON.parse(lastLogin)
      this.login(account.username, account.password)
    }
  }

  public setSession(user: Account) {
    this.session = user
    if (user.id) {
      localStorage.setItem('lastLogin', JSON.stringify(user))
    } else {
      localStorage.removeItem('lastLogin')
    }
  }

  public getSession(): Account {
    return this.session
  }

  public login(username: string, password: string) {
    this.http.get<Account>(`${this.url}?username=${username}&password=${password}`).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(response)
      },
      error: (error) => {this.prompt(error.error.message); console.log(error)}
    })
  }

  public logout() {
    this.setSession(new Account(null, '', ''))
  }

  public add(username: string, password: string) {
    const newAccount = new Account(null, username, password)
    this.http.post<Account>(this.url, newAccount).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(response)
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public prompt(message: string) {
    this.snack.open(message, "Close")
  }
}
