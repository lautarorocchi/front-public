import React, { useState, useEffect } from 'react'
import * as ProductsServices from '../services/productos.services'
import { faCircleInfo, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Link, useLocation, useNavigate
} from "react-router-dom";

import * as UserServices from './../services/user.services.js'
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import accesoDenegado from '../assets/img/acceso-denegado.png'



function Admin() {

  const id = localStorage.getItem('user');

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const empresa = localStorage.getItem('empresa');

  const [query, setQuery] = useState("");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [postsPerPage] = useState(8);

  const location = useLocation();

  const [alertMensaje, setAlert] = useState([]);

  const [visibility, setVisibility] = useState(false);

  const [certificarAcceso, setCertificarAcceso] = useState(false);


  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [products]);

  useEffect(() => {
    validarAcceso(id);
    ProductsServices.find(empresa, token)
      .then(data => {
        if (location.state == null) {
          setProducts(data);
        } else {
          const { login } = location.state;
          const { created } = location.state;
          const { edited } = location.state;
          const { deleted } = location.state;
          setProducts(data);
          if (login != null) {
            setAlert(login);
            setVisibility(true);
          }
          if (created != null) {
            setAlert(created);
            setVisibility(true);
          }
          if (edited != null) {
            setAlert(edited);
            setVisibility(true);
          }
          if (deleted != null) {
            setAlert(deleted);
            setVisibility(true);
          }
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }, [id, token]);

  function onChangeQuery(event) {
    setQuery(event.target.value);
  }

  const totalPages = Math.ceil(products.length / postsPerPage);
  const indexOfLastPage = currentPage * postsPerPage;
  const indexOfFirstPage = indexOfLastPage - postsPerPage;

  const currentPosts = products.slice(indexOfFirstPage, indexOfLastPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPrevious = () => {
    setCurrentPage(currentPage - 1)
  }

  const getNext = () => {
    setCurrentPage(currentPage + 1)
  }


  function handleClose() {
    setVisibility(false);
  }

  function validarAcceso(id){
    UserServices.findById(id)
    .then(data =>{
      if(data.verified == true){
        setCertificarAcceso(true)
      }else{
        setCertificarAcceso(false)
      }
    })
}

  return (
    <div className='container'>
      {(certificarAcceso) ?
      <article className="centered">
        <hgroup>
          <h2>Administra los productos de tu empresa</h2>
          <p>Acá podés visualizar los productos que se encuentran activos en tu empresa.</p>
        </hgroup>
        {products.length > 0 ?
          <article className='mt-1 mb-1'>
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
            <div>
              <h3>Panel de control</h3>
              <div className='grid'>
                <Link to="/archivo">Ver productos archivados</Link>
                <input type="search" placeholder="Buscar productos" onChange={onChangeQuery}></input>
              </div>
            </div>
            <figure>
              {loading ? <Loading /> :
                <table role="grid">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Visibilidad</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosts.filter(product => product.name.toLowerCase().includes(query.toLowerCase())).map((product, index) => (
                      (product.estado === false) ? "" :
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>{product.cantidad}</td>
                          <td><Link to={`/producto/${product._id}`}>Ocultar</Link></td>
                          <td>
                            <Link to={`/producto/${product._id}`} className='mr-2'><FontAwesomeIcon icon={faCircleInfo} /></Link>
                            <Link to={`/productos/${product._id}`} className='mr-2'><FontAwesomeIcon icon={faEdit} /></Link>
                            <Link to={`/producto/${product._id}`} className='mr-2'><FontAwesomeIcon icon={faTrash} /></Link>
                          </td>
                        </tr>))}
                  </tbody>
                </table>}
              <a role="button" href='#' disabled={currentPage === 1 ? true : false} onClick={getPrevious} className="anterior finest">Anterior</a>
              <Pagination postsPerPage={postsPerPage} totalPosts={products.length} paginate={paginate}></Pagination>
              <a role="button" href='#' disabled={currentPage === totalPages ? true : false} onClick={getNext} className="finest">Siguiente</a>
              <Link to="/producto/crear"><button className='botonCrear color-especial'>Crear producto</button>
              </Link>
            </figure>
          </article>
          : <article className='mt-1 mb-1'>
            <div className='grid'>
              <hgroup>
                <h2>Panel de control</h2>
                <Link to="/archivo">Ver productos archivados</Link>
                <h3>No hay productos agregados en el Panel de Control</h3>
              </hgroup>
            </div>
            <Link to={`/producto/crear`} role="button" className='color-especial'>Crear producto</Link>
          </article>
        }
      </article> :
      <article className='centered'>
      <hgroup>
        <h2>No tenes permiso para entrar al panel de control</h2>
        <p>Necesitas solicitar acceso al adminsitrador de la empresa para poder adminsitrar los productos.</p>
      </hgroup>
      <img className="centerImg" src={accesoDenegado} alt="Acceso denegado"></img>
      <Link to={`/perfil/verificar`} class="column"><button className='color-especial'>Solicitar acceso</button></Link>
      </article>
      }
    </div>
  )
}

export default Admin
