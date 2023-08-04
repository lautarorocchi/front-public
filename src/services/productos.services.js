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

async function createProduct(producto){
    return fetch(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/productos`, {
        method: 'POST',
        body: producto,
        headers: {
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

async function editProduct(id, producto){
    return fetch(`https://back-public.vercel.app/api/productos/${id}`, {
        method: 'PUT',
        body: producto,
        headers: {
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

export {
    find,
    findById,
    deleteById,
    createProduct,
    editProduct
}