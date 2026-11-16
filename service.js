import "dotenv/config"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore"


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const database = getFirestore(app)

// Sådan ligger data i databasen:

// chats/{chatId}                      = én chat
// chats/{chatId}/messages/{messageId} = beskederne i den chat

const chatsCollection = collection(database, "chats")

function getMessagesCollection(chatId) {
  return collection(database, "chats", chatId, "messages")
}

// Hjælpefunktion

function documentToObject(document) {
  const data = document.data()

  data.id = document.id;

  data.createdAt = data.createdAt.toDate()

  return data;
}

// Chats

// Henter alle chats (ældste først)
async function getChats() {
  const chatsQuery = query(chatsCollection, orderBy("createdAt"))
  const result = await getDocs(chatsQuery)

  const chats = []
  for (const document of result.docs) {
    chats.push(documentToObject(document))
  }
  return chats;
}

// Henter én chat ud fra dens id. Giver null, hvis chatten ikke findes
async function getChatById(chatId) {
  const chatReference = doc(chatsCollection, chatId)
  const document = await getDoc(chatReference)

  if (!document.exists()) {
    return null
  }

  return documentToObject(document)
}

// Opretter en ny chat og returnerer den (inklusiv dens nye id)
async function addChat(chat) {
  let createdAt = chat.createdAt
  if (!createdAt) {
    createdAt = new Date()
  }

  const chatData = {
    name: chat.name,
    owner: chat.owner,
    createdAt: createdAt,
  };

  const newDocument = await addDoc(chatsCollection, chatData)

  // id'et sættes på efter addDoc, så det ikke bliver gemt som et felt i databasen
  chatData.id = newDocument.id
  return chatData
}

// Ændrer navnet på en chat og returnerer den opdaterede chat
async function updateChat(chatId, changes) {
  const chatReference = doc(chatsCollection, chatId)

  await updateDoc(chatReference, {
    name: changes.name,
  })

  return getChatById(chatId)
}

// Sletter en chat og alle dens beskeder
async function deleteChat(chatId) {
  // Firestore sletter ikke beskederne automatisk, så det gør vi først
  const messages = await getMessagesByChatId(chatId)

  for (const message of messages) {
    const messageReference = doc(getMessagesCollection(chatId), message.id)
    await deleteDoc(messageReference)
  }

  // Til sidst slettes selve chatten
  const chatReference = doc(chatsCollection, chatId)
  await deleteDoc(chatReference)
}

// Beskeder

// Henter alle beskeder i en chat, ældste først
async function getMessagesByChatId(chatId) {
  const messagesQuery = query(getMessagesCollection(chatId), orderBy("createdAt"))
  const result = await getDocs(messagesQuery)

  const messages = []
  for (const document of result.docs) {
    messages.push(documentToObject(document))
  }
  return messages
}

// Henter én besked. Giver null, hvis beskeden ikke findes.
async function getMessageById(chatId, messageId) {
  const messageReference = doc(getMessagesCollection(chatId), messageId)
  const document = await getDoc(messageReference)

  if (!document.exists()) {
    return null
  }

  return documentToObject(document)
}

// Opretter en ny besked i en chat og returnerer den (inklusiv dens nye id)
async function addMessage(chatId, message) {
  let createdAt = message.createdAt
  if (!createdAt) {
    createdAt = new Date()
  }

  const messageData = {
    message: message.message,
    owner: message.owner,
    chat: chatId,
    createdAt: createdAt,
  }

  const newDocument = await addDoc(getMessagesCollection(chatId), messageData)

  // id'et sættes på efter addDoc, så det ikke bliver gemt som et felt i databasen
  messageData.id = newDocument.id
  return messageData
}


export {
  getChats,
  getChatById,
  addChat,
  updateChat,
  deleteChat,
  getMessagesByChatId,
  getMessageById,
  addMessage,
};
