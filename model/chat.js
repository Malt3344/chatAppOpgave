class Chat {

    constructor(name, owner){
        this.name = name
        this.createdAt = new Date()
        this.owner = owner
        this.messages = []
    }

}

export default Chat
