import React, { useState } from 'react'
import {
  Link, useNavigate, useLocation
} from "react-router-dom";
import * as UserServices from '../services/user.services.js'
import {useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object({
  email: yup.string().email("El Mail no es valido, revisa los datos.").required("Se necesita ingresar un Mail para ingresar al Panel de Control."),
  password:  yup.string().min(6, "El Password debe tener al menos 6 caracteres.").required("Se necesita ingresa su contraseña para ingresar al Panel de Control."),
}).required();

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMensaje, setError] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  function onSubmit(data) {
    UserServices.login(data.email, data.password)
      .then(({ user, token }) => {
        onLogin(user, token);
        navigate('/admin', { state: {login: "¡Inicio de sesión aprobado! Bienvenido a Stack Ux." } });
      })
      .catch((error) => {
        setError(error.message);
        setVisibility(true);
      });
  }

  function handleClose(){
    setVisibility(false);
  }

  function togglePassword(){
    setPasswordShown(!passwordShown);
  };

  return (
    <div>
      <div className="container">
        <article className="grid login">
          <div>
            { visibility ?
              <div className="alert">
                 <span className="closebtn" onClick={handleClose}>&times;</span>
                 <ul className='white listNone'>
                  <li>{errorMensaje}</li>
                 </ul>
              </div> : ''
            }
            <hgroup>
              <h2>Inicia Sesión</h2>
              <h3>Ingresa tu usuario para ingresar al panel de control.</h3>
            </hgroup>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor='email' className='left'>Email</label>
              <input type="text" placeholder="Email:" aria-label="email" className={errors.email?.message ? 'redBorder' : ''} {...register("email")}></input>
              {
                errors.email?.message ?  <p className='errorYup'>{errors.email?.message}</p> : ''
              }
              <label htmlFor='password' className='left'>Contraseña</label>
              <input type={passwordShown ? "text" : "password"} placeholder="Contraseña:" aria-label="Password" className={errors.password?.message ? 'redBorder' : ''} {...register("password")}></input>
              <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} onClick={togglePassword} className="ojoPassword"/>
              {
                errors.password?.message ?  <p className='errorYup'>{errors.password?.message}</p> : ''
              }
              <fieldset>
                {/*<label for="remember">
                  <input type="checkbox" role="switch" id="remember" name="remember"></input>
                  No cerrar la sesión
                </label>*/}
                <p className="message">¿No estás registrado? <Link to="/registro"><u>Creá una cuenta</u></Link></p>
              </fieldset>
              <button type="submit" className="contrast" role="button">Inicia Sesión</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  )
}

export default Login
