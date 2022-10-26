class Msg {
    constructor(uid, name, msg) {
        this.uid = uid
        this.name = name
        this.msg = msg
    }
}

class ChatMsjs {
    constructor() {
        this.mesagges = []
        this.users = {}
    }
    // Metodos para insertar y controlar de manera controloada mesagges y users

    get last10() {
        this.mesagges = this.mesagges.splice(0, 10)
        return this.mesagges
    }

    get usersArr() {
        return Object.values(this.users) //> Con este metodo barro todo el objeto y me retornada un arreglo de objetos [{},{},{}]
    }

    // Metodo para enviar los mensajes, necesito el uid de la persona que esta enviando el msj, name, y el mensaje propiamente
    sendMsg(uid, name, msj) {
        this.mesagges.unshift(
            new Msg(uid, name, msj)
        )
    }

    // Metodo para agregar un usuario
    connectUser(user) {
        this.users[user.id] = user
    }

    // Metodo para desconectar usuario
    disconnectUser(id) {
        delete this.users[id]
    }
}

module.exports = ChatMsjs