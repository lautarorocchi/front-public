import React from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import * as UserServices from '../services/user.services.js'
import { useParams } from 'react-router-dom';

function Validator() {
  const { id } = useParams();

  useEffect(() => {
    const verificarEnlace = async () => {
      try {
        const id = window.location.pathname.split('/').pop();
        const url = `https://front-public.vercel.app/verificar/${id}`;
        const response = await axios.get(url);
      } catch (error) {
        console.error(error);
      }
    };
    verificarEnlace();
  }, []);

  const handleAllowAccess = async () => {
    try {
      await UserServices.validarUsuario(id);
      console.log('Acceso permitido enviado con éxito');
    } catch (error) {
      console.error('Error al enviar acceso permitido:', error.message);
    }
  };

  
  return (
    <div className='container'>
      <article className='centered'>
      <h2>Permitir el acceso a tu empresa</h2>
      <button onClick={handleAllowAccess} className='color-especial'>Permitir Acceso</button>
      </article>
    </div>
  )
}

export default Validator


