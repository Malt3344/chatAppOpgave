//Beskederne
import { Router } from "express";
import { addMessage } from "../controller.js";

const messages = Router({mergeParams: true})

//Skal måske ændre i url
//Henter alle beskeder i en chat
messages.get('/', (req, res) => {
    const message = allMessages.filter(m => m.chatId === Number(req.params.id))

    res.json(message)
})

//Der skal laves en addmetode i firebase og findes url
messages.post('/', async(req, res) => {
    const message = await addMessage(req.params.id, req.body.message, req.session.userId)

    if (!message){
        return res.status(404).json({error: 'Chat not found'})
    }

    res.status(201).json({message})
})

export {messages}