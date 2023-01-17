import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { Account } from '../data/Account';
import { Ingredient } from '../data/Ingredient';
import { Recipe } from '../data/Recipe';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private session: Account = new Account(null, '', '', [])
  private url: string = 'http://localhost:8080/account'

  constructor(private http: HttpClient, private snack: MatSnackBar) {
    const lastLogin = localStorage.getItem('lastLogin')
    if (lastLogin) {
      const account = JSON.parse(lastLogin)
      this.login(account.username, account.password)
    }
  }

  public setSession(user: Account): void {
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

  public login(username: string, password: string): void {
    this.http.get<Account>(`${this.url}?username=${username}&password=${password}`).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(new Account(response.id, response.username, response.password, response.recipes))
      },
      error: (error) => { this.prompt(error.error.message); console.log(error) }
    })
  }

  public logout() {
    this.setSession(new Account(null, '', '', []))
  }

  public add(username: string, password: string): void {
    const newAccount = new Account(null, username, password, [])
    this.http.post<Account>(this.url, newAccount).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(response)
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public addRecipe(name: string, image: string, ingredients: Ingredient[], steps: string[]): void {
    const newRecipe = new Recipe(null, name, this.session, image, ingredients, steps)
    this.http.post<Recipe>('http://localhost:8080/recipe', newRecipe).pipe(take(1)).subscribe({
      next: (response) => {
        this.session.recipes.push(response)
        this.prompt("recipe added :)")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public modRecipe(id: number | null, name: string, image: string, ingredients: Ingredient[], steps: string[]): void {
    const updatedRecipe = new Recipe(id, name, this.session, image, ingredients, steps)
    this.http.put<Recipe>('http://localhost:8080/recipe', updatedRecipe).pipe(take(1)).subscribe({
      next: (response) => {
        const recipeIndex = this.session.recipes.findIndex((r) => r.id === response.id)
        this.session.recipes[recipeIndex] = response
        this.prompt("recipe edit successful")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public modAccount(username: string, password: string): void {
    const updatedAccount = new Account(this.session.id, username, password, this.session.recipes)
    this.http.put<Account>(`${this.url}?username=${this.session.username}&password=${this.session.password}`, updatedAccount).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(response)
        this.prompt("account update successful")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public deleteAccount(): void {
    this.http.delete(`${this.url}/${this.session.id}?username=${this.session.username}&password=${this.session.password}`).pipe(take(1)).subscribe({
      next: () => {
        this.setSession(new Account(null, '', '', []))
        this.prompt("account deleted")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public deleteRecipe(id: number | null): void {
    this.http.delete(`http://localhost:8080/recipe/${id}?username=${this.session.username}&password=${this.session.password}`).pipe(take(1)).subscribe({
      next: () => {
        this.login(this.session.username, this.session.password)
        this.prompt("recipe deleted")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public prompt(message: string): void {
    this.snack.open(message, "Close")
  }
}
