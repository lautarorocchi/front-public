import React, { useState, useEffect } from 'react'
import {
  Link, useNavigate
} from "react-router-dom";
import Loading from '../components/Loading';
import * as EmpresaServices from '../services/empresas.services.js'

function Discover() {
  const navigate = useNavigate()

  const [miEmpresa, setMiEmpresa] = useState(null)
  const [miRubro, setMiRubro] = useState(null)
  const [miSubrubro, setMiSubrubro] = useState(null)
  const [rubrosAsociados, setRubrosAsociados] = useState([])
  const [subrubrosAsociados, setSubrubrosAsociados] = useState([])

  const [estadoRubros, setEstadosRubros] = useState(true)
  const [estadoSubrubros, setEstadosSubrubros] = useState(false)
  const [estadoAmbos, setEstadosAmbos] = useState(false)

  const empresa = localStorage.getItem('empresa');

  useEffect(() => {
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
  }, [empresa])

  function filterRubro() {
    setEstadosRubros(true);
    setEstadosSubrubros(false);
    setEstadosAmbos(false);
  }

  function filterSubrubro() {
    setEstadosRubros(false);
    setEstadosSubrubros(true);
    setEstadosAmbos(false);
  }

  function filterAmbos(){
    setEstadosRubros(false);
    setEstadosSubrubros(false)
    setEstadosAmbos(true);
  }

  return (
    <div className='container'>
      <article className='login pb-2'>
        <hgroup>
          <h2>Descubre Más Empresas</h2>
          <h3><div>En esta sección podrás observar empresas parecidas a la tuya, puedes averiguar sobre ellas y contactarlas.</div> ¿Quieres administrar tus productos? <Link to='/admin'><u>Volver al Panel.</u></Link></h3>
        </hgroup>
        <div>
          <article>
            <h2>Mi Empresa</h2>
            {(miEmpresa) ?
              <ul key={miEmpresa.id} className='listNone'>
                <li><strong>Nombre de la empresa:</strong> {miEmpresa.name}.</li>
                <li><strong>Descripción:</strong> {miEmpresa.descripcion}.</li>
                <li><strong>Email:</strong> {miEmpresa.email}.</li>
                <li><strong>Localidad:</strong> {miEmpresa.localidad}.</li>
                <li><strong>Rubro:</strong> {miRubro}.</li>
                <li><strong>Subrubro:</strong> {miSubrubro}.</li>
              </ul>
              : <Loading />}
          </article>
        </div>
        <article>
          <nav>
            {(estadoRubros) ? <h4>Empresas Con Tu Mismo Rubro</h4> : ''}
            {(estadoSubrubros) ? <h4>Empresas Con Mismo Subrubro</h4> : ''}
            {(estadoAmbos) ? <h4>Empresas Con Tu Misma Categoria</h4> : ''}
            <ul>
              <li>
                <details role="list" dir="rtl">
                  <summary aria-haspopup="listbox" role="link">Filtro</summary>
                  <ul role="listbox">
                    <li><span onClick={filterRubro}><a>Mismo Rubro</a></span></li>
                    <li><span onClick={filterSubrubro}><a>Mismo Subrubro</a></span></li>
                    <li><span onClick={filterAmbos}><a>Mismo Rubro y Subrubro</a></span></li>
                  </ul>
                </details>
              </li>
            </ul>
          </nav>
          {(estadoRubros) ?
            (rubrosAsociados.map(empresasAsociadasRubro =>
              (empresasAsociadasRubro._id === empresa) ? "" :
                <article key={empresasAsociadasRubro.id}>
                  <hgroup>
                    <h4>{empresasAsociadasRubro.name}</h4>
                    <h5>Esta Empresa Comparte Tu Rubro.</h5>
                  </hgroup>
                  <ul>
                    <li>Descripción: {empresasAsociadasRubro.descripcion}</li>
                    <li>Email: {empresasAsociadasRubro.email}</li>
                    <li>Localidad: {empresasAsociadasRubro.localidad}</li>
                    <li>{empresasAsociadasRubro.img}</li>
                  </ul>
                  <button><a href={"mailto:" + empresasAsociadasRubro.email} className='mailto'>Enviar Mail</a></button>
                </article>
            )) : ""
          }

          {(estadoSubrubros) ?
            (subrubrosAsociados.map(empresasAsociadasRubro =>
              (empresasAsociadasRubro._id === empresa) ? "" :
                <article key={empresasAsociadasRubro.id}>
                  <hgroup>
                    <h4>{empresasAsociadasRubro.name}</h4>
                    <h5>Esta Empresa Comparte Tu Subrubro.</h5>
                  </hgroup>
                  <ul>
                    <li>Descripción: {empresasAsociadasRubro.descripcion}</li>
                    <li>Email: {empresasAsociadasRubro.email}</li>
                    <li>Localidad: {empresasAsociadasRubro.localidad}</li>
                    <li>{empresasAsociadasRubro.img}</li>
                  </ul>
                  <button><a href={"mailto:" + empresasAsociadasRubro.email} className='mailto'>Enviar Mail</a></button>
                </article>
            )) : ""
          }

          {(estadoAmbos) ?
            (subrubrosAsociados.map(empresasAsociadasRubro =>
              (empresasAsociadasRubro._id === empresa || empresasAsociadasRubro.subrubro === miSubrubro) ? "" :
                <article key={empresasAsociadasRubro.id}>
                  <hgroup>
                    <h4>{empresasAsociadasRubro.name}</h4>
                    <h5>Esta Empresa Comparte Tu Rubro y Subrubro.</h5>
                  </hgroup>
                  <ul>
                    <li>Descripción: {empresasAsociadasRubro.descripcion}</li>
                    <li>Email: {empresasAsociadasRubro.email}</li>
                    <li>Localidad: {empresasAsociadasRubro.localidad}</li>
                    <li>{empresasAsociadasRubro.img}</li>
                  </ul>
                  <button><a href={"mailto:" + empresasAsociadasRubro.email} className='mailto'>Enviar Mail</a></button>
                </article>
            )) : ""
          }
        </article>
      </article>
    </div>
  )
}

export default Discover
