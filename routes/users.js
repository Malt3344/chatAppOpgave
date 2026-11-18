import { Router } from "express"
import { getUsers, getUserById, getMessagesByUser, withoutPassword, addUser, deleteUser, getOnlineIds } from "../controller.js"
import { requireLogin, requireLevel } from "../middleware.js"

const usersRouter = Router({ mergeParams: true }) 

usersRouter.use(requireLogin, requireLevel(3))

usersRouter.get('/', requireLogin, requireLevel(3), (req, res) => {
    const users = getUsers().map(withoutPassword).map(u => {
        return {
            id: u.id,
            username: u.username,
            level: u.level,
            createdAt: u.createdAt, 
            online: getOnlineIds().includes(u.id)
        }
    })
    res.render('users', { users })
})

usersRouter.get('/addUser', (req, res) => {
    res.render('addUser')
})

usersRouter.get('/:id', (req, res) => {
    const user = getUserById(req.params.id)
    if (!user) {
        return res.status(404).json({ error: 'Bruger ikke fundet' })
    }
    res.json(withoutPassword(user))
})

usersRouter.get('/:id/messages', async (req, res) => {
    const messages = await getMessagesByUser(req.params.id)
    res.render('messages', { messages })
})

usersRouter.post('/', async (req, res) => {
    await addUser(req.body.username, req.body.password, Number(req.body.level))
    res.redirect('/users')
})

usersRouter.delete('/:id', async (req, res) => {
    await deleteUser(req.params.id)
    res.sendStatus(204)
})

export { usersRouter }
