import { Router } from "express"
import { getUsers } from "../controller"

const users = Router({mergeParams: true})

//Henter alle bruger
users.get('/users', (req, res) => {
    let users = getUsers()
    res.render('users', {users})
})

//Henter en bruger
users.get('/users/:id', (req, res) => {
    let user = getUser(req.params.id)

    if (user === null){
        res.render('404')
    }
})

users.get('/users/:id/messages', (req, res) => {
    
})