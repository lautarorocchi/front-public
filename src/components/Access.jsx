import React from 'react'
import accesoDenegado from '../assets/img/acceso-denegado.png'
import {
    Link
  } from "react-router-dom";

function Access() {
  return (
    <div>
    <article className='centered'>
      <hgroup>
        <h2>No tenés permiso para entrar al panel de control</h2>
        <p>Necesitas solicitar acceso al adminsitrador de la empresa para poder adminsitrar los productos.</p>
      </hgroup>
      <img className="centerImg" src={accesoDenegado} alt="Acceso denegado"></img>
      <Link to={`/perfil/verificar`} class="column"><button className='color-especial'>Solicitar acceso</button></Link>
      </article>
    </div>
  )
}

export default Access
