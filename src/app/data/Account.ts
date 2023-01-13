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
        this.recipes = recipes
    }
}