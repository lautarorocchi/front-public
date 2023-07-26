async function login(email, password) {
    return fetch(`http://localhost:2022/api/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
    return fetch(`http://localhost:2022/api/usuarios`, {
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
    return fetch(`http://localhost:2022/api/usuarios/logout`, {
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
    return fetch(`http://localhost:2022/api/usuarios/${id}`, {
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
    return fetch(`http://localhost:2022/api/usuarios/${id}`, {
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

export {
    login,
    createUser,
    logout,
    findById,
    editar
}