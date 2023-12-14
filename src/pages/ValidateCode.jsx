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
    code: yup.string().min(6, "El código debe tener 6 caracteres.").max(6, "El código debe tener 6 caracteres").required("Se necesita ingresa un código para reestablecer la contraseña."),
}).required();

function ValidateCode() {
    const [alertMensaje, setAlert] = useState([]);
    const [visibility, setVisibility] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(()=>{
        if(location.state != null){
          const{sendcode} = location.state;
          setAlert(sendcode);
          setVisibility(true);
        }
      }, [])

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
                        <div className="alertBuena">
                            <span className="closebtn" onClick={handleClose}>&times;</span>
                            <ul className='white listNone'>
                                <li>{alertMensaje}</li>
                            </ul>
                        </div> : ''
                    }
                    <hgroup>
                        <h2>Verficar el codigo de validación</h2>
                        <p className="message">Ingresa el código de 6 digitos que se ha enviado a tu mail para reestablecer tu contraseña.</p>
                    </hgroup>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className='left'>Código</label>
                        <input placeholder="Ingresa el código recibido" type="text" name="code" pattern="[A-Za-z0-9()_.'-]+" className={errors.code?.message ? 'redBorder' : ''} {...register("code")}></input>
                        {
                            errors.code?.message ? <p className='errorYup'>{errors.code?.message}</p> : ''
                        }
                        <button type="submit" className="contrast color-especial" role="button">Validar código</button>
                    </form>
                </article>
            </div>
        </div>
    )
}

export default ValidateCode
