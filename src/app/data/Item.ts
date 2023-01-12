export class Item {
    public id: number | null
    public name: string
    public quantity: number
    public image: string
    constructor(id: number | null, name: string, quantity: number, image: string) {
        this.id = id
        this.name = name
        this.quantity = quantity
        this.image = image
    }
}