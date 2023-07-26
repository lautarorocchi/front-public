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

const schema = yup.object({
    name: yup.string().required("Se necesita ingresar un nombre para crear una cuenta."),
    description: yup.string().min(10, "La descripción debe tener al menos 10 letras.").required("Se necesita ingresar una descripción para crear una cuenta."),
    cantidad: yup.number().required("Se necesita ingresar la cantidad del producto para crearlo.").typeError("Solo se pueden ingresar numeros en este campo."),
    file: yup.mixed().required("Se necesita ingresar la imagen del producto para crearlo."),
})


function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    let defaultValues = {};
    const empresa = localStorage.getItem('empresa');

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("img", data.file[0].name);
        formData.append("cantidad", data.cantidad);
        formData.append("empresa_id", empresa);
        formData.append("file", data.file[0]);

        ProductsServices.editProduct(id, formData)
            .then(data => {
                if (data) {
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
    }, [id, reset])


    /*ARREGLAR IMAGEN SETEADA*/

    function onChangeImg(event) {
        setImg(event.target.value);
    }

    return (
        <div className='container'>
            <article className="grid login">
                <div>
                    <hgroup>
                        <h1>Edíta tu Producto</h1>
                        <h2>Edíta un producto en el panel de administración, <br></br>¿No querias editar el producto? Vuelve al <Link to="/admin"><u>Panel de control</u></Link>.</h2>
                    </hgroup>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor='name' className='left'>Producto</label>
                        <input type="text" name='id' value={id} readonly disabled></input>
                        <input type="text" id="first_name" placeholder="Agregar Nombre del producto" name="producto" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}/>
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
                            <input type="file" {...register("file")} required></input>
                        </label>
                        <button type='submit' className='marginado'>Editá Un Nuevo Producto</button>
                    </form>
                </div>
            </article>
        </div>
    )
}

export default EditProduct
