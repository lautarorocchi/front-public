import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import * as ProductsServices from '../services/productos.services'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import {
  Link
} from "react-router-dom";

function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [estadoModal, setEstadoModal] = useState(false);
  const storage = getStorage();
  const [imagen, setImagen] = useState(null)

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
                  <Link to={`/productos/${product._id}`} role="button" className='mr-3 color-especial1'>Editar producto</Link>
                  <span onClick={activaModal} role="button" className='rojo'>Eliminar producto</span>
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
