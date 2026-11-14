class Chat {
    static id = 1

    constructor(name, owner){
        this.id = Chat.id++
        this.name = name
        this.createdAt = new Date()
        this.owner = owner
        this.messages = []
    }

}

export default Chat
