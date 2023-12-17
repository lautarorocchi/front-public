import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import {
    Link
} from "react-router-dom";
import * as ProductsServices from '../services/productos.services'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import {storage} from '../services/firebase.js'
import {ref, uploadBytes} from 'firebase/storage'
import {v4} from 'uuid'
import Access from '../components/Access.jsx';
import * as UserServices from './../services/user.services.js'
import Loading from '../components/Loading.jsx';

const schema = yup.object({
    name: yup.string().required("Se necesita ingresar un nombre para crear una cuenta."),
    description: yup.string().min(10, "La descripción debe tener al menos 10 letras.").required("Se necesita ingresar una descripción para crear una cuenta."),
    cantidad: yup.number().required("Se necesita ingresar la cantidad del producto para crearlo.").typeError("Solo se pueden ingresar numeros en este campo.")
})


function EditProduct() {
    const user = localStorage.getItem('user');
    const [certificarAcceso, setCertificarAcceso] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    let defaultValues = {};
    const empresa = localStorage.getItem('empresa');
    const [imageUpload, setImageUpload] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }, []);
    

    const uploadFile = (imagen) => {
      if(imageUpload == null) return;
      const imageRef = ref(storage, `imagenes/productos/${imagen}`)
      uploadBytes(imageRef, imageUpload).then(() => {
    })
    };

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        const imageLinker = imageUpload.name + v4();
        ProductsServices.editProduct(id, data.name, data.description, imageLinker, data.cantidad, empresa)
            .then(data => {
                if (data) {
                    uploadFile(imageLinker);
                    navigate('/admin',{ state: {edited: "¡El producto ha sido editado! Puedes observarlo en el panel de control." } })
                }
                else {
                    navigate('/404')
                }
            })
            .catch((error) => {
                alert('El producto no se pudo editar');
            });

    };


    useEffect(() => {
        validarAcceso(user);
        ProductsServices.findById(id)
            .then(data => {
                if (data) {
                    defaultValues.name = data.name;
                    defaultValues.description = data.description;
                    defaultValues.cantidad = data.cantidad;
                    reset({ ...defaultValues });
                }
                else {
                    navigate('/404')
                }
            })
            .catch(err => {
                navigate('/404')
            })
    }, [id,user, reset])


    /*ARREGLAR IMAGEN SETEADA*/
    function onChangeImg(event) {
        setImg(event.target.value);
    }

    function validarAcceso(user) {
        UserServices.findById(user)
          .then(data => {
            if (data.verified == true) {
              setCertificarAcceso(true)
            } else {
              setCertificarAcceso(false)
            }
        })}

    return (
        <div className='container'>
        {loading ? (<article className='centered'><Loading/></article>
           ) : certificarAcceso ? (
            <article className="centered">
                <div>
                    <hgroup>
                        <h2>Edíta tu producto</h2>
                        <h3><div>Edíta un producto en el panel de administración, </div>¿No querias editar el producto? Vuelve al <Link to="/admin"><u>Panel de control</u></Link>.</h3>
                    </hgroup>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor='name' className='left'>Producto</label>
                        <input type="text" name='id' value={id} readonly disabled></input>
                        <input type="text" id="name" placeholder="Agregar Nombre del producto" name="producto" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}/>
                        {
                            errors.name?.message ? <p className='errorYup'>{errors.name?.message}</p> : ''
                        }
                        <label htmlFor='description' className='left'>Descripción</label>
                        <textarea type="text" id="description" placeholder="Agregar Descripción" name="description"  className={errors.description?.message ? 'redBorder' : ''} {...register("description")}/>
                        {
                            errors.description?.message ? <p className='errorYup'>{errors.description?.message}</p> : ''
                        }
                        <label htmlFor='cantidad' className='left'>Cantidad</label>
                        <input type="number" id="cantidad" placeholder="Agregar Cantidad" name="cantidad" className={errors.cantidad?.message ? 'redBorder' : ''} {...register("cantidad")}/>
                        {
                            errors.cantidad?.message ? <p className='errorYup'>{errors.cantidad?.message}</p> : ''
                        }
                        <label for="file">Imagen
                            <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} required></input>
                        </label>
                        <button type='submit' className='marginado color-especial'>Editar producto</button>
                    </form>
                </div>
            </article>):(
            <Access></Access>
            )}
        </div>
    )
}

export default EditProduct
