import { Router } from "express"
import { getUsers } from "../controller"

const usersRouter = Router({mergeParams: true})

//Henter alle bruger
usersRouter.get('/users', (req, res) => {
    let users = getUsers()
    res.render('users', {users})
})

//Henter en bruger
usersRouter.get('/users/:id', (req, res) => {
    let user = getUser(req.params.id)

    if (user === null){
        res.render('404')
    }
})

usersRouter.get('/users/:id/messages', (req, res) => {
    
})