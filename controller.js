import Archive from './archive.js'
import User from './model/user.js'
//import Message from './model/message.js'
//import Chat from './model/chat.js'

let users = []
let chats = []

let usersData = await Archive.readFile('data/users.json')
let chatsData = await Archive.readFile('data/chats.json')

if (usersData) {
    users = JSON.parse(usersData)
    const biggestID = users.reduce((accumulator, user) => {
        return user.id >= accumulator ? user.id : accumulator
    }, 0)
    User.id = biggestID + 1
}

if (chatsData) {
    chats = JSON.parse(chatsData)
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

function getChats(){
    return chats
}

function getChatById(chatId) {
    return chats.find(chat => String(chat.id) === chatId)
}

export { addUser, getUsers, deleteUser, checkLogin, getChats, getChatById }