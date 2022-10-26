const { Socket } = require("socket.io")
const { checkJWT } = require("../helpers")


const socketController = async (socket = new Socket()) => {
    // Cuando una persona llega a este punto, debe estar validada

    const token = socket.handshake.headers['x-token'] //> Realizo la busqueda en el objeto con corchetes, ya que es personalizado con guion por nos desde el auth de chat, fn socketConect

    const user = await checkJWT(token)

    if (!user) {
        // Si el usuario NO existe, desconecto el socket del servidor
        return socket.disconnect()
    }

    console.log('Se conecto', user.name)

}

module.exports = {
    socketController
}