export class Item {
    public id: number | null
    public name: string
    public quantity: number
    public image: string
    public weight: number
    public calories: number
    constructor(id: number | null, name: string, quantity: number, image: string, weight: number, calories: number) {
        this.id = id
        this.name = name
        this.quantity = quantity
        this.image = image
        this.weight = weight
        this.calories = calories
    }
}