import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import { checkLogin, getChats, getOnlineIds, setOffline, setOnline } from './controller.js'
import { chatsRouter } from './routes/chats.js'
import { usersRouter } from './routes/users.js'

const app = express()

app.set('view engine', 'pug')
app.use(express.static('assets'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}))

app.get('/', async (request, response) => {
    const isValidUser = request.session.isValidUser
    const username = request.session.username
    const level = request.session.level

    let chats = []
    if (isValidUser) {
        chats = await getChats()
    }

    response.render('index', { isValidUser, username, level, chats })
})

app.post('/login', (request, response) => {
    const user = checkLogin(request.body.username, request.body.password)
    if (user) {
        request.session.isValidUser = true
        request.session.username = user.username
        request.session.level = user.level
        request.session.userId = user.id
        
        if (!getOnlineIds().includes(request.session.userId)){
            setOnline(user.id)
        }
    }
    response.redirect('/')
})

app.get('/logout', (request, response) => {
    setOffline(request.session.userId)
    request.session.destroy()
    response.redirect('/')
})

app.use('/users', usersRouter)
app.use('/chats', chatsRouter)

app.use((request, response, next) => {
    response.render('404', {})
})

app.listen(8080, () => {console.log('Serveren kører på port 8080')})
