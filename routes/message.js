//Beskederne
import { Router } from "express";
import { addMessage } from "../controller.js";

const messages = Router({mergeParams: true})

//Henter alle beskeder i en chat
messages.get('/', (req, res) => {
    const id = req.params.id
    const message = chats.find(c => c.id === id).messages

    res.render('chat', {message})
})

//Der skal laves en addmetode i firebase
messages.post('/', async(req, res) => {
    const message = await addMessage(req.params.id, req.body.message, req.session.userId)

    if (!message){
        return res.status(404).json({error: 'Chat or user not found'})
    }

    res.render('chat', {message})
})

export {messages}