import express from 'express'
import { getChatById, getChats } from '../controller.js'
import { requireLogin} from '../middleware.js'

const chatsRouter = express.Router()

chatsRouter.get('/', requireLogin, (req, res) => {
    res.render('chats', { chats: getChats() })
})

chatsRouter.get('/:chatId', requireLogin, (req, res) => {
    const chat = getChatById(req.params.chatId)
    if (!chat) {
        return res.status(404).render('404', { message: 'Chat ikke fundet' })
    }

    res.render('chat', { chat })
})

export {chatsRouter}