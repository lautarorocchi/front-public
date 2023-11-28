import React, { useState, useEffect } from 'react'
import {
  Link, useNavigate
} from "react-router-dom";
import Loading from '../components/Loading';
import * as EmpresaServices from '../services/empresas.services.js'

function Discover() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("");

  const [empresas, setEmpresas] = useState([]);
  const [miEmpresa, setMiEmpresa] = useState(null)
  const [miRubro, setMiRubro] = useState(null)
  const [miSubrubro, setMiSubrubro] = useState(null)
  const [rubrosAsociados, setRubrosAsociados] = useState([])
  const [subrubrosAsociados, setSubrubrosAsociados] = useState([])

  const [estadoEmpresa, setEstadoEmpresa] = useState(true)
  const [estadoRubros, setEstadosRubros] = useState(false)
  const [estadoSubrubros, setEstadosSubrubros] = useState(false)
  const [estadoAmbos, setEstadosAmbos] = useState(false)

  const empresa = localStorage.getItem('empresa');

  useEffect(() => {
    EmpresaServices.findById(empresa)
      .then(data => {
        if (data) {
          setMiEmpresa(data);
          agregarEmpresas();
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

  function agregarEmpresas(){
    EmpresaServices.find()
    .then(empresas => {
      if(empresas){
        setEmpresas(empresas)
      }else{
        navigate('/404')
      }
    })
  }

  function filterTodas(){
    setEstadoEmpresa(true);
    setEstadosRubros(false);
    setEstadosSubrubros(false);
    setEstadosAmbos(false);
  }

  function filterRubro() {
    setEstadoEmpresa(false);
    setEstadosRubros(true);
    setEstadosSubrubros(false);
    setEstadosAmbos(false);
  }

  function filterSubrubro() {
    setEstadoEmpresa(false);
    setEstadosRubros(false);
    setEstadosSubrubros(true);
    setEstadosAmbos(false);
  }

  function filterAmbos(){
    setEstadoEmpresa(false);
    setEstadosRubros(false);
    setEstadosSubrubros(false)
    setEstadosAmbos(true);
  }

  function onChangeQuery(event) {
    setQuery(event.target.value);
  }


  return (
    <div className='container'>
      <article className='login pb-2'>
        <hgroup>
          <h1>Descubre más empresas</h1>
          <h3><div>En esta sección podés observar empresas parecidas a la tuya, averiguar sobre ellas y contactarlas.</div> ¿Querés ver tus productos? <Link to='/admin'><u>Ir al panel de control.</u></Link></h3>
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
                <li><strong>Tipo de empresa:</strong> {miRubro}.</li>
                <li><strong>Rubro:</strong> {miSubrubro}.</li>
              </ul>
              : <Loading />}
          </article>
        </div>
        <article>
        <div>
        </div>
          <nav>
            {(estadoEmpresa) ? <h4>Todas las empresas</h4> : ''}
            {(estadoRubros) ? <h4>Empresas con tu mismo tipo de empresa</h4> : ''}
            {(estadoSubrubros) ? <h4>Empresas con tu mismo rubro</h4> : ''}
            {(estadoAmbos) ? <h4>Empresas con tu misma categoría</h4> : ''}
            <ul>
              <li>
                <details role="list" dir="rtl">
                  <summary aria-haspopup="listbox" role="link">Filtro</summary>
                  <ul role="listbox">
                    <li><span onClick={filterTodas}><a>Todas</a></span></li>
                    <li><span onClick={filterRubro}><a>Mismo tipo</a></span></li>
                    <li><span onClick={filterSubrubro}><a>Mismo rubro</a></span></li>
                    <li><span onClick={filterAmbos}><a>Mismo tipo y rubro</a></span></li>
                  </ul>
                </details>
              </li>
              <input type="search" placeholder="Buscar empresas" onChange={onChangeQuery}></input>
            </ul>
          </nav>

          {(estadoEmpresa) ?
            (empresas.filter(empresita => empresita.name.toLowerCase().includes(query.toLowerCase())).map((empresita, index)=>
                (empresita._id === empresa) ? "" :
                <article key={index}>
                  <hgroup>
                    <h4>{empresita.name}</h4>
                    <h5>Esta empresa se encuentra registrada en la categoria "Todas", para mas información, utilizá el filtro de búsqueda.</h5>
                  </hgroup>
                  <ul>
                    <li>Descripción: {empresita.descripcion}</li>
                    <li>Email: {empresita.email}</li>
                    <li>Localidad: {empresita.localidad}</li>
                  </ul>
                  <button className='color-especial'><a href={"mailto:" + empresita.email} className='mailto'>Enviar mail</a></button>
                </article>
            )) : ""
          }
          
          {(estadoRubros) ?
            (rubrosAsociados.filter(empresasAsociadasRubro => empresasAsociadasRubro.name.toLowerCase().includes(query.toLowerCase())).map((empresasAsociadasRubro,index) =>
              (empresasAsociadasRubro._id === empresa) ? "" :
                <article key={empresasAsociadasRubro.id}>
                  <hgroup>
                    <h4>{empresasAsociadasRubro.name}</h4>
                    <h5>Esta empresa comparte tu tipo de categoría juridica.</h5>
                  </hgroup>
                  <ul>
                    <li>Descripción: {empresasAsociadasRubro.descripcion}</li>
                    <li>Email: {empresasAsociadasRubro.email}</li>
                    <li>Localidad: {empresasAsociadasRubro.localidad}</li>
                  </ul>
                  <button className='color-especial'><a href={"mailto:" + empresasAsociadasRubro.email} className='mailto'>Enviar mail</a></button>
                </article>
            )) : ""
          }

          {(estadoSubrubros) ?
            (subrubrosAsociados.filter(subrubrinAsociado => subrubrinAsociado.name.toLowerCase().includes(query.toLowerCase())).map((subrubrinAsociado, index) => 
              (subrubrinAsociado._id === empresa) ? "" :
                <article key={subrubrinAsociado.id}>
                  <hgroup>
                    <h4>{subrubrinAsociado.name}</h4>
                    <h5>Esta empresa comparte tu rubro.</h5>
                  </hgroup>
                  <ul>
                    <li>Descripción: {subrubrinAsociado.descripcion}</li>
                    <li>Email: {subrubrinAsociado.email}</li>
                    <li>Localidad: {subrubrinAsociado.localidad}</li>
                  </ul>
                  <button className='color-especial'><a href={"mailto:" + subrubrinAsociado.email} className='mailto'>Enviar mail</a></button>
                </article>
            )) : ""
          }

          {(estadoAmbos) ?
            (subrubrosAsociados.filter(empresasAsociadasRubro => empresasAsociadasRubro.name.toLowerCase().includes(query.toLowerCase())).map((empresasAsociadasRubro, index) =>
              (empresasAsociadasRubro._id === empresa || empresasAsociadasRubro.subrubro === miSubrubro) ? "" :
                <article key={empresasAsociadasRubro.id}>
                  <hgroup>
                    <h4>{empresasAsociadasRubro.name}</h4>
                    <h5>Esta empresa comparte tu tipo de institución y rubro.</h5>
                  </hgroup>
                  <ul>
                    <li>Descripción: {empresasAsociadasRubro.descripcion}</li>
                    <li>Email: {empresasAsociadasRubro.email}</li>
                    <li>Localidad: {empresasAsociadasRubro.localidad}</li>
                  </ul>
                  <button className='color-especial'><a href={"mailto:" + empresasAsociadasRubro.email} className='mailto'>Enviar mail</a></button>
                </article>
            )) : ""
          }
        </article>
      </article>
    </div>
  )
}

export default Discover
