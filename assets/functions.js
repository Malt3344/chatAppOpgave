
//Slet bruger
document.querySelectorAll('.deleteUser').forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault()
        const userId = button.dataset.userId
        const link = '/users/' + userId

        try {
            const result = await fetch(link, {
                method: 'DELETE'
            })

            if (result.ok) {
                window.location = '/users'
            } else {
                console.error('Kunne ikke slette bruger:', result.status)
            }
        } catch (err) {
            console.error('Kunne ikke slette bruger', err)
        }
    })
})

//Slet chat fra chatoversigten
document.querySelectorAll('.sletChat').forEach(button => {
    button.addEventListener('click', async () => {
        const chatId = button.dataset.chatId

        const result = await fetch('/chats/' + chatId, { method: 'DELETE' })

        if (result.ok) {
            // Fjern chatten fra listen uden at genindlæse siden
            button.parentElement.remove()
        } else {
            alert('Kunne ikke slette chatten')
        }
    })
})

//Ret chatnavn (på chatsiden)
const retChatButton = document.querySelector('#retChat')
if (retChatButton) {
    retChatButton.addEventListener('click', async () => {
        const chatId = retChatButton.dataset.chatId
        const newName = prompt('Nyt navn til chatten:')
        if (!newName) return

        const result = await fetch('/chats/' + chatId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        })

        if (result.ok) {
            // Vis det nye navn uden at genindlæse siden
            document.querySelector('#chatNavn').textContent = newName
        } else {
            alert('Kunne ikke rette chatten')
        }
    })
}

//Slet chat (på chatsiden)
const sletChatButton = document.querySelector('#sletChatSide')
if (sletChatButton) {
    sletChatButton.addEventListener('click', async () => {
        const chatId = sletChatButton.dataset.chatId

        const result = await fetch('/chats/' + chatId, { method: 'DELETE' })

        if (result.ok) {
            window.location = '/'
        } else {
            alert('Kunne ikke slette chatten')
        }
    })
}
