(() => {
    const ws = new WebSocket(window.location.origin.replace('http', 'ws') + '/ws')
    const imageElement = document.querySelector('img')

    ws.addEventListener('message', ev => {
        imageElement.src = 'preview?_truco=' + +new Date;
    })
})()
