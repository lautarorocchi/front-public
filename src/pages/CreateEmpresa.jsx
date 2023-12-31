import React, { useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";
import * as EmpresaServices from '../services/empresas.services.js'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'


const schema = yup.object({
  name: yup.string().required("Se necesita ingresar un nombre para crear una empresa."),
  descripcion: yup.string().required("Se necesita ingresar una descripción para crear una empresa."),
  email: yup.string().email("El mail no es valido, revisa los datos.").required("Se necesita ingresar un Mail para ingresar al Panel de Control."),
  localidad: yup.string().required("Se necesita ingresar una localidad para crear una empresa."),
  rubro: yup.string().required("Se necesita ingresar el rubro de la empresa para crearla."),
  subrubro: yup.string().required("Se necesita ingresar el subrubro de la empresa para crearla."),
}).required();

function CreateEmpresa() {
  const navigate = useNavigate();
  const [rubros, setRubros] = useState([]);
  const [subrubros, setSubrubros] = useState([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    EmpresaServices.crearEmpresa(data.name, data.descripcion, data.email, data.localidad, data.rubro, data.subrubro)
      .then(data => {
        if (data) {
          localStorage.setItem('empresa', data._id);
          localStorage.setItem('email', data.email);
          navigate('/registro-admin', { state: { admin: "Se ha registrado tu empresa con éxito, creá un usuario administrador para poder iniciar sesión ." } })
        }
        else {
          navigate('/404')
        }
      })
      .catch((error) => {
        alert('La Empresa no se pudo crear');
      });

  };


  useEffect(() => {
    EmpresaServices.findTipos()
      .then(data => {
        if (data) {
          setRubros(data[0].rubro)
          setSubrubros(data[0].subrubros)
        }
        else {
          navigate('/404')
        }
      })
      .catch(err => {
        navigate('/404')
      })
  }, [])

  return (
    <div>
      <div className="container">
        <article className="centered">
          <div>
            <hgroup>
              <h2>Registrá una empresa</h2>
              <h3><div>Registrá una nueva empresa para anexarla a tu usuario, </div>¿Tu empresa ya está registrada? <Link to="/registro"><u>Registrate</u></Link>.<br></br> ¿Ya tenés usuario? <Link to="/login"><u>Inicia Sesión</u></Link>.</h3>
            </hgroup>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor='nombre' className='left'>Nombre de la empresa</label>
              <input type="text" name="name" placeholder="Nombre" aria-label="nombre" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}></input>
              {
                errors.name?.message ? <p className='errorYup'>{errors.name?.message}</p> : ''
              }
              <label htmlFor='descripcion' className='left'>Descripción</label>
              <textarea type="text" id="descripcion" placeholder="Agregar Descripción" name="descripcion" className={errors.descripcion?.message ? 'redBorder' : ''} {...register("descripcion")}></textarea>
              {
                errors.descripcion?.message ? <p className='errorYup'>{errors.descripcion?.message}</p> : ''
              }
              <label htmlFor='email' className='left'>Email</label>
              <input type="text" id='email' name="email" placeholder="Email" aria-label="Login" className={errors.email?.message ? 'redBorder' : ''} {...register("email")}></input>
              {
                errors.email?.message ? <p className='errorYup'>{errors.email?.message}</p> : ''
              }
              <label htmlFor='localidad' className='left'>Localidad</label>
              <input type="text" name="localidad" placeholder="Localidad" aria-label="Login" className={errors.localidad?.message ? 'redBorder' : ''}  {...register("localidad")}></input>
              {
                errors.localidad?.message ? <p className='errorYup'>{errors.localidad?.message}</p> : ''
              }
              <label htmlFor='rubro' className='left'>Tipo de empresa</label>
              <select {...register("rubro")}>
                <option value="" disabled selected>Elige un tipo</option>
                {
                  rubros.map(rubro =>
                    <option key={rubro.id} value={rubro.id}>{rubro.empresa}</option>
                  )
                }
              </select>
              {
                errors.rubro?.message ? <p className='errorYup'>{errors.rubro?.message}</p> : ''
              }
              <label htmlFor='subrubro' className='left'>Rubro</label>
              <select {...register("subrubro")}>
                <option value="" disabled selected>Elige un rubro</option>
                {
                  subrubros.map(subrubro =>
                    <option key={subrubro.id} value={subrubro.id}>{subrubro.empresa}</option>
                  )
                }
              </select>
              {
                errors.subrubro?.message ? <p className='errorYup'>{errors.subrubro?.message}</p> : ''
              }

              <button type="submit" className="contrast">Registrar empresa</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  )
}

export default CreateEmpresa
