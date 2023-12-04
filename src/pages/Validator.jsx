import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as UserServices from '../services/user.services.js'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading.jsx';

function Validator() {
  const { id } = useParams();
  const [estadoModal, setEstadoModal] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [visibilidad, setVisibilidad] = useState(false);
  const [visibilidad2, setVisibilidad2] = useState(false);
  const [alertMensaje, setAlertMensaje] = useState(false);

  useEffect(() => {
    UserServices.findById(id)
      .then(data => {
        if (data) {
          setUsuario(data);
          verificarEnlace();
        } else {
          navigate('/404');
        }
      });
  }, [id]);

  const verificarEnlace = async () => {
    try {
      const id = window.location.pathname.split('/').pop();
      const url = `https://front-public.vercel.app/verificar/${id}`;
      const response = await axios.get(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAllowAccess = async () => {
    try {
      await UserServices.validarUsuario(id);
      setEstadoModal(false);
      setAlertMensaje("¡Se ha confirmado el acceso del usuario con éxito!");
      setVisibilidad(true);
    } catch (error) {
      setEstadoModal(false);
      setAlertMensaje('Error al validar el acceso del usuario.', error.message);
      setVisibilidad2(true);
    }
  };

  function activaModal(){
    setEstadoModal(true)
  }

  function desactivaModal(){
    setEstadoModal(false)
  }

  function handleClose(){
    setVisibilidad(false);
  }

  function handleClose2(){
    setVisibilidad2(false);
  }
  
  return (
    <div className='container'>
    {estadoModal ? 
      <dialog open>
        <article>
          <h3>¿Seguro que quieres activar a este usuario?</h3>
          <p>
            Al presionar confirmar, activarás el acceso de este usuario en tu empresa, si deseas hacerlo presiona Confirmar.
          </p>
          <footer>
            <span onClick={desactivaModal} role="button" className="secondary">Cancelar</span>
            <span onClick={handleAllowAccess} role="button" className='color-especial'>Confirmar</span>
          </footer>
        </article>
      </dialog> : ''}
    <article className='centered'>
      <div>
          {visibilidad ?
                <div className="alertBuena">
                  <span className="closebtn" onClick={handleClose}>&times;</span>
                  <ul className='white listNone'>
                    <li>{alertMensaje}</li>
                  </ul>
                </div> : ''
          }
          { visibilidad2 ?
              <div className="alert">
                 <span className="closebtn" onClick={handleClose2}>&times;</span>
                 <ul className='white listNone'>
                  <li>{alertMensaje}</li>
                 </ul>
              </div> : ''
            }
      </div>
      <hgroup>
      <h2>Permitir el acceso a tu empresa al siguiente usuario</h2>
      <p><span className='span'>¿Querés ingresar a tu cuenta? <Link to="/login"><u>Inicia sesión</u></Link>.</span> ¿Ya estás logueado? <Link to="/admin"><u>Ir al panel de control</u></Link>.</p>
      </hgroup>
      {(usuario) ?
              <div className='grid'>
                <div>
                <h5>Datos del perfil que solicito acceso:</h5>
                <ul className='listanone'>
                  <li>Nombre: {usuario.name} </li>
                  <li>Apellido: {usuario.surname} </li>
                  <li>Email: {usuario.email}</li>
                </ul>
                </div>
              </div>
              : <Loading />}
      <button onClick={activaModal} className='color-especial'>Confirmar Acceso</button>
      </article>
    </div>
  )
}

export default Validator


