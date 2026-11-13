import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import { checkLogin } from './controller.js'

//import chatsRouter from "./routes/chats.js"
//import userRouter from "./routes/users.js"

const app = express()

app.set('view engine', 'pug')
app.use(express.static('assets'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: 'F64AC984-1047-4EB3-8D50-3A5620E76706',
    saveUninitialized: true,
    resave: true
}))

app.get('/', (request, response) => {
    const isValidUser = request.session.isValidUser
    const username = request.session.username
    const level = request.session.level

    //midlertidigt indtil vi får chats:
    const chats = []

    response.render('index', { isValidUser, username, level, chats })
})

app.post('/login', (request, response) => {
    const user = checkLogin(request.body.username, request.body.password)
    if (user) {
        request.session.isValidUser = true
        request.session.username = user.username
        request.session.level = user.level
        request.session.userId = user.id
    }
    response.redirect('/')
})

app.get('/logout', (request, response) => {
    request.session.destroy()
    response.redirect('/')
})

// app.use('/users', userRouter)
// app.use('/chats', chatsRouter)

app.use((request, response, next) => {
    response.render('404', {})
})

app.listen(8080, () => {console.log('Serveren kører på port 8080')})
