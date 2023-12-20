import React, { useState, useEffect } from 'react'
import {
    Link, useNavigate, useLocation
} from "react-router-dom";
import Loading from '../components/Loading';
import * as EmpresaServices from '../services/empresas.services.js'
import * as UserServices from '../services/user.services.js'
import Access from '../components/Access.jsx';
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


function EditEmpresa() {
    const [rubros, setRubros] = useState([]);
    const [subrubros, setSubrubros] = useState([]);
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const id = localStorage.getItem('user');
    const [certificarAcceso, setCertificarAcceso] = useState(false);
    let defaultValues = {};
    const navigate = useNavigate()
    const location = useLocation();
    const [visibilidad, setVisibilidad] = useState(false);
    const [alertMensaje, setAlertMensaje] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [empresas, setEmpresas] = useState([]);
    const [miEmpresa, setMiEmpresa] = useState(null)
    const [miRubro, setMiRubro] = useState(null)
    const [miSubrubro, setMiSubrubro] = useState(null)
    const [rubrosAsociados, setRubrosAsociados] = useState([])
    const [subrubrosAsociados, setSubrubrosAsociados] = useState([])
    const empresa = localStorage.getItem('empresa');

    const onSubmit = async (data) => {
        EmpresaServices.editarEmpresa(empresa, data.name, data.descripcion, data.email, data.localidad, data.rubro, data.subrubro)
          .then(data => {
            if (data) {
              navigate('/descubre', { state: { editada: "Se ha editado tu empresa con éxito." } })
            }
            else {
              navigate('/404')
            }
          })
          .catch((error) => {
            alert('La Empresa no se pudo editar');
          });
    
      };

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, []);

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

    useEffect(() => {
        validarAcceso(id);
        EmpresaServices.findById(empresa)
            .then(data => {
                if (data) {
                    setMiEmpresa(data);
                    defaultValues.name = data.name;
                    defaultValues.descripcion = data.descripcion;
                    defaultValues.email = data.email;
                    defaultValues.localidad = data.localidad;
                    defaultValues.rubro = data.rubro;
                    defaultValues.subrubro = data.subrubro;
                    reset({ ...defaultValues });
                    if (data.rubro) {
                        EmpresaServices.findByRubro(data.rubro)
                            .then(data => {
                                if (data) {
                                    setMiRubro(data[0].rubro[0].empresa);
                                }
                                else {
                                    navigate('/404')
                                }
                            })
                    }
                    if (data.subrubro) {
                        EmpresaServices.findBySubrubro(data.subrubro)
                            .then(data => {
                                if (data) {
                                    setMiSubrubro(data[0].subrubros[0].empresa);
                                }
                                else {
                                    navigate('/404')
                                }
                            })
                    }
                }
                else {
                    navigate('/404')
                }
                if (data.rubro) {
                    EmpresaServices.asociadasRubros(data.rubro)
                        .then(data => {
                            if (data) {
                                setRubrosAsociados(data);
                            }
                            else {
                                navigate('/404')
                            }
                        })
                }
                if (data.subrubro) {
                    EmpresaServices.asociadasSubrubros(data.subrubro)
                        .then(data => {
                            if (data) {
                                setSubrubrosAsociados(data);
                            }
                            else {
                                navigate('/404')
                            }
                        })
                }
            })
            .catch(err => {
                navigate('/404')
            })
    }, [id, empresa])

    function validarAcceso(id) {
        UserServices.findById(id)
            .then(data => {
                if (data.verified == true) {
                    setCertificarAcceso(true)
                } else {
                    setCertificarAcceso(false)
                }
            })
    }


    return (
        <div className='container'>
            <article className='centered'>
                <div>
                    <hgroup>
                        <h2>Edíta tu empresa</h2>
                        <h3>¿No querés editar tu empresa? Volve al <Link to="/admin"><u>Panel de control</u></Link>.</h3>
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
                        <input type="text" id='email' name="email" placeholder="Email" aria-label="Login" className={errors.email?.message ? 'redBorder' : ''} {...register("email")} disabled></input>
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

                        <button type="submit" className="contrast">Editar empresa</button>
                    </form>
                </div>
            </article>
        </div>
    )
}

export default EditEmpresa
