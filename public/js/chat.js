const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:6060/api/auth/'
    : 'https://restserver-n0d3js.herokuapp.com/api/auth/'

// Aca disparamos la conexion con nuestro backendServer
let user = null
let socket = null


// REFERENCIAS HTML
const txtUid = document.querySelector('#txtUid')
const txtMsg = document.querySelector('#txtMsg')
const ulUsers = document.querySelector('#ulUsers')
const ulMsg = document.querySelector('#ulMsg')
const btnOut = document.querySelector('#btnOut')


// fn para validar JWT DEL LOCALSTORAGE
const validateJWT = async () => {

    const token = localStorage.getItem('token') || ''

    // Validacion al token, crear las que se crea necesario
    if (token.length <= 10) {
        // Redireccionamos con location en caso de error en token
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    // LLAMAR ENDPOINT
    const resp = await fetch(url, {
        headers: { 'x-token': token }
    })

    const { userAuth, token: tokenDB } = await resp.json()
    // console.log(userAuth, tokenDB)

    // renovamos token
    localStorage.setItem('token', tokenDB)

    // Seteamos la info del user logueado en user
    user = userAuth
    document.title = user.name

    await socketConect()

}


const socketConect = async () => {

    // Aca puedo mandarle informacion a la conecxion socket por params
    socket = io({

        'extraHeaders': {
            'x-token': localStorage.getItem('token') // >> Que yo se que ya esta validado por que sino no pasaria por el validateJWT
        }

    })

    // Esto es practicamente sincrono, por lo que puedo crear los eventos cuando este socket se dispare
    socket.on('connect', () => {
        console.log('Sockets online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    })

    // ESCUCHAS NECESARIAS
    // Recibir mensajes
    socket.on('recibir-mensajes', (payload) => {
        showMsjs(payload)
    })

    // Escuchar usarios activos, cuando se conectan
    socket.on('usuarios-activos', (payload) => {
        showUser(payload)
    })

    // Recibir mensajes privados
    socket.on('mensaje-privado', () => {
        //TODO:
    })
}


const showUser = (users = []) => {

    let usersHtml = ''
    users.forEach(({ name, uid }) => {
        usersHtml += `
        
        <li>
            <p>
                <h5 class="text-success"> ${name} </h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        
        `
    })

    ulUsers.innerHTML = usersHtml

}

const showMsjs = (msjs = []) => {

    let msjsHtml = ''

    msjs.forEach(({ msg, name }) => {

        msjsHtml += `
        
        <li>
            <p>
                <span class="text-primary"> ${name} </span>
                <span">${msg}</span>
            </p>
        </li>
        
        `


    })

    ulMsg.innerHTML = msjsHtml

}


// fn para el chat, con tecla enter
txtMsg.addEventListener('keyup', e => {

    //console.log(e.keyCode)
    const msj = txtMsg.value
    //console.log(msj)
    const uid = txtUid.value

    if (e.keyCode !== 13) {
        //console.log('mmm')
        return
    }

    if (msj.length === 0) {
        //console.log('kkk')
        return
    }

    // Una vez que tenemos el msj validado (agregar segun gustos) necesitamos emitir este msj al controlador
    //console.log(msj)
    socket.emit('enviar-mensaje', { msj, uid })
    //console.log(msj)
    txtMsg.value = ''

})

// Creo fn main
const main = async () => {

    // Valido JWT
    await validateJWT()

}

// Ejecuto fn main
main()

// Antes de llamar esto debo validar si nuestro JWT es correcto, para esto creamos la ruta renewJWT