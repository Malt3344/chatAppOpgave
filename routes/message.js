//Beskederne
import { Router } from "express";
import { addMessage, getMessages } from "../controller.js";

const messagesRouter = Router({ mergeParams: true });

messagesRouter.get("/", async (req, res) => {
  const messages = await getMessages(req.params.chatId);
  res.json(messages);
});

//Der skal laves en addmetode i firebase
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
