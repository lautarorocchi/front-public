import React, { useEffect, useState } from 'react'
import {
    Link, useLocation
} from "react-router-dom";
import * as userServices from '../services/user.services.js'
import * as EmpresaServices from '../services/empresas.services.js'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

/* Validacion Yup Registro */

const schema = yup.object({
    name: yup.string().required("Se necesita ingresar un nombre para crear una cuenta."),
    surname: yup.string().required("Se necesita ingresar un apellido para crear una cuenta."),
    password: yup.string().min(6, "El Password debe tener al menos 6 caracteres.").required("Se necesita ingresa su contraseña para ingresar al Panel de Control."),
}).required();


/*PONER EMPRESAS , Y SI NO ENVIAR A UN LINK PARA AGREGAR EMPRESA*/

function createAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const empresa = localStorage.getItem('empresa');
    const email = localStorage.getItem('email');
    const [passwordShown, setPasswordShown] = useState(false);
    const [alertMensaje, setAlertMensaje] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [errorMensaje, setError] = useState([]);
    const [visibility2, setVisibility2] = useState(false);

    /*let defaultValues = {};*/

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (location.state != null) {
            const { admin } = location.state;
            setAlertMensaje(admin);
            setVisibility(true);
        }
    }, [location.state]);


    /*Funcion creacion del usuario*/

    function submitUsuario(data) {
        userServices.createUserAdmin(data.name, data.surname, empresa, email, data.password)
            .then(data => {
                if (data) {
                    navigate('/login', { state: { admin: "¡Se ha registrado tu usuario administador con éxito! Ya podés iniciar sesión." } });
                }
                else {
                    navigate('/404')
                }
            })
            .catch((error) => {
                setError(error.message);
                setVisibility2(true);
            });
    }

    function togglePassword() {
        setPasswordShown(!passwordShown);
    };

    function handleClose() {
        setVisibility(false);
    }

    function handleClose2() {
        setVisibility2(false);
    }

    return (
        <div>
            <div className="container">
                <article className="centered">
                    <div>
                        {visibility ?
                            <div className="alertBuena">
                                <span className="closebtn" onClick={handleClose}>&times;</span>
                                <ul className='white listNone'>
                                    <li>{alertMensaje}</li>
                                </ul>
                            </div> : ''
                        }
                        {visibility2 ?
                            <div className="alert">
                                <span className="closebtn" onClick={handleClose2}>&times;</span>
                                <ul className='white listNone'>
                                    <li>{errorMensaje}</li>
                                </ul>
                            </div> : ''
                        }
                        <hgroup>
                            <h2>Regístra tu usuario administrador</h2>
                            <p>¿Estás registrado? <Link to="/login"><u>Inicia sesión</u></Link>.</p>
                        </hgroup>
                        <form onSubmit={handleSubmit(submitUsuario)}>
                            <label htmlFor='nombre' className='left'>Nombre</label>
                            <input id='nombre' type="text" name="nombre" placeholder="Nombre" aria-label="nombre" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}></input>
                            {
                                errors.name?.message ? <p className='errorYup'>{errors.name?.message}</p> : ''
                            }
                            <label htmlFor='surname' className='left'>Apellido</label>
                            <input id='surname' type="text" name="apellido" placeholder="Apellido" aria-label="apellido" className={errors.surname?.message ? 'redBorder' : ''} {...register("surname")}></input>
                            {
                                errors.surname?.message ? <p className='errorYup'>{errors.surname?.message}</p> : ''
                            }
                            <label htmlFor='password' className='left'>Contraseña</label>
                            <input id='password' type={passwordShown ? "text" : "password"} name="password" placeholder="Contraseña" aria-label="Password" className={errors.password?.message ? 'redBorder' : ''} {...register("password")}></input>
                            <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} onClick={togglePassword} className="ojoPassword" />
                            {
                                errors.password?.message ? <p className='errorYup'>{errors.password?.message}</p> : ''
                            }
                            <button type="submit" className="contrast">Registrarte</button>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default createAdmin