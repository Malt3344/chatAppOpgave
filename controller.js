import Archive from './archive.js'
import User from './model/user.js'
import Chat from './model/chat.js'
import Message from './model/message.js'
import * as service from './service.js'
import {encrypt, decrypt} from './crypto.js'
import crypto from 'crypto'

// bruger vi senere til at se hvem er online
let onlineIds = [] 

let users = []

let usersData = await Archive.readFile('data/users.json')

if (usersData) {
    users = JSON.parse(usersData)

    const biggestUserID = users.reduce((max, user) => {
        return Math.max(max, user.id)
    }, 0)

    User.id = biggestUserID + 1
}


function hash(password){
    return crypto.createHash('sha256').update(password).digest('hex')
}

// Users

async function addUser(username, password, level) {
    const user = new User(username, hash(password), level)
    users.push(user)
    await Archive.writeFile('data/users.json', JSON.stringify(users))
}

async function deleteUser(userid) {
    users = users.filter(user => user.id != userid)
    await Archive.writeFile('data/users.json', JSON.stringify(users))
}

function checkLogin(username, password){
    return users.find(u => u.username === username && u.password === hash(password))
}

function getUsers() {
    return users
}

function getUserById(id){
    let user =  users.find(u => u.id == id)

    if (!user){
        return null
    }

    return user
}

function withoutPassword(user) {
    return { id: user.id, username: user.username, level: user.level, createdAt: user.createdAt }
}

function setOnline(userId) {
    onlineIds.push(userId)
}

function setOffline(userId) {
    onlineIds = onlineIds.filter(id => id != userId)
}

function getOnlineIds() {
    return onlineIds
}

// Adgang: niveau 3 må alt - niveau 2 kun sine egne chats
function canEditChat(level, userId, chat) {
    return level == 3 || (level == 2 && chat.owner == userId)
}


// Chats


async function getChats(){
    return await service.getChats()
}

async function getChatById(chatId) {
    const chat = await service.getChatById(chatId)
    if (chat) {
        chat.messages = await getMessages(chatId)
    }
    return chat
}

async function addChat(name, ownerId) {
    const chat = new Chat(name, ownerId)
    return await service.addChat(chat)
}

async function updateChat(chatId, name) {
    return await service.updateChat(chatId, { name })
}

async function deleteChat(chatId) {
    await service.deleteChat(chatId)
}

// Messages


function readMessage(message){
    try {
        message.message = decrypt(message.message)
    } catch {

    }
    const owner = getUserById(message.owner)
    message.username = owner ? owner.username : 'slettet bruger'
    return message
}



async function getMessages(chatId) {
    const messages = await service.getMessagesByChatId(chatId)
    return messages.map(readMessage)
}

async function getMessage(chatId, messageId) {
    const message = await service.getMessageById(chatId, messageId)
    if (!message) return null
    return readMessage(message)
}

async function getMessagesByUser(userId) {
    const chats = await getChats()
    const userMessages = []

    for(const chat of chats) {
        const messages = await getMessages(chat.id)
        for(const message of messages) {
            if(message.owner == userId) {
                userMessages.push(message)
            }
        }
    }
    return userMessages
}



async function addMessage(chatId, text, ownerId) {
    if (!text) return null

    // RSA kan kun kryptere korte tekster (max 190 bytes), så vi skærer beskeden ned
    const encryptedText = encrypt(text.slice(0, 90))

    const message = new Message(encryptedText, ownerId, chatId)
    return await service.addMessage(chatId, message)
}


export {
    addUser, getUsers, getUserById, deleteUser, checkLogin, withoutPassword, setOnline, setOffline, getOnlineIds,
    canEditChat, getChats, getChatById, addChat, updateChat, deleteChat,
    getMessages, getMessage, getMessagesByUser, addMessage
}