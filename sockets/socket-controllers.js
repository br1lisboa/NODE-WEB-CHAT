const { Socket } = require("socket.io")
const { checkJWT } = require("../helpers")
const { ChatMsjs } = require('../models')

const chatMsjs = new ChatMsjs()


const socketController = async (socket = new Socket(), io) => {
    // Cuando una persona llega a este punto, debe estar validada

    const token = socket.handshake.headers['x-token'] //> Realizo la busqueda en el objeto con corchetes, ya que es personalizado con guion por nos desde el auth de chat, fn socketConect

    const user = await checkJWT(token)

    if (!user) {
        // Si el usuario NO existe, desconecto el socket del servidor
        return socket.disconnect()
    }

    // Pasada la validacion, debemos avisar a todos que un usuario se conecto

    // 1- agregar al objeto user connect
    chatMsjs.connectUser(user)
    io.emit('usuarios-activos', chatMsjs.usersArr)
    socket.emit('recibir-mensajes', chatMsjs.last10)

    // 1a- Conectar a una sala especial
    socket.join(user.id) //> a partir de ahora todos tendran 3 salas, la globa, la de socket.id, y la de user.id

    // 2- limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMsjs.disconnectUser(user.id)
        io.emit('usuarios-activos', chatMsjs.usersArr)
    })

    // 3- Escuchando el evento enviar-msj
    socket.on('enviar-mensaje', ({ uid, msj }) => {

        if (uid) {
            // Esto significa que es un msj privado
            socket.to(uid).emit('mensaje-privado', { de: user.name, msj })

        } else {

            //console.log(msj)
            //console.log(user.id, user.name, msj)
            chatMsjs.sendMsg(user.id, user.name, msj)
            console.log(chatMsjs.last10)
            io.emit('recibir-mensajes', chatMsjs.last10)
        }

    })

}

module.exports = {
    socketController
}