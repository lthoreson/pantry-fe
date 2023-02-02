import { Account } from "./Account"
import { Item } from "./Item"

export class Pantry {
    public id: number | null
    public name: string
    public owner: Account
    public members: Account[]
    public items: Item[]
    constructor(id: number | null, name: string, owner: Account, members: Account[] = [], items: Item[] = []) {
        this.id = id
        this.name = name
        this.owner = owner
        this.members = members
        this.items = items
    }
}