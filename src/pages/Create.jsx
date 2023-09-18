import React, { useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";
import * as ProductServices from '../services/productos.services.js'
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

function Create() {
  const navigate = useNavigate()
  const empresa = localStorage.getItem('empresa');

  const { register, handleSubmit, watch, formState: { errors }} = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
        /*const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("img", data.file[0].name);
        formData.append("cantidad", data.cantidad);
        formData.append("empresa_id", empresa);
        formData.append("file", data.file[0]);*/

        ProductServices.createProduct(data.name, data.description, data.file[0].name, data.cantidad, empresa)
        .then(data => {
          if (data) {
            navigate('/admin', { state: {created: "¡El producto ha sido creado! Puedes observarlo en el panel de control." } })
          }
          else {
            navigate('/404')
          }
        })
        .catch((error) => {
          alert('El producto no se pudo crear');
        });
  
    };


  return (
    <div>
      <div className="container">
        <article className="grid login">
          <div>
            <hgroup>
              <h2>Creá un Nuevo Producto</h2>
              <h3><div>Registra un nuevo producto en el panel de administración,</div> <br></br>¿No querias crear un nuevo producto? Vuelve al <Link to="/admin"><u>Panel de control</u></Link>.</h3>
            </hgroup>
            <form onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data">
              <label htmlFor='name' className='left'>Producto</label>
              <input type="text" placeholder="Agregar Nombre del producto" name="name" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}/>
              {
                errors.name?.message ?  <p className='errorYup'>{errors.name?.message}</p> : ''
              }
              <label htmlFor='description' className='left'>Descripción</label>
              <textarea type="text" id="description" placeholder="Agregar Descripción" name="description" className={errors.description?.message ? 'redBorder' : ''} {...register("description")}/>
              {
                errors.description?.message ?  <p className='errorYup'>{errors.description?.message}</p> : ''
              }
              <label htmlFor='cantidad' className='left'>Cantidad</label>
              <input type="number" id="cantidad" placeholder="Agregar Cantidad" name="cantidad" className={errors.cantidad?.message ? 'redBorder' : ''} {...register("cantidad")}/>
              {
                errors.cantidad?.message ?  <p className='errorYup'>{errors.cantidad?.message}</p> : ''
              }
              <label htmlFor="file">Imagen
              <input type="file" accept='image/jpeg' {...register("file")} required></input>
              </label>
              {
                errors.file?.message ?   <p className='errorYup'>{errors.file?.message}</p> : ''
              }
              <button type='submit' className='marginado'>Creá Un Nuevo Producto</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  )
}

export default Create
