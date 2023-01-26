import { Account } from "./Account"
import { Ingredient } from "./Ingredient"

export class Recipe {
    public id: number | null
    public name: string
    public account: Account
    public image: string
    public ingredients: Ingredient[]
    public steps: string[]
    public shared: boolean
    constructor(id: number | null, name: string, account: Account, image: string, ingredients: Ingredient[], steps: string[], shared: boolean) {
        this.id = id
        this.name = name
        this.account = account
        this.image = image
        this.ingredients = ingredients
        this.steps = steps
        this.shared = shared
    }

    public missing(): Ingredient[] {
        const missing: Ingredient[] = []
        for (let ingredient of this.ingredients) {
            if (ingredient.weight > ingredient.item.quantity) {
              missing.push(ingredient)
            }
          }
        return missing
    }
}