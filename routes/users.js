import { Router } from "express"
import { getUsers, getUserById, getMessagesByUser, withoutPassword } from "../controller.js"
import { requireLogin, requireLevel } from "../middleware.js"

const usersRouter = Router({ mergeParams: true })

usersRouter.get('/', requireLogin, requireLevel(3), (req, res) => {
    const users = getUsers().map(withoutPassword)
    res.render('users', { users })
})

usersRouter.get('/:id', requireLogin, (req, res) => {
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

export { usersRouter }
