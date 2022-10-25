const { Socket } = require("socket.io")


const socketController = (socket = new Socket()) => {
    // Cuando una persona llega a este punto, debe estar validada

    console.log('cliente conectado', socket.id)

}

module.exports = {
    socketController
}