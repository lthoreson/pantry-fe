export class Account {
    public id: number | null
    public username: string
    public password: string
    constructor(id: number | null, username: string, password: string) {
        this.id = id
        this.username = username
        this.password = password
    }
}