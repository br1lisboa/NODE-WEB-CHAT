// Hacemos la referencia al unico form que tenemos en nuestro html
const myForm = document.querySelector('form')


const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:6060/api/auth/'
    : 'https://node-s0cket-chat.herokuapp.com/api/auth/'


// Le agregamos el listener al form
myForm.addEventListener('submit', e => {
    e.preventDefault()

    const formData = {}

    // Leemos todos los datos del formulario
    for (let e of myForm.elements) {
        if (e.name.length > 0) formData[e.name] = e.value
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg)
            }
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(err => {
            console.log(err)
        })
})


function handleCredentialResponse(response) {

    // GOOGLE token : ID_TOKEN
    // console.log('id_token', response.credential);
    const body = { id_token: response.credential }

    // Por defecto el fetch es una peticion GET, nosotros esamos la peticion POST para el sigIn, por lo que hay que transformar esto.

    //fetch(url + 'google',

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            console.log(token)
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(console.warn)
}

const button = document.getElementById('google_signout')
button.onclick = () => {
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('mail'), done => {
        localStorage.clear()
        location.reload()
    })
}