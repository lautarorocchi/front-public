import React, { useEffect, useState } from 'react'
import {
    Link, useLocation
} from "react-router-dom";
import * as userServices from '../services/user.services.js'
import * as EmpresaServices from '../services/empresas.services.js'
import { useNavigate } from 'react-router-dom'
import * as UserServices from '../services/user.services.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

/* Validacion Yup Registro */

const schema = yup.object({
    password: yup.string().min(6, "El Password debe tener al menos 6 caracteres.").required("Se necesita ingresa su contraseña para ingresar al Panel de Control."),
}).required();


function ResetPassword() {
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const code = localStorage.getItem('code');

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    function onSubmit(data) {
        UserServices.cambiarClave(code, data.password)
            .then((response) => {
                navigate('/login', { state: { change: "Se ha reestablecido tu contraseña, ya podes iniciar sesión con tu nueva clave." } });
            })
            .catch((error) => {
                setError(error.message);
                setVisibility2(true);
            });
    }

    function togglePassword() {
        setPasswordShown(!passwordShown);
    };

    return (
        <div>
            <div className='container'>
                <article className='centered'>
                    <hgroup>
                        <h2>Cambiar contraseña</h2>
                        <p className="message">Ingresa tu nueva contraseña, recuerda que no tiene que ser una clave ya utilizada en el sistema.</p>
                    </hgroup>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className='left'>Contraseña</label>
                        <input type={passwordShown ? "text" : "password"} placeholder="Contraseña" aria-label="Password" className={errors.password?.message ? 'redBorder' : ''} {...register("password")}></input>
                        <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} onClick={togglePassword} className="ojoPassword" />
                        {
                            errors.password?.message ? <p className='errorYup'>{errors.password?.message}</p> : ''
                        }
                        <button type="submit" className="contrast color-especial" role="button">Aceptar</button>
                    </form>
                </article>
            </div>
        </div>
    )
}

export default ResetPassword
