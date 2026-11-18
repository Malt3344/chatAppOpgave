//Beskederne
import { Router } from "express";
import { addMessage, getMessages, getMessage} from "../controller.js";

const messagesRouter = Router({ mergeParams: true });

messagesRouter.get("/", async (req, res) => {
  const messages = await getMessages(req.params.chatId);
  res.json(messages);
});

messagesRouter.get("/:messageId", async (req, res) => {
  const message = await getMessage(req.params.chatId, req.params.messageId)
  if(!message) return res.status(404).json({ error: 'Besked ikke fundet' })
  res.json(message)
})

messagesRouter.post("/", async (req, res) => {
  const message = await addMessage(
    req.params.chatId,
    req.body.message,
    req.session.userId,
  );

  if (!message) {
    return res.status(400).json({ error: 'Beskeden må ikke være tom' });
  }

  res.redirect(`/chats/${req.params.chatId}`);
});

export { messagesRouter };
