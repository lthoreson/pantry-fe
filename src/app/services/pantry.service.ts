import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { Item } from '../data/Item';
import { Recipe } from '../data/Recipe';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PantryService {
  private pantry: Item[] = []
  private url: string = 'http://localhost:8080/item'

  constructor(private http: HttpClient, private account: AccountService) {
    this.loadPantry()
  }

  public getPantry() {
    return this.pantry
  }

  public loadPantry() {
    this.http.get<Item[]>(this.url).pipe(take(1)).subscribe({
      next: (response) => {this.pantry = response},
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public add(name: string, quantity: string, image: string, weight: string, calories: string) {
    const newItem = new Item(null, name, Number(quantity), image, Number(weight), Number(calories))
    this.http.post<Item>(this.url, newItem).pipe(take(1)).subscribe({
      next: (response) => {
        this.account.prompt('Item sucessfully added :)')
        this.loadPantry()
      },
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public takeItems(recipe: Recipe) {
    this.http.put<Item[]>(this.url+'/take', recipe).pipe(take(1)).subscribe({
      next: (response) => {
        this.pantry = response
        this.account.prompt(`Ingredients for ${recipe.name} were removed from the pantry`)
      },
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public incrementItem(item: Item, positive: boolean) {
    if (item.quantity <= 0 && positive === false) {
      return
    }
    positive? item.quantity++ : item.quantity--
    this.http.put<Item>(this.url, item).pipe(take(1)).subscribe({
      next: (response) => {},
      error: (error) => {
        positive? item.quantity-- : item.quantity++
        this.account.prompt(error.error.message)
      }
    })
  }

  public modItem(item: Item) {
    this.http.put(this.url, item).pipe(take(1)).subscribe({
      next: (response) => {this.account.prompt("edit successful")},
      error: (error) => {
        this.account.prompt(error.error.message)
        this.loadPantry()
      }
    })
  }

}
