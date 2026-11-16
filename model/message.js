class Message {

    constructor(message, owner, chat){
        this.message = message
        this.createdAt = new Date()
        this.owner = owner
        this.chat = chat
    }

}

export default Message

