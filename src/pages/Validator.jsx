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
      console.log('Acceso permitido enviado con éxito');
    } catch (error) {
      console.error('Error al enviar acceso permitido:', error.message);
    }
  };

  function activaModal(){
    setEstadoModal(true)
  }

  function desactivaModal(){
    setEstadoModal(false)
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
      <h2>Permitir el acceso a tu empresa al siguiente usuario</h2>
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


