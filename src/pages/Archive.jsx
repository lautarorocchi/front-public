import React, { useState, useEffect } from 'react'
import * as ProductsServices from '../services/productos.services'
import { faCircleInfo, faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Link, useLocation, useNavigate
} from "react-router-dom";

import Loading from '../components/Loading';
import Pagination from '../components/Pagination';


function Archive() {

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

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [products]);

    useEffect(() => {
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
    }, [token]);

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


    return (
        <div>
            <div>
                <section className="tables">
                    <h2 className='centrado mb-1'>Administra los productos archivados de tu empresa</h2>
                    <p className='mt-1'>Acá podés visualizar los productos que se encuentran archivados en tu empresa:</p>
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
                                <h3>Productos archivados</h3>
                                <div className='grid'>
                                    <Link to="/admin">Ver panel de control</Link>
                                    <input type="search" placeholder="Buscar Productos" onChange={onChangeQuery}></input>
                                </div>
                            </div>
                            <figure>
                                {loading ? <Loading /> :
                                    <table role="grid">
                                        <thead>
                                            <tr>
                                                <th scope="col">Producto</th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col">Visibilidad</th>
                                                <th scope="col">Cantidad</th>
                                                <th scope="col">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentPosts.filter(product => product.name.toLowerCase().includes(query.toLowerCase())).map((product, index) => (
                                                (product.estado === true) ? <article className='mt-1 mb-1'>
                                                    <div className='grid'>
                                                        <hgroup>
                                                            <h2>Panel de Control</h2>
                                                            <h3>No hay productos agregados en el Panel de Control</h3>
                                                        </hgroup>
                                                    </div>
                                                    <Link to={`/producto/crear`} role="button">Crea un Nuevo Producto</Link>
                                                </article> :
                                                    <tr key={index}>
                                                        <td>{product.name}</td>
                                                        <td>{product.description}</td>
                                                        <td> <Link to={`/producto/${product._id}`}>Activar producto</Link></td>
                                                        <td>{product.cantidad}</td>
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
                            </figure>
                            <Link to="/producto/crear"><button className='botonCrear'>Agregar Producto</button>
                            </Link>
                        </article>
                        : <article className='mt-1 mb-1'>
                            <div className='grid'>
                                <hgroup>
                                    <h2>Panel de Control</h2>
                                    <h3>No hay productos agregados en el Panel de Control</h3>
                                </hgroup>
                            </div>
                            <Link to={`/producto/crear`} role="button">Crea un Nuevo Producto</Link>
                        </article>
                    }
                </section>
            </div>
        </div>
    )
}

export default Archive