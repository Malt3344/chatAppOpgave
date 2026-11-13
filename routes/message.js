//Beskederne
import { Router } from "express";

const messages = Router()

const allMessages = [{id: 1, message: 'Hej med dig', dato: new Date('2026-11-13'), ejer: 'Bo', chatId: 1}]

//Skal måske ændre i url
//Henter alle beskeder i en chat
messages.get('chats/:id/messages', (req, res) => {
    const message = allMessages.filter(m => m.chatId === Number(req.params.id))

    res.json(message)
})

//Der skal laves en addmetode i firebase og findes url
messages.post('/', async(req, res) => {
    addMessage(req.body.message, req.session.isLoggin, req.body.chatId)
    res.render('/')
})



export {messages}