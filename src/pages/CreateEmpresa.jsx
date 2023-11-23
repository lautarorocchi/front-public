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
    /*const formData = new FormData();
    formData.append("name", data.name);
    formData.append("descripcion", data.descripcion);
    formData.append("email", data.email);
    formData.append("img", data.file[0].name);
    formData.append("localidad", data.localidad);
    formData.append("rubro", data.rubro);
    formData.append("subrubro", data.subrubro);
    formData.append("file", data.file[0]);*/

    EmpresaServices.crearEmpresa(data.name, data.descripcion, data.email, data.file[0].name, data.localidad, data.rubro, data.subrubro)
      .then(data => {
        if (data) {
          navigate('/registro')
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
        <article className="grid login">
          <div>
            <hgroup>
              <h2>Regístra una empresa</h2>
              <h3><div>Registra una nueva empresa para anexarla a tu usuario, </div>¿Tu empresa ya esta registrada? <Link to="/registro"><u>Registrate</u></Link>.<br></br> ¿Ya tenes usuario? <Link to="/login"><u>Inicia Sesión</u></Link>.</h3>
            </hgroup>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor='nombre' className='left'>Nombre de la empresa</label>
              <input type="text" name="name" placeholder="Nombre" aria-label="nombre" className={errors.name?.message ? 'redBorder' : ''} {...register("name")}></input>
              {
                errors.name?.message ? <p className='errorYup'>{errors.name?.message}</p> : ''
              }
              <label htmlFor='description' className='left'>Descripción</label>
              <textarea type="text" id="descripcion" placeholder="Agregar Descripción" name="descripcion" className={errors.descripcion?.message ? 'redBorder' : ''} {...register("descripcion")}></textarea>
              {
                errors.descripcion?.message ? <p className='errorYup'>{errors.descripcion?.message}</p> : ''
              }
              <label htmlFor='email' className='left'>Email</label>
              <input type="text" name="email" placeholder="Email" aria-label="Login" className={errors.email?.message ? 'redBorder' : ''} {...register("email")}></input>
              {
                errors.email?.message ? <p className='errorYup'>{errors.email?.message}</p> : ''
              }
              <label htmlFor='empresa' className='left'>Localidad</label>
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
              <label htmlFor="file">Imagen
                <input type="file" accept='image/jpeg' {...register("file")} required></input>
              </label>

              <button type="submit" className="contrast">Registrarte</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  )
}

export default CreateEmpresa
