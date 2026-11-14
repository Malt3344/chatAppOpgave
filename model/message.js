class Message {
    static id = 1

    constructor(message, owner, chat){
        this.id = Message.id++
        this.message = message
        this.createdAt = new Date()
        this.owner = owner
        this.chat = chat
    }

}

export default Message

