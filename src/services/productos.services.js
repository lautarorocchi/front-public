async function find(id, token) {
    return fetch(`https://back-public.vercel.app/api/products/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
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

async function createProduct(name, description, img, cantidad, empresa_id){
    return fetch(`https://back-public.vercel.app/api/productos`, {
        method: 'POST',
        body: JSON.stringify({name, description, img, cantidad, empresa_id}),
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Error al crear Producto')
        }
    })
}

async function findById(id){
    return fetch(`https://back-public.vercel.app/api/productos/${id}`, {
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


async function deleteById(id){
    return fetch(`https://back-public.vercel.app/api/productos/${id}`, {
        method: 'DELETE',
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
            throw new Error('Error al eliminar el producto')
        }
    })
}

async function editProduct(id, name, description, img, cantidad, empresa_id){
    return fetch(`https://back-public.vercel.app/api/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({name, description, img, cantidad, empresa_id}),
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
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

async function findArchive(id, token) {
    return fetch(`https://back-public.vercel.app/api/productos/archivados/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
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


export {
    find,
    findById,
    deleteById,
    createProduct,
    editProduct,
    findArchive
}