import React, { useState, useEffect } from 'react'
import {
    Link, useNavigate, useLocation
} from "react-router-dom";
import * as UserServices from '../services/user.services.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object({
    email: yup.string().email("El email no es valido, revisa los datos.").required("Se necesita ingresar un Mail para ingresar al Panel de Control."),
}).required();

function ValidateCode() {
    const [errorMensaje, setError] = useState([]);
    const [visibility, setVisibility] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    function onSubmit(data) {
        UserServices.enviarCodigo(data.email)
            .then((response) => {
                console.log(response);

                navigate('/validar', { state: { login: "Se ha enviado un código a tu email para reestablecer la contraseña." } });
            })
            .catch((error) => {
                setError(error.message);
                setVisibility(true);
            });
    }

    function handleClose(){
        setVisibility(false);
      }

    return (
        <div>
            <div className='container'>
                <article className='centered'>
                    {visibility ?
                        <div className="alert">
                            <span className="closebtn" onClick={handleClose}>&times;</span>
                            <ul className='white listNone'>
                                <li>{errorMensaje}</li>
                            </ul>
                        </div> : ''
                    }
                    <hgroup>
                        <h2>Verficar el codigo de validación</h2>
                        <p className="message">Ingresa el código de 6 digitos que se ha enviado a tu mail para reestablecer tu contraseña.</p>
                    </hgroup>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className='left'>Email</label>
                        <input type="text" placeholder="Email" aria-label="email" className={errors.email?.message ? 'redBorder' : ''} {...register("email")}></input>
                        {
                            errors.email?.message ? <p className='errorYup'>{errors.email?.message}</p> : ''
                        }
                        <button type="submit" className="contrast color-especial" role="button">Validar código</button>
                    </form>
                </article>
            </div>
        </div>
    )
}

export default ValidateCode
