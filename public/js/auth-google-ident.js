function handleCredentialResponse(response) {

    // GOOGLE token : ID_TOKEN
    // console.log('id_token', response.credential);
    const body = { id_token: response.credential }

    // Por defecto el fetch es una peticion GET, nosotros esamos la peticion POST para el sigIn, por lo que hay que transformar esto.
    fetch('http://localhost:6060/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            localStorage.setItem('mail', resp.users.mail)
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