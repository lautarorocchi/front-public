async function login(email, password) {
    return fetch(`https://back-public.vercel.app/api/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error('Email o contraseña incorrecto, por favor ingresa los datos nuevamente.')
            }
        })
}

async function createUser(name, surname, empresa, email, password) {
    return fetch(`https://back-public.vercel.app/api/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name , surname, empresa, email, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error('Error al crear un nuevo usuario')
            }
        })
}

async function logout(){
    return fetch(`https://back-public.vercel.app/api/usuarios/logout`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
    })
    .then(response => {
        if (response.ok) {
            return response
        }
        else {
            throw new Error('Error al cerrar sesión')
        }
    })
}

async function findById(id){
    return fetch(`https://back-public.vercel.app/api/usuarios/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Error al pedir los datos')
        }
    })
}

async function editar(id, name, surname, email){
    return fetch(`https://back-public.vercel.app/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ name , surname, email})
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Error al pedir los datos')
        }
    })
}

async function crearVerificar(id, id_user, name, surname, email){
    return fetch(`https://back-public.vercel.app/api/verify/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({id_user, name , surname, email})
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Error al pedir los datos')
        }
    })
}


async function validarUsuario(id){
    return fetch(`https://back-public.vercel.app/api/verify/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Error al pedir los datos')
        }
    })
}

async function enviarCodigo(email){
    return fetch(`https://back-public.vercel.app/api/usuarios/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email})
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('El email que ingresaste no es valido o no se encuentra registrado en la aplicación, intenta nuevamente.')
        }
    })
}

async function validarCodigo(code){
    return fetch(`https://back-public.vercel.app/api/usuarios/validate-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({code})
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('El código que ingresaste no es valido o ha expirado, intenta nuevamente.')
        }
    })
}

async function cambiarClave(code, password){
    return fetch(`https://back-public.vercel.app/api/usuarios/forgot-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({code, password})
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Error desconocido');
            });
        }
    })
}

async function createUserAdmin(name, surname, empresa, email, password) {
    return fetch(`https://back-public.vercel.app/api/usuarios/admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name , surname, empresa, email, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error('Error al crear un nuevo usuario')
            }
        })
}

export {
    login,
    createUser,
    logout,
    findById,
    editar,
    crearVerificar,
    validarUsuario,
    enviarCodigo,
    validarCodigo,
    cambiarClave,
    createUserAdmin
}