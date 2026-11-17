import { doc } from "firebase/firestore"


// Slet en chat
async function deleteChat(chatId){
    const response = await fetch(`/chats/${chatId}`, {method: 'DELETE'})

    // status kode mellem 200-299
    if(response.ok){
        document.getElementById(`chat-${chatId}`).remove()
    }
}

// Ret navnet på en chat
async function editChat(chatId) {
    const name = prompt('Nyt navn:')

    const response = await fetch(`/chats/${chatId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'appliaction/json'},
        body: JSON.stringify({name})
    })

    if(response.ok){
        // fund <a>-elementet der ligger inde i elementet med id: chat-abc123
        document.querySelector(`#chat-${chatId} a`).textContent = name
    }
}