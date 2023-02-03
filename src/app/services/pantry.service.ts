import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, take } from 'rxjs';
import { Account } from '../data/Account';
import { Item } from '../data/Item';
import { Pantry } from '../data/Pantry';
import { Recipe } from '../data/Recipe';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PantryService {
  private pantry: Pantry = new Pantry(null, '', this.account.getAccountInfo())
  private $items: Subject<Item[]> = new Subject()
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
    // pull items from all the recipes
    for (let r of this.account.getAccountInfo().recipes) {
      for (let i of r.ingredients) {
       allRecipeItems.push(i.item)
      }
    }
    // list item names
    const itemNames = this.pantry.items.map((i) => i.name.toLowerCase())
    // filter out existing pantry items
    const newItems = allRecipeItems.filter((i) => !itemNames.includes(i.name.toLowerCase()))
    // if (newItems.length === 0) {
    //   return this.account.prompt('Nothing to import')
    // }
    const deepCopy = JSON.parse(JSON.stringify(newItems))
    // make new item objects
    deepCopy.forEach((item: Item) => {item.id = null; item.quantity = 0});
    // add to local pantry
    this.pantry.items = this.pantry.items.concat(deepCopy)
    // request to update pantry database
    this.modPantry(this.pantry)
    this.$items.pipe(take(1)).subscribe({
      next: (dbItems) => {
        // on server response, change ids for the recipe's items so it can be used with current pantry
        for (let rItem of allRecipeItems) {
          const found = dbItems.find((i) => i.name.toLowerCase() === rItem.name.toLowerCase())
          if (found) {
            rItem.id = found.id
          }
        }
        for (let r of this.account.getAccountInfo().recipes) {
          this.account.modRecipe(r.id,r.name, r.image, r.ingredients, r.steps, r.shared, this.pantry.id)
        }
      }
    })
  }

  public modPantry(modifiedPantry: Pantry) {
    this.http.put<Pantry>(`${this.url2}?token=${this.account.getLocalToken()}`, modifiedPantry).pipe(take(1)).subscribe({
      next: (response) => {
        const pantryIndex = this.pantryList.findIndex((p) => p.id === response.id)
        this.pantryList[pantryIndex] = response
        this.pantry = response
        this.$items.next(response.items)
        this.account.prompt('Success!')
      },
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public deletePantry(trash: Pantry): void {
    this.http.delete(`${this.url2}/${trash.id}?token=${this.account.getLocalToken()}`).pipe(take(1)).subscribe({
      next: (response) => {
        const pantryIndex = this.pantryList.findIndex((p) => p.id === trash.id)
        this.pantryList.splice(pantryIndex, 1)
        this.account.prompt('Success!')
      },
      error: (error) => {this.account.prompt(error.error.message)}
    })
  }

  public deleteAccount(trash: Account) {
    // delete all recipes
    for (let r of trash.recipes) {
      this.account.deleteRecipe(r.id)
    }
    // delete owned pantries
    for (let p of this.pantryList) {
      if (p.owner.id === trash.id) {
        this.deletePantry(p)
      }
    }
    // remove account from pantry memberships
    for (let p of this.pantryList) {
      const trashIndex = p.members.findIndex((m) => m.id === trash.id)
      if (trashIndex !== -1) {
        p.members.splice(trashIndex, 1)
        this.modPantry(p)
      }
    }
    this.account.deleteAccount() //
    // try to delete when requests finish
    // this.$items.pipe(take(count)).subscribe({
    //   next: () => {
    //     done++
    //     if (done === count) {
    //       this.account.deleteAccount()
    //     }
    //   }
    // })
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
        this.account.getAccount(this.account.getLocalToken())
        this.loadPantry(Number(this.pantry.id))
        this.account.prompt(`Ingredients for ${recipe.name} were removed from the pantry`)
      },
      error: (error) => {this.account.prompt('')}
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
