import React, { useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";
import * as UserServices from './../services/user.services.js'
import * as EmpresaServices from './../services/empresas.services.js'
import { useNavigate } from 'react-router-dom'
import defaultProfile from '../assets/img/default-foto.jpg'
import Loading from '../components/Loading'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object({
  name: yup.string().required("Se necesita ingresar un nombre para crear una cuenta."),
  surname: yup.string().required("Se necesita ingresar un apellido para crear una cuenta."),
  email: yup.string().email("El mail no es valido, revisa los datos.").required("Se necesita ingresar un Mail para ingresar al Panel de Control."),
}).required();


function EditProfile() {
  const id = localStorage.getItem('user');
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState(null);
  let defaultValues = {};

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  function submitUsuario(data) {
    UserServices.editar(id, data.name, data.surname, data.email)
      .then(data => {
        if (data) {
          navigate('/perfil', { state: {edited: "¡El usuario ha sido editado! Puedes ver el cambio aquí." } })
        }
        else {
          navigate('/404')
        }
      })
      .catch((error) => {
        alert(error)
      });
  }


  useEffect(() => {
    UserServices.findById(id)
      .then(data => {
        if (data) {
          setUsuario(data);
          if(data.empresa){
            defaultValues.name = data.name;
            defaultValues.surname = data.surname;
            defaultValues.email = data.email;
            reset({ ...defaultValues });
            EmpresaServices.findById(data.empresa)
            .then(data => {
                if (data) {
                  defaultValues.empresa = data.name;
                  reset({ ...defaultValues });
                }
                else {
                    navigate('/404')
                }
            })
          }
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }, [id,reset])


  return (
    <div className='container'>
      <article className="grid login">
        <div>
          <hgroup>
            <h2>Edita tu perfil</h2>
            <h3><div>Acá podes editar tu perfil,</div> ¿Quieres ver los datos de tu perfil? <Link to="/perfil"><u>Mi perfil</u></Link>.</h3>
          </hgroup>
          <form onSubmit={handleSubmit(submitUsuario)}>
              <label htmlFor='nombre' className='left'>Nombre</label>
              <input type="text" name="name" placeholder="Nombre" aria-label="nombre" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}></input>
              {
                errors.name?.message ? <p className='errorYup'>{errors.name?.message}</p> : ''
              }
              <label htmlFor='surname' className='left'>Apellido</label>
              <input type="text" name="surname" placeholder="Apellido" aria-label="apellido" className={errors.surname?.message ? 'redBorder' : ''} {...register("surname")}></input>
              {
                errors.surname?.message ? <p className='errorYup'>{errors.surname?.message}</p> : ''
              }
              {
                errors.empresa?.message ? <p className='errorYup'>{errors.empresa?.message}</p> : ''
              }
              <label htmlFor='email' className='left'>Email</label>
              <input type="text" name="email" placeholder="Email" aria-label="Login" className={errors.email?.message ? 'redBorder' : ''}  {...register("email")}></input>
              {
                errors.email?.message ? <p className='errorYup'>{errors.email?.message}</p> : ''
              }
              <button type="submit" className="contrast">Editar Mi Perfil</button>
            </form>
        </div>
      </article>
    </div>
  )
}

export default EditProfile
