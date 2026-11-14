import Archive from './archive.js'
import User from './model/user.js'
import Chat from './model/chat.js'
import Message from './model/message.js'

let users = []
let chats = []

let usersData = await Archive.readFile('data/users.json')
let chatsData = await Archive.readFile('data/chats.json')


if (usersData) {
    users = JSON.parse(usersData)

    const biggestUserID = users.reduce((max, user) => {
        return Math.max(max, user.id)
    }, 0)

    User.id = biggestUserID + 1
}

if (chatsData) {
    chats = JSON.parse(chatsData)

    const biggestChatID = chats.reduce((max, chat) => {
        return Math.max(max, chat.id)
    }, 0)

    Chat.id = biggestChatID + 1

    const allMessages = chats.flatMap(chat => chat.messages ?? [])

    const biggestMessageID = allMessages.reduce((max, message) => {
        return Math.max(max, message.id)
    }, 0)

    Message.id = biggestMessageID + 1

}

async function addUser(username, password, level) {
    const user = new User(username, password, level)
    users.push(user)
    await Archive.writeFile('data/users.json', JSON.stringify(users))
}

async function deleteUser(userid) {
    users = users.filter(user => user.id != userid)
    await Archive.writeFile('data/users.json', JSON.stringify(users))
}

function checkLogin(username, password){
    return users.find(u => u.username === username && u.password === password)
}

function getUsers() {
    return users
}

// Chats

function getChats(){
    return chats
}

function getChatById(chatId) {
    return chats.find(chat => String(chat.id) === chatId)
}

// Messages
async function addMessage(chatId, text, ownerId) {
    const chat = chats.find(c => c.id == chatId)
    if(!chat) return null
    const message = new Message(text, ownerId, chat.id)
    chat.messages.push(message)
    await Archive.writeFile('data/chats.json', JSON.stringify(chats))
    return message
}

export { addUser, getUsers, deleteUser, checkLogin, getChats, getChatById, addMessage}