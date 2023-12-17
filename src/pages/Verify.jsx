import React, { useEffect, useState } from 'react'
import {
  Link, useLocation
} from "react-router-dom";
import * as userServices from '../services/user.services.js'
import * as EmpresaServices from '../services/empresas.services.js'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object({
  name: yup.string().required("Se necesita ingresar un nombre para crear una cuenta."),
  surname: yup.string().required("Se necesita ingresar un apellido para crear una cuenta."),
  email: yup.string().email("El mail no es valido, revisa los datos.").required("Se necesita ingresar un mail para ingresar al Panel de Control."),
}).required();


function Verify() {
  const id = localStorage.getItem('user');
  const empresa = localStorage.getItem('empresa');
  const [usuario, setUsuario] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState(null);

  const location = useLocation();

  const [alertMensaje, setAlert] = useState([]);

  const navigate = useNavigate()
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMensaje, setError] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  let defaultValues =  {};

  /*let defaultValues = {};*/

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  /*Funcion creacion del usuario*/

  function submitVerify(data) {
    userServices.crearVerificar(empresa, id, data.name, data.surname, data.email)
      .then(data => {
        if (data) {
          navigate('/perfil', { state: { change: "Se ha enviado la verificación al administrador de la empresa." } })
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
    userServices.findById(id)
      .then(data => {
        if (data) {
          setUsuario(data);
          defaultValues.name = data.name;
          defaultValues.surname = data.surname;
          defaultValues.email = data.email;
          reset({ ...defaultValues });
          if (data.empresa) {
            EmpresaServices.findById(data.empresa)
              .then(data => {
                if (data) {
                  if (location.state == null) {
                    setEmpresaNombre(data.name);
                  } else {
                    const { edited } = location.state;
                    setEmpresaNombre(data.name);
                    if (edited != null) {
                      setAlert(edited);
                      setVisibility(true);
                    }
                  }
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
  }, [id])

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
              <h2>Solicitar acceso al panel de control</h2>
              <h3><div>Solicita acceso al administrador de <strong>{empresaNombre}</strong>  para ver el panel de control</div><div>¿No quéres solicitar acceso? <Link to="/perfil"><u>Ver tu perfíl</u></Link>.</div><div>¿Quéres editar tus datos? <Link to="/perfil/editar"><u>Editar perfíl</u></Link></div></h3>
            </hgroup>
            {usuario ? 
            <form onSubmit={handleSubmit(submitVerify)}>
            <label htmlFor='name' className='left'>Nombre</label>
            <input type="text" placeholder="Nombre" aria-label="nombre" className={errors.name?.message ? 'redBorder' : ''} value={usuario.name ? usuario.name : ""} {...register("name")}  disabled></input>
            {
              errors.name?.message ? <p className='errorYup'>{errors.name?.message}</p> : ''
            }
            <label htmlFor='surname' className='left'>Apellido</label>
            <input type="text" placeholder="Apellido" aria-label="apellido" className={errors.surname?.message ? 'redBorder' : ''}  value={usuario.surname ? usuario.surname : ""} {...register("surname")}  disabled></input>
            {
              errors.surname?.message ? <p className='errorYup'>{errors.surname?.message}</p> : ''
            }
            {
              errors.empresa?.message ? <p className='errorYup'>{errors.empresa?.message}</p> : ''
            }
            <label htmlFor='email' className='left'>Email</label>
            <input type="text" placeholder="Email" aria-label="Login" className={errors.email?.message ? 'redBorder' : ''}  value={usuario.email ? usuario.email : ""}  {...register("email")} disabled></input>
            {
              errors.email?.message ? <p className='errorYup'>{errors.email?.message}</p> : ''
            }
            <button type="submit" className="contrast">Enviar solicitud</button>
          </form>: ""}
          </div>
        </article>
      </div>
    </div>
  )
}

export default Verify
