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
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });

    const id = localStorage.getItem('user');
    const [certificarAcceso, setCertificarAcceso] = useState(false);
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
                </div>
            </article>
        </div>
    )
}

export default EditEmpresa
