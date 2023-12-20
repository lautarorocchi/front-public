async function find() {
    return fetch(`https://back-public.vercel.app/api/empresas`, {
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

async function crearEmpresa(name, descripcion, email, localidad, rubro, subrubro){
    return fetch(`https://back-public.vercel.app/api/empresas`, {
        method: 'POST',
        body: JSON.stringify({name, descripcion, email, localidad, rubro, subrubro}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Error al crear la Empresa')
        }
    })
}

async function findTipos() {
    return fetch(`https://back-public.vercel.app/api/empresas/tipos`, {
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


async function findById(id){
    return fetch(`https://back-public.vercel.app/api/empresas/${id}`, {
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

async function findByRubro(id){
    return fetch(`https://back-public.vercel.app/api/empresas/rubro/${id}`, {
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

async function findBySubrubro(id){
    return fetch(`https://back-public.vercel.app/api/empresas/subrubro/${id}`, {
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

async function asociadasRubros(id) {
    return fetch(`https://back-public.vercel.app/api/empresas/entidad/${id}`, {
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

async function asociadasSubrubros(id) {
    return fetch(`https://back-public.vercel.app/api/empresas/categoria/${id}`, {
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

async function editarEmpresa(id, name, descripcion, email, localidad, rubro, subrubro){
    return fetch(`https://back-public.vercel.app/api/empresas/${id}`, {
        method: 'PUT',
        body: JSON.stringify({name, descripcion, email, localidad, rubro, subrubro}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Error al crear la Empresa')
        }
    })
}

export{
    find,
    crearEmpresa,
    findTipos,
    findById,
    findByRubro,
    findBySubrubro,
    asociadasRubros,
    asociadasSubrubros,
    editarEmpresa
}