async function getMessage(){
    const response = await fetch('chats/:id/messages');
    const message = await response.json();
    console.log(message)
}

getMessage()