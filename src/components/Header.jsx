import React, { useEffect, useState } from 'react'
import {
    Link,
    useNavigate
} from "react-router-dom";
import * as UserServices from '../services/user.services.js'
import Logo from '../assets/img/logo.png'


function Header() {

  const navigate = useNavigate()
  const [esAutenticado, setAutenticado] = useState(false);
  const token = localStorage.getItem('token');


  function handleLogout() {
      UserServices.logout()
      .then(() => {
          localStorage.clear('token')
          navigate('/login')
      })
  }

  useEffect(() => {

      if (token) {
          setAutenticado(true);
      }
  }, []);

  useEffect(() => {
      if (token) {
          setAutenticado(true)
      } else {
          setAutenticado(false)
      }
  }, [token]);


  return (
    <div className="hero" data-theme="dark">
    <header>
      <nav className="container-fluid">
        <ul className='ulCenter'>
        <Link to="/" className="contrast ml-2"><strong className='stronger'>STACK UX</strong></Link>
        <Link to="/" className='logo'><img src={Logo} alt="Logo de Stack Ux"/><h1 className='logo-main'>Stack Ux</h1></Link>
        </ul>
        <ul>
          <li className='inicio'>
            <Link to="/">Inicio</Link>
          </li>
          {(esAutenticado) ? 
          <li className='inicio'>
             <Link to="/descubre">Descubre</Link>
          </li> : ""}
          {(esAutenticado) ? 
          <li>
             <details role="list" dir="rtl">
              
              <summary aria-haspopup="listbox" role="link" className="contrast">Productos</summary>
              <ul role="listbox">
                <li><Link to="/admin">Administrar productos</Link></li>
                <li><Link to="/producto/crear">Crear producto</Link></li>
              </ul>
            </details>
          </li> : ""}
          <li>
            {(esAutenticado) ?
              <details role="list" dir="rtl">
              
              <summary aria-haspopup="listbox" role="link" className="contrast">Mi perfil</summary>
              <ul role="listbox">
                <li><Link to="/perfil">Ver perfil</Link></li>
                <li><a onClick={handleLogout}>Cerrar sesión</a></li>
              </ul>
            </details> :
            <details role="list" dir="rtl">
              
              <summary aria-haspopup="listbox" role="link" className="contrast">Inicia sesión</summary>
              <ul role="listbox">
                <li><Link to="/registro">Crear cuenta</Link></li>
                <li><Link to="/login">Ingresá</Link></li>
              </ul>
            </details>
            }
          </li>
        </ul>
      </nav>

    </header>
    </div>
  )
}

export default Header
