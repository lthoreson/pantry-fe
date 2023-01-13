import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { Item } from '../data/Item';
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

}
