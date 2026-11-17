//Delete og update functioner

//Henter beskeder
async function getMessage(){
    const response = await fetch('chats/:id/messages');
    const message = await response.json();
    console.log(message)
}

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