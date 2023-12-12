import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import * as ProductsServices from '../services/productos.services'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import {
  Link
} from "react-router-dom";
import Access from '../components/Access.jsx';
import * as UserServices from './../services/user.services.js'

function ProductDetail() {
  const user = localStorage.getItem('user');
  const [certificarAcceso, setCertificarAcceso] = useState(false);
  const navigate = useNavigate()
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [estadoModal, setEstadoModal] = useState(false);
  const [estadoModalActivado, setEstadoModalActivado] = useState(false);
  const [estadoModalDesactivado, setEstadoModalDesactivado] = useState(false);
  const storage = getStorage();
  const [imagen, setImagen] = useState(null)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, []);

  const handleClick = async () => {
    ProductsServices.deleteById(id)
      .then(data => {
        if (data) {
          navigate('/admin',{ state: {deleted: "¡El producto ha sido eliminado con éxito! Puedes observarlo en el panel de control." } })
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }

  const handleClick2 = async () => {
    ProductsServices.activateProduct(id)
      .then(data => {
        if (data) {
          navigate('/admin',{ state: {deleted: "¡El producto ha sido activado con éxito! Puedes observarlo en el panel de control." } })
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }

  
  const handleClick3 = async () => {
    ProductsServices.desactivateProduct(id)
      .then(data => {
        if (data) {
          navigate('/admin',{ state: {deleted: "¡El producto ha sido desactivado con éxito! Puedes observarlo en el panel de control." } })
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }

  function activaModal(){
    setEstadoModal(true)
  }

  function desactivaModal(){
    setEstadoModal(false)
  }

  function activaModalActivado(){
    setEstadoModalActivado(true)
  }

  function desactivaModalActivado(){
    setEstadoModalActivado(false)
  }

  function activaModalDesactivado(){
    setEstadoModalDesactivado(true)
  }

  function desactivaModalDesactivado(){
    setEstadoModalDesactivado(false)
  }

  useEffect(() => {
    validarAcceso(user);
    ProductsServices.findById(id)
      .then(data => {
        if (data) {
        getDownloadURL(ref(storage, 'imagenes/productos/' + data.img))
          .then((url) => {
            setImagen(url)
          })
          setProduct(data);
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }, [id,user])

  function validarAcceso(user) {
    UserServices.findById(user)
      .then(data => {
        if (data.verified == true) {
          setCertificarAcceso(true)
        } else {
          setCertificarAcceso(false)
        }
    })}

  return (
    <div className='main'>
    {estadoModal ? 
      <dialog open>
        <article>
          <h3>¿Seguro que querés eliminar este producto?</h3>
          <p>
            Al presionar confirmar, eliminarás permanente los datos de este producto.
          </p>
          <footer>
            <span onClick={desactivaModal} role="button" className="secondary">Cancelar</span>
            <span onClick={handleClick} role="button" className='rojo'>Confirmar</span>
          </footer>
        </article>
      </dialog> : ''}
      {estadoModalActivado ? 
      <dialog open>
        <article>
          <h3>¿Seguro que querés activar este producto?</h3>
          <p>
            Al presionar confirmar, vas a activar los datos de este producto.
          </p>
          <footer>
            <span onClick={desactivaModalActivado} role="button" className="secondary">Cancelar</span>
            <span onClick={handleClick2} role="button" className='color-especial'>Confirmar</span>
          </footer>
        </article>
      </dialog> : ''}
      {estadoModalDesactivado ? 
      <dialog open>
        <article>
          <h3>¿Seguro que querés desactivar este producto?</h3>
          <p>
            Al presionar confirmar, vas a desactivar los datos de este producto.
          </p>
          <footer>
            <span onClick={desactivaModalDesactivado} role="button" className="secondary">Cancelar</span>
            <span onClick={handleClick3} role="button" className='color-especial'>Confirmar</span>
          </footer>
        </article>
      </dialog> : ''}
      <div className='container'>
      {loading ? (<article className='centered'><Loading/></article>
           ) : certificarAcceso ? (
        <article className='centered pb-2'>
          <div>
            <hgroup>
              <h2>Detalles del producto</h2>
              <h3><div>Aqui tienes el detalle del producto</div>¿Quieres ver todos tus productos? <Link to='/admin'><u>Volver al Panel.</u></Link></h3>
            </hgroup>
            {(product && imagen) ?
              <div>
                <ul className='listanone'>
                  <li><strong>Nombre:</strong> {product.name}.</li>
                  <li><strong>Cantidad:</strong> {product.cantidad} Unidades.</li>
                  <li><strong>Descripción:</strong> {product.description}.</li>
                  <li><strong>Imagen:</strong></li>
                  <img className="imgPersonalizado" src={`${imagen}`} alt={`${product.name}`}></img>
                </ul>
                <div>
                  {
                    (product.estado == true) ? <span onClick={activaModalDesactivado} role="button" className='mr-3 contrast'>Ocultar producto</span>
                    :  <span onClick={activaModalActivado} role="button" className='mr-3 contrast'>Activar producto</span>
                  }
                  <Link to={`/productos/${product._id}`} role="button" className='mr-3 color-especial'>Editar producto</Link>
                  <span onClick={activaModal} role="button" className='rojo'>Eliminar producto</span>
                </div>
              </div>
              : <Loading />}
          </div>
        </article>):(
        <Access></Access>        
        )}
      </div>
    </div>
  )
}

export default ProductDetail
