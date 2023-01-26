import { Recipe } from "./Recipe"

export class Account {
    public id: number | null
    public username: string
    public recipes: Recipe[]
    constructor(id: number | null, username: string, recipes: Recipe[]) {
        this.id = id
        this.username = username
        const instantiateAll: Recipe[] = []
        for (let r of recipes) {
            instantiateAll.push(new Recipe(r.id, r.name, r.account, r.image, r.ingredients, r.steps, r.shared))
        }
        this.recipes = instantiateAll
    }
}