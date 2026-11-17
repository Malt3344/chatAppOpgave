import { Router } from "express"
import { getUsers, getUserById, getMessagesByUser, withoutPassword, getOnlineIds, addUser, deleteUser } from "../controller.js"
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

usersRouter.get('/addUser', requireLogin, (req, res) => {
    res.render('addUser')
})

usersRouter.get('/', requireLogin, (req, res) => {
    const user = getUserById(req.params.id)
    if (!user) {
        return res.status(404).render('404')
    }
    res.json(withoutPassword(user))
})

usersRouter.get('/:id/messages', requireLogin, async (req, res) => {
    const messages = await getMessagesByUser(req.params.id)
    res.json(messages)
})

usersRouter.post('/', async (req, res) => {
    await addUser(req.body.username, req.body.password, Number(req.body.level))
    res.redirect('/users')
})

usersRouter.delete('/:id', async (req, res) => {
    await deleteUser(req.params.id)
    res.sendStatus(200)
})

export { usersRouter }
