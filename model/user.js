class User {
    static id = 1

    constructor(username, password, level = 1){
        this.id = User.id++
        this.username = username
        this.password = password
        this.level = level
        this.createdAt = new Date()
    }

    
}


export default User

