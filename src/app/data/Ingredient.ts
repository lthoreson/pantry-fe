import { Item } from "./Item";

export class Ingredient {
    public item: Item
    public weight: number
    constructor(item: Item, weight: number) {
        this.item = item
        this.weight = weight
    }
}