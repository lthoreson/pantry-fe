import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { Item } from '../data/Item';
import { Pantry } from '../data/Pantry';
import { Recipe } from '../data/Recipe';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PantryService {
  private pantry: Pantry = new Pantry(null, '', this.account.getAccountInfo())
  private pantryList: Pantry[] = []
  private url: string = 'http://localhost:8080/item'
  private url2: string = 'http://localhost:8080/pantry'

  constructor(private http: HttpClient, private account: AccountService) {
    if (account.getLocalToken() === 'null') {
      this.pantryList = []
    } else {
      this.loadPantryList()
    }
  }

  public getPantry() {
    return this.pantry
  }

  public getPantryList() {
    return this.pantryList
  }

  public loadPantry(id: number) {
    this.http.get<Pantry>(`${this.url2}/${id}?token=${this.account.getLocalToken()}`).pipe(take(1)).subscribe({
      next: (response) => {this.pantry = response},
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public loadPantryList() {
    this.pantry = new Pantry(null, '', this.account.getAccountInfo())
    this.http.get<Pantry[]>(`${this.url2}?token=${this.account.getLocalToken()}`).pipe(take(1)).subscribe({
      next: (response) => {this.pantryList = response},
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public addPantry(newPantry: Pantry): void {
    this.http.post<Pantry>(`${this.url2}?token=${this.account.getLocalToken()}`, newPantry).pipe(take(1)).subscribe({
      next: (response) => {
        const pantryIndex = this.pantryList.findIndex((p) => p.id === response.id)
        this.pantryList.push(response)
        console.log(response, this.pantryList)
        this.account.prompt('Success!')
      },
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public importItems(): void {
    const allRecipeItems: Item[] = []
    for (let r of this.account.getAccountInfo().recipes) {
      for (let i of r.ingredients) {
       allRecipeItems.push(i.item)
      }
    }
    const itemNames = this.pantry.items.map((i) => i.name.toLowerCase())
    const newItems = allRecipeItems.filter((i) => !itemNames.includes(i.name.toLowerCase()))
    if (newItems.length === 0) {
      return this.account.prompt('Nothing to import')
    }
    const deepCopy = JSON.parse(JSON.stringify(newItems))
    deepCopy.forEach((item: Item) => {item.id = null; item.quantity = 0});
    this.pantry.items = this.pantry.items.concat(deepCopy)
    this.modPantry(this.pantry)
  }

  public modPantry(modifiedPantry: Pantry) {
    console.log(modifiedPantry)
    this.http.put<Pantry>(`${this.url2}?token=${this.account.getLocalToken()}`, modifiedPantry).pipe(take(1)).subscribe({
      next: (response) => {
        const pantryIndex = this.pantryList.findIndex((p) => p.id === response.id)
        this.pantryList[pantryIndex] = response
        this.account.prompt('Success!')
      },
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public add(newItem: Item) {
    this.pantry.items.push(newItem)
    this.http.put<Pantry>(`${this.url2}?token=${this.account.getLocalToken()}`, this.pantry).pipe(take(1)).subscribe({
      next: (response) => {
        this.account.prompt('Item sucessfully added :)')
        this.loadPantry(Number(this.pantry.id))
      },
      error: (error) => {
        this.account.prompt(error.error.message)
        this.pantry.items.pop()
      }
    })
  }

  public takeItems(recipe: Recipe) {
    this.http.put<Item[]>(this.url+'/take', recipe).pipe(take(1)).subscribe({
      next: (response) => {
        this.pantry.items = response
        this.account.getAccount(this.account.getLocalToken())
        this.account.prompt(`Ingredients for ${recipe.name} were removed from the pantry`)
      },
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public incrementItem(item: Item, positive: boolean) {
    if (item.quantity <= 0 && positive === false) {
      return
    }
    positive ? item.quantity++ : item.quantity--
    if (positive && item.demand >= 1) {
      item.demand--
    }
    this.http.put<Item>(this.url, item).pipe(take(1)).subscribe({
      next: (response) => {
        this.account.getAccount(this.account.getLocalToken())
      },
      error: (error) => {
        positive? item.quantity-- : item.quantity++
        this.account.prompt(error.error.message)
      }
    })
  }

  public modItem(item: Item): void {
    this.http.put(this.url, item).pipe(take(1)).subscribe({
      next: (response) => {
        this.account.getAccount(this.account.getLocalToken())
        this.account.prompt('Success!')
      },
      error: (error) => {
        this.account.prompt(error.error.message)
        this.loadPantry(Number(this.pantry.id))
      }
    })
  }

  public deleteItem(id: number | null): void {
    const deleteIndex = this.pantry.items.findIndex((i) => i.id === id)
    if (deleteIndex === -1) {
      return console.log('No item found') 
    }
    const deleted = this.pantry.items.splice(deleteIndex, 1)[0]
    this.http.put<Pantry>(`${this.url2}?token=${this.account.getLocalToken()}`, this.pantry).pipe(take(1)).subscribe({
      next: (response) => {
        const deletedIndex = this.pantry.items.findIndex((i) => i.id === id)
        this.pantry.items.splice(deletedIndex, 1)
        this.account.prompt('deleted item')
      },
      error: (error) => {
        this.pantry.items.push(deleted)
        this.account.prompt('Cannot delete. Currently used in recipe.')
        this.loadPantry(Number(this.pantry.id))
      }
    })
  }

}
