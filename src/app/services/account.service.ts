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
  private view: string = 'welcome'

  constructor(private http: HttpClient, private snack: MatSnackBar) {
    const lastLogin = this.getAuthToken()
    if (lastLogin) {
      this.setSession(lastLogin)
      this.setView('all')
    }
  }

  public getAuthToken(): string {
    return String(localStorage.getItem('lastLogin'))
  }

  public setAuthToken(token: string): void {
    if (token === '') {
      localStorage.removeItem('lastLogin')
    } else {
      localStorage.setItem('lastLogin', token)
    }
  }

  public setView(view: string): void {
    this.view = view
  }

  public getView(): string {
    return this.view
  }

  public setSession(token: string): void {
    this.setAuthToken(token)
    if (token !== '') {
      this.getAccount(token)
    } else {
      this.session = new Account(null, '', '', [])
    }
  }

  public getSession(): Account {
    return this.session
  }

  public login(username: string, password: string): void {
    this.http.get<string>(`${this.url}?username=${username}&password=${password}`).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(response)
        this.setView('all')
      },
      error: (error) => { this.prompt(error.error.message); console.log(error) }
    })
  }

  public logout() {
    // TODO delete token from both sides
    this.setSession('')
    this.setView('welcome')
  }

  public add(username: string, password: string): void {
    const newAccount = new Account(null, username, password, [])
    this.http.post<string>(this.url, newAccount).pipe(take(1)).subscribe({
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
        response = this.instantiateRecipe(response)
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
        this.session.recipes[recipeIndex] = this.instantiateRecipe(response)
        this.prompt("recipe edit successful")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public getAccount(token: string) {
    this.http.get<Account>(`${this.url}?token=${token}`).pipe(take(1)).subscribe({
      next: (response) => {this.session = new Account(response.id, response.username, '', response.recipes)},
      error: (error) => {this.prompt('Could not retrieve account info from the database')}
    })
  }

  public modAccount(username: string, password: string): void {
    const updatedAccount = new Account(this.session.id, username, password, this.session.recipes)
    this.http.put<Account>(`${this.url}?token=${localStorage.getItem('lastLogin')}`, updatedAccount).pipe(take(1)).subscribe({
      next: () => {
        this.session = updatedAccount
        this.prompt("account update successful")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public deleteAccount(): void {
    this.http.delete(`${this.url}/${this.session.id}?token=${localStorage.getItem('lastLogin')}`).pipe(take(1)).subscribe({
      next: () => {
        this.setSession('')
        this.prompt("account deleted")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public deleteRecipe(id: number | null): void {
    this.http.delete(`http://localhost:8080/recipe/${id}?token=${localStorage.getItem('lastLogin')}`).pipe(take(1)).subscribe({
      next: () => {
        // delete recipe from memory if request successful
        const recipeIndex = this.session.recipes.findIndex((r) => r.id === id)
        this.session.recipes.splice(recipeIndex, 1)
        this.prompt("recipe deleted")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public prompt(message: string): void {
    this.snack.open(message, "Close")
  }

  public instantiateRecipe(response: Recipe): Recipe {
    return new Recipe(response.id, response.name, response.account, response.image, response.ingredients, response.steps)
  }
}
