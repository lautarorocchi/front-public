import React from 'react'

function Recover() {
  return (
    <div>
      <div className='container'>
        <article className='centered'>
        <hgroup>
            <h2>Recuperar contraseña</h2>
            <p className="message">Ingresá el mail de tu cuenta para reestablecer la contraseña.</p>
        </hgroup>
        <form>
              <label className='left'>Email</label>
              <input type="text" placeholder="Email" aria-label="email"></input>
              <button type="submit" className="contrast color-especial" role="button">Siguiente</button>
        </form>
        </article>
      </div>
    </div>
  )
}

export default Recover
