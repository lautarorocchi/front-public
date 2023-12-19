import React, { useState, useEffect } from 'react'
import {
  Link, useNavigate, useLocation
} from "react-router-dom";
import * as UserServices from '../services/user.services.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object({
  email: yup.string().email("El email no es valido, revisa los datos.").required("Se necesita ingresar un Mail para ingresar al Panel de Control."),
  password: yup.string().min(6, "El password debe tener al menos 6 caracteres.").required("Se necesita ingresa su contraseña para ingresar al Panel de Control."),
}).required();

function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMensaje, setError] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const [visibility2, setVisibility2] = useState(false);
  const [alertMensaje, setAlert] = useState([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (location.state != null) {
      const { register, change } = location.state;

      if (register) {
        setAlert(register);
        setVisibility2(true);
      } else if (change) {
        setAlert(change);
        setVisibility2(true);
      }
    }
  }, [location.state]);

  function onSubmit(data) {
    UserServices.login(data.email, data.password)
      .then(({ user, token }) => {
        onLogin(user, token);
        navigate('/descubre', { state: { login: "¡Inicio de sesión aprobado! Bienvenido a Stack Ux." } });
      })
      .catch((error) => {
        setError(error.message);
        setVisibility(true);
      });
  }

  function handleClose() {
    setVisibility(false);
  }

  function handleClose2() {
    setVisibility2(false)
  }

  function togglePassword() {
    setPasswordShown(!passwordShown);
  };

  return (
    <div>
      <div className="container">
        <article className="centered">
          <div>
            {visibility ?
              <div className="alert">
                <span className="closebtn" onClick={handleClose}>&times;</span>
                <ul className='white listNone'>
                  <li>{errorMensaje}</li>
                </ul>
              </div> : ''
            }
            {visibility2 ?
              <div className="alertBuena">
                <span className="closebtn" onClick={handleClose2}>&times;</span>
                <ul className='white listNone'>
                  <li>{alertMensaje}</li>
                </ul>
              </div> : ''
            }
            <hgroup>
              <h2>Inicia sesión</h2>
              <p>¿No estás registrado? <Link to="/registro"><u>Creá una cuenta</u></Link></p>
            </hgroup>
            <hgroup>
            <p>¿Querés crear una empresa? <Link to="/empresa/crear"><u>Creá una empresa</u></Link></p>
            </hgroup>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className='left' htmlFor="email">Email</label>
              <input id='email' type="text" placeholder="Email" aria-label="email" className={errors.email?.message ? 'redBorder' : ''} {...register("email")}></input>
              {
                errors.email?.message ? <p className='errorYup'>{errors.email?.message}</p> : ''
              }
              <label className='left' htmlFor="password">Contraseña</label>
              <input id='password' type={passwordShown ? "text" : "password"} placeholder="Contraseña" aria-label="Password" className={errors.password?.message ? 'redBorder' : ''} {...register("password")}></input>
              <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} onClick={togglePassword} className="ojoPassword" />
              {
                errors.password?.message ? <p className='errorYup'>{errors.password?.message}</p> : ''
              }
              <fieldset>
                <p className="message">¿Olvidaste tu contraseña? <Link to="/recuperar"><u>Recuperar contraseña</u></Link></p>
              </fieldset>
              <button type="submit" className="contrast color-especial" role="button">Inicia sesión</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  )
}

export default Login
