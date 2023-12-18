import React, { useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";
import * as userServices from '../services/user.services.js'
import * as EmpresaServices from '../services/empresas.services.js'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

/* Validacion Yup Registro */

const schema = yup.object({
  name: yup.string().required("Se necesita ingresar un nombre para crear una cuenta."),
  surname: yup.string().required("Se necesita ingresar un apellido para crear una cuenta."),
  empresa: yup.string().required("Se necesita ingresar una empresa para crear una cuenta."),
  email: yup.string().email("El mail no es valido, revisa los datos.").required("Se necesita ingresar un Mail para ingresar al Panel de Control."),
  password: yup.string().min(6, "El Password debe tener al menos 6 caracteres.").required("Se necesita ingresa su contraseña para ingresar al Panel de Control."),
}).required();


/*PONER EMPRESAS , Y SI NO ENVIAR A UN LINK PARA AGREGAR EMPRESA*/

function Register() {
  const navigate = useNavigate()
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMensaje, setError] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  /*let defaultValues = {};*/

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  /*Funcion creacion del usuario*/

  function submitUsuario(data) {
    userServices.createUser(data.name, data.surname, data.empresa, data.email, data.password)
      .then(data => {
        if (data) {
          navigate('/login', { state: {register: "¡Se ha registrado tu usuario con éxito! Ya podés iniciar sesión." } });
        }
        else {
          navigate('/404')
        }
      })
      .catch((error) => {
        setError(error.message);
        setVisibility(true);
      });
  }

  useEffect(() => {
    EmpresaServices.find()
      .then(data => {
        if (data) {
          setEmpresas(data)
          /*console.log(data)*/
          /*reset({ ...defaultValues });*/
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }, [])

  function togglePassword() {
    setPasswordShown(!passwordShown);
  };

  function handleClose() {
    setVisibility(false);
  }

  return (
    <div>
      <div className="container">
        <article className="centered">
          <div>
            {visibility ?
              <div className="alertAmarillo">
                <span className="closebtnAmarillo" onClick={handleClose}>&times;</span>
                {errorMensaje}
              </div> : ''
            }
            <hgroup>
              <h2>Regístrate</h2>
              <p><span className='span'>¿Estás registrado? <Link to="/login"><u>Inicia sesión</u></Link>.</span> ¿No encontrás tu empresa en la lista? <Link to="/empresa/crear"><u>Registrá una empresa</u></Link>.</p>
            </hgroup>
            <form onSubmit={handleSubmit(submitUsuario)}>
              <label htmlFor='nombre' className='left'>Nombre</label>
              <input id='nombre' type="text" name="nombre" placeholder="Nombre" aria-label="nombre" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}></input>
              {
                errors.name?.message ? <p className='errorYup'>{errors.name?.message}</p> : ''
              }
              <label htmlFor='surname' className='left'>Apellido</label>
              <input id='surname' type="text" name="apellido" placeholder="Apellido" aria-label="apellido" className={errors.surname?.message ? 'redBorder' : ''} {...register("surname")}></input>
              {
                errors.surname?.message ? <p className='errorYup'>{errors.surname?.message}</p> : ''
              }
              <label htmlFor='empresa' className='left'>Empresa Asociada</label>
              <select {...register("empresa")}>
                <option id='empresa' value="" disabled selected>Elegí una empresa</option>
                {
                  empresas.map(empresa =>
                    <option id='empresa' key={empresa._id} value={empresa._id}>{empresa.name}</option>
                  )
                }
              </select>
              {
                errors.empresa?.message ? <p className='errorYup'>{errors.empresa?.message}</p> : ''
              }
              <label htmlFor='email' className='left'>Email</label>
              <input id='email' type="text" name="email" placeholder="Email" aria-label="Login" className={errors.email?.message ? 'redBorder' : ''}  {...register("email")}></input>
              {
                errors.email?.message ? <p className='errorYup'>{errors.email?.message}</p> : ''
              }
              <label htmlFor='password' className='left'>Contraseña</label>
              <input id='password' type={passwordShown ? "text" : "password"} name="password" placeholder="Contraseña" aria-label="Password" className={errors.password?.message ? 'redBorder' : ''} {...register("password")}></input>
              <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} onClick={togglePassword} className="ojoPassword" />
              {
                errors.password?.message ? <p className='errorYup'>{errors.password?.message}</p> : ''
              }
              <button type="submit" className="contrast">Registrarte</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  )
}

export default Register
