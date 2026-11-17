import express from 'express'
import { getChatById, getChats, addChat, updateChat, deleteChat, canEditChat } from '../controller.js'
import { requireLogin, requireLevel} from '../middleware.js'
import { messagesRouter } from './message.js'

const chatsRouter = express.Router()

chatsRouter.use('/:chatId/messages', requireLogin, messagesRouter)

chatsRouter.get('/', requireLogin, async (req, res) => {
    res.render('chats', { chats: await getChats() })
})

chatsRouter.get('/:chatId', requireLogin, async (req, res) => {
    const chat = await getChatById(req.params.chatId)
    if (!chat) {
        return res.status(404).render('404', { message: 'Chat ikke fundet' })
    }

    res.render('chat', { chat })
})

export {chatsRouter}
