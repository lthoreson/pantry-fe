import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, take } from 'rxjs';
import { Account } from '../data/Account';
import { Credentials } from '../data/Credentials';
import { Ingredient } from '../data/Ingredient';
import { Recipe } from '../data/Recipe';
import { Views } from '../data/Views';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountInfo: Account = new Account(null, '', [])
  private url: string = 'http://localhost:8081/account'
  private view: Views = Views.welcome
  private $allAccounts: Subject<Account[]> = new Subject()

  constructor(private http: HttpClient, private snack: MatSnackBar) {
    const lastLogin = this.getLocalToken()
    if (lastLogin !== 'null') {
      this.setSession(lastLogin)
    }
  }

  public getAccountInfo(): Account {
    return this.accountInfo
  }

  public getLocalToken(): string {
    return String(localStorage.getItem('lastLogin'))
  }

  public setView(view: Views): void {
    this.snack.dismiss()
    this.view = view
  }

  public getView(): Views {
    return this.view
  }

  public setSession(token: string): void {
    // save token and use it to retrieve account info
    if (token !== '') {
      localStorage.setItem('lastLogin', token)
      this.getAccount(token)
      this.setView(Views.pantryList)
    // delete saved token from local storage and reset account info to blank
    } else {
      localStorage.removeItem('lastLogin')
      this.accountInfo = new Account(null, '', [])
    }
  }

  public login(username: string, password: string): void {
    this.http.get<string>(`${this.url}?username=${username}&password=${password}`).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(response)
      },
      error: (error) => { this.prompt(error.error.message) }
    })
  }

  public logout() {
    this.http.delete(`http://localhost:8081/auth?token=${localStorage.getItem('lastLogin')}`).pipe(take(1)).subscribe({
      next: (response) => {this.prompt('Session ended')},
      error: (error) => {this.prompt(error.error.message)}
    })
    this.setSession('')
    this.setView(Views.welcome)
  }

  public add(username: string, password: string): void {
    const newAccount = new Credentials(username, password)
    // server creates newAccount and returns token
    this.http.post<string>(this.url, newAccount).pipe(take(1)).subscribe({
      next: (response) => {
        this.setSession(response)
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public getAccount(token: string): void {
    // server returns account after validating token
    this.http.get<Account>(`${this.url}?token=${token}`).pipe(take(1)).subscribe({
      next: (response) => {
        this.accountInfo = new Account(response.id, response.username, response.recipes)
      },
      error: (error) => {
        this.setView(Views.welcome)
        this.prompt('Session expired. Please log in again.')
      }
    })
  }

  public searchAccounts(searchString: string): void {
    this.http.get<Account[]>(`${this.url}?search=${searchString}`).pipe(take(1)).subscribe({
      next: (response) => {
        const myIndex = response.findIndex((user) => user.id === this.accountInfo.id)
        if (myIndex !== -1) {
          response.splice(myIndex, 1)
        }
        this.$allAccounts.next(response)
      }
    })
  }

  public accountsObservable(): Observable<Account[]> {
    return this.$allAccounts.asObservable()
  }

  public modAccount(username: string, password: string): void {
    const updatedAccount = new Credentials(username, password)
    this.http.put<Account>(`${this.url}?token=${localStorage.getItem('lastLogin')}`, updatedAccount).pipe(take(1)).subscribe({
      next: () => {
        this.accountInfo.username = updatedAccount.username
        this.prompt("Account update successful")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public deleteAccount(): void {
    this.http.delete(`${this.url}/${this.accountInfo.id}?token=${localStorage.getItem('lastLogin')}`).pipe(take(1)).subscribe({
      next: () => {
        this.setSession('')
        this.setView(Views.welcome)
        this.prompt("Account deleted")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public addRecipe(name: string, image: string, ingredients: Ingredient[], steps: string[], pantryId: number | null): void {
    const newRecipe = new Recipe(null, name, this.accountInfo, image, ingredients, steps, false, pantryId)
    this.http.post<Recipe>('http://localhost:8080/recipe', newRecipe).pipe(take(1)).subscribe({
      next: (response) => {
        response = this.instantiateRecipe(response)
        this.accountInfo.recipes.push(response)
        this.prompt("Recipe added :)")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public shareRecipe(recipe: Recipe, toAccount: Account) {
    const newRecipe = new Recipe(null, `${this.accountInfo.username}'s ${recipe.name}`, toAccount, recipe.image, recipe.ingredients, recipe.steps, true, recipe.pantryId)
    this.http.post<Recipe>('http://localhost:8080/recipe', newRecipe).pipe(take(1)).subscribe({
      next: (response) => {
        this.prompt("Recipe shared :)")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public modRecipe(id: number | null, name: string, image: string, ingredients: Ingredient[], steps: string[], shared: boolean, pantryId: number | null): void {
    const recipeIndex = this.accountInfo.recipes.findIndex((r) => r.id === id)
    const currentRecipe = this.accountInfo.recipes[recipeIndex]
    // delays client update until response is received
    const updatedRecipe = new Recipe(id, name, this.accountInfo, image, ingredients, steps, shared, pantryId)
    this.http.put<Recipe>('http://localhost:8080/recipe', updatedRecipe).pipe(take(1)).subscribe({
      next: (response) => {
        this.accountInfo.recipes[recipeIndex] = this.instantiateRecipe(response)
        this.prompt("Recipe edit successful")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public deleteRecipe(id: number | null): void {
    this.http.delete(`http://localhost:8080/recipe/${id}?token=${localStorage.getItem('lastLogin')}`).pipe(take(1)).subscribe({
      next: () => {
        // delete recipe from memory if request successful
        const recipeIndex = this.accountInfo.recipes.findIndex((r) => r.id === id)
        this.accountInfo.recipes.splice(recipeIndex, 1)
        this.prompt("Recipe deleted")
      },
      error: (error) => this.prompt(error.error.message)
    })
  }

  public prompt(message: string): void {
    this.snack.open(message, "Close")
  }

  public instantiateRecipe(response: Recipe): Recipe {
    return new Recipe(response.id, response.name, response.account, response.image, response.ingredients, response.steps, response.shared, response.pantryId)
  }
}
