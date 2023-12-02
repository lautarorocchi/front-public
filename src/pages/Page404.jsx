import React from 'react'
import {
    Link
  } from "react-router-dom";
import imgError from '../assets/img/404-1.jpg'

function Page404() {
  return (
    <div className='main'>
      <div className='container'>
        <article className='centered pb-2'>
          <div>
            <hgroup>
            <h2>Error 404</h2>
            <h3>Ups! Ocurrio un Error 404, la Url solicitada es erronéa o ha ocurrido un error al refrescar la pagina.</h3>
            </hgroup>

              <div>
                <img src={imgError} alt="Imagen de Error 404"></img>
                <div>
                  <Link to={`/`} role="button" className='mr-3'>Volver al inicio</Link>
                  <Link to={`/admin`} role="button" className='mr-3 green'>Volver al Panel de Contol</Link>
                </div>
              </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default Page404
