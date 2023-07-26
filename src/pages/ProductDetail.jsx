import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import * as ProductsServices from '../services/productos.services'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'

import {
  Link
} from "react-router-dom";

function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [estadoModal, setEstadoModal] = useState(false);

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

  function activaModal(){
    setEstadoModal(true)
  }

  function desactivaModal(){
    setEstadoModal(false)
  }

  useEffect(() => {
    ProductsServices.findById(id)
      .then(data => {
        if (data) {
          setProduct(data);
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }, [id])
  return (
    <div className='main'>
    {estadoModal ? 
      <dialog open>
        <article>
          <h3>¿Seguro que quieres eliminar este producto?</h3>
          <p>
            Al presionar eliminar, eliminarás permanente los datos de este producto, si deseas hacerlo presiona Confirmar.
          </p>
          <footer>
            <span onClick={desactivaModal} role="button" className="secondary">Cancelar</span>
            <span onClick={handleClick} role="button" className='rojo'>Confirmar</span>
          </footer>
        </article>
      </dialog> : ''}
      <div className='container'>
        <article className='grid login pb-2'>
          <div>
            <hgroup>
              <h1>Detalles del producto</h1>
              <h2>Aqui tienes el detalle del producto <br></br> ¿Quieres ver todos tus productos? <Link to='/admin'><u>Volver al Panel.</u></Link></h2>
            </hgroup>
            {(product) ?
              <div>
                <ul>
                  <li><strong>Nombre:</strong> {product.name}.</li>
                  <li><strong>Descripción:</strong> {product.description}.</li>
                  <li><strong>Imagen:</strong> {product.img}.</li>
                  <li><strong>Cantidad:</strong> {product.cantidad}.</li>
                </ul>
                <div>
                  <Link to={`/productos/${product._id}`} role="button" className='mr-3'>Editar Producto</Link>
                  <span onClick={activaModal} role="button" className='rojo'>Eliminar Producto</span>
                </div>
              </div>
              : <Loading />}
          </div>
        </article>
      </div>
    </div>
  )
}

export default ProductDetail
