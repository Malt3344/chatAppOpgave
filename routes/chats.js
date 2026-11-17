import express from 'express'
import { getChatById, getChats, getMessages, addChat } from '../controller.js'
import { requireLogin} from '../middleware.js'
import { messagesRouter } from './message.js'

const chatsRouter = express.Router()

chatsRouter.use('/:chatId/messages', messagesRouter)

chatsRouter.get('/', requireLogin, async (req, res) => {
    res.render('chats', { chats: await getChats() })
})


chatsRouter.get('/new', requireLogin, (req, res) => {
    res.render('newChat')
})

chatsRouter.post('/', requireLogin, async (req, res) => {
    await addChat(req.body.name, req.session.userId)
    res.redirect('/')
})

chatsRouter.get('/:chatId', requireLogin, async (req, res) => {
    const chat = await getChatById(req.params.chatId)
    if (!chat) {
        return res.status(404).render('404', { message: 'Chat ikke fundet' })
    }

    res.render('chat', { chat })
})

export {chatsRouter}
