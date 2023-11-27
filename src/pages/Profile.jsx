import React, { useEffect, useState } from 'react'
import {
  Link, useLocation
} from "react-router-dom";
import * as UserServices from './../services/user.services.js'
import * as EmpresaServices from './../services/empresas.services.js'
import { useNavigate } from 'react-router-dom'
import defaultProfile from '../assets/img/default-foto.jpg'
import Loading from '../components/Loading'



function Profile() {
  const id = localStorage.getItem('user');
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState(null);

  const location = useLocation();

  const [alertMensaje, setAlert] = useState([]);

  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    UserServices.findById(id)
      .then(data => {
        if (data) {
          setUsuario(data);
          if(data.empresa){
            EmpresaServices.findById(data.empresa)
            .then(data => {
                if (data) {
                  if(location.state == null){
                    setEmpresaNombre(data.name);
                  }else{
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

  function handleClose() {
    setVisibility(false);
  }


  return (
    <div>
      <div className="container">
        <article className="grid login">
          <div>
          <div>
              {visibility ?
                <div className="alertBuena">
                  <span className="closebtn" onClick={handleClose}>&times;</span>
                  <ul className='white listNone'>
                    <li>{alertMensaje}</li>
                  </ul>
                </div> : ''
              }
            </div>
            <hgroup>
              <h2>Mi perfil</h2>
              <h3><div>Esta es la información de tu perfil,</div>¿Quieres modificar algún dato? Podes hacerlo en <Link to="/perfil/editar"><u>Edíta tu perfil</u></Link>.</h3>
            </hgroup>
            {(usuario) ?
              <div className='grid'>
                <div>
                <h5>Mis datos de Perfil:</h5>
                <ul className='listanone'>
                  <li><strong>Nombre:</strong> {usuario.name} </li>
                  <li><strong>Apellido:</strong> {usuario.surname} </li>
                  <li><strong>Empresa Asociada:</strong> {empresaNombre}</li>
                  <li><strong>Email:</strong> {usuario.email}</li>
                </ul>
                </div>
                <div>

                </div>
                     
                <div>
                  <Link to={`/perfil/editar`} role="button" className='mr-3 color-especial'>Editar usuario</Link>
                </div>
              </div>
              : <Loading />}
          </div>
        </article>
      </div>
    </div>
  )
}

export default Profile
