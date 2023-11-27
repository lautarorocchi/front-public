import React, { useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";
import * as ProductServices from '../services/productos.services.js'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import {storage} from '../services/firebase.js'
import {ref, uploadBytes} from 'firebase/storage'
import {v4} from 'uuid'

const schema = yup.object({
  name: yup.string().required("Se necesita ingresar un nombre para crear una cuenta."),
  description: yup.string().min(10, "La descripción debe tener al menos 10 letras.").required("Se necesita ingresar una descripción para crear una cuenta."),
  cantidad: yup.number().required("Se necesita ingresar la cantidad del producto para crearlo.").typeError("Solo se pueden ingresar numeros en este campo.")
})

function Create() {
  const navigate = useNavigate()
  const empresa = localStorage.getItem('empresa');
  const [imageUpload, setImageUpload] = useState(null)

  const uploadFile = (imagen) => {
    if(imageUpload == null) return;
    const imageRef = ref(storage, `imagenes/productos/${imagen}`)
    uploadBytes(imageRef, imageUpload).then(() => {
    })
  };

  const { register, handleSubmit, watch, formState: { errors }} = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const imageLinker = imageUpload.name + v4();
    ProductServices.createProduct(data.name, data.description, imageLinker , data.cantidad, empresa)
        .then(data => {
          if (data) {
            uploadFile(imageLinker)
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
              <h2>Creá un nuevo producto</h2>
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
              <input type="file" accept='image/jpeg' onChange={(event) => setImageUpload(event.target.files[0])} required></input>
              </label>
              {
                errors.file?.message ?   <p className='errorYup'>{errors.file?.message}</p> : ''
              }
              <button type='submit' className='marginado'>Crear producto</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  )
}

export default Create
