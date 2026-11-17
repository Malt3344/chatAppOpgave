import express from "express";
import {
  getChatById,
  getChats,
  addChat,
  updateChat,
  deleteChat,
  canEditChat,
} from "../controller.js";
import { requireLogin, requireLevel } from "../middleware.js";
import { messagesRouter } from "./message.js";

const chatsRouter = express.Router();

chatsRouter.use("/:chatId/messages", requireLogin, messagesRouter);

chatsRouter.get("/", async (req, res) => {
  const chats = await getChats();
  res.render("chats", { chats });
});

chatsRouter.get("/new", requireLevel(2), (req, res) => {
  res.render("newChat");
});

chatsRouter.get("/:chatId", async (req, res) => {
  const chat = await getChatById(req.params.chatId);

  if (!chat) {
    return res.status(404).render("404", { message: "Chat ikke fundet" });
  }

  res.render("chat", { chat });
});

// Opretter chat (niveau 2+)
chatsRouter.post("/", requireLevel(2), async (req, res) => {
  await addChat(req.body.name, req.session.userId);
  res.redirect("/");
});

// Ret chat (niveau 2 egne, niveau 3 alle chats)
chatsRouter.put("/:chatId", requireLevel(2), async (req, res) => {
  const chat = await getChatById(req.params.chatId);

  if (!chat) {
    return res.status(404).json({ error: "Chat ikke fundet" });
  }

  if (!canEditChat(req.session.level, req.session.userId, chat)) {
    return res.status(403).json({ error: "Ingen adgang" });
  }

  const updatedChat = await updateChat(req.params.chatId, req.body.name);
  res.json(updatedChat);
});

// Slet chat (niveau 2 egne, niveau 3 alle)
chatsRouter.delete('/:chatId', requireLevel(2), async (req, res) => {
    const chat = await getChatById(req.params.chatId)

    if(!chat) {
        return res.status(404).json({error: 'Chat ikke fundet'})
    }

    if(!canEditChat(req.session.level, req.session.userId, chat)){
        return res.status(403).json({error: 'Ingen adgang'})
    }

    await deleteChat(req.params.chatId)
    res.status(204).end()
})

export { chatsRouter };

