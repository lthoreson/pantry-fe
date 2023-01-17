import { Recipe } from "./Recipe"

export class Account {
    public id: number | null
    public username: string
    public password: string
    public recipes: Recipe[]
    constructor(id: number | null, username: string, password: string, recipes: Recipe[]) {
        this.id = id
        this.username = username
        this.password = password
        const instantiateAll: Recipe[] = []
        for (let r of recipes) {
            instantiateAll.push(new Recipe(r.id, r.name, r.account, r.image, r.ingredients, r.steps))
        }
        this.recipes = instantiateAll
    }
}