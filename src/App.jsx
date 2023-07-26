import {useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import '@picocss/pico'
import './App.css'
import Header from './components/Header'
import Landing from './pages/Landing'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import ProductDetail from './pages/ProductDetail'
import Create from './pages/Create'
import EditProduct from './pages/EditProduct'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreateEmpresa from './pages/CreateEmpresa'
import EditProfile from './pages/EditProfile'
import Page404 from './pages/Page404'


function RutaPrivada({ esAutenticado, element, ...props }) {
  return esAutenticado ? element : <Navigate to={'/login'} />;
}

function RutaAutenticada({ esAutenticado, element, ...props }) {
  return esAutenticado ? <Navigate to={'/admin'}/> : element;
}

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate, Navigate
} from "react-router-dom";


function App() {

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [esAutenticado, setAutenticado] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setAutenticado(true);
    }
  }, [])

  useEffect(() => {
    if (token) {
      setAutenticado(true)
    } else {
      setAutenticado(false)
    }
  }, [token])

  useEffect(() => {
    if (esAutenticado) {
      navigate('/admin');
    }
    else {
      navigate('/login');
    }
  }, [esAutenticado]);


  function onLogin(user, token) {
    localStorage.setItem('user', user._id);
    localStorage.setItem('empresa', user.empresa);
    localStorage.setItem('token', token);
    setUsuario(user);
    setAutenticado(true);
  }

  return (
    <>
    <Header></Header>
    <main>
    <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<RutaAutenticada esAutenticado={esAutenticado} element={<Login onLogin={onLogin}/>}/>} />
          <Route path="/registro" element={<RutaAutenticada esAutenticado={esAutenticado} element={<Register />} />} />
          <Route path="/empresa/crear" element={<RutaAutenticada esAutenticado={esAutenticado} element={<CreateEmpresa />} />} />
          <Route path="/admin" element={<RutaPrivada esAutenticado={esAutenticado} element={<Admin />} />} />
          <Route path="/producto/crear" element={<RutaPrivada esAutenticado={esAutenticado} element={<Create />} />} />
          <Route path="/producto/:id" element={<RutaPrivada esAutenticado={esAutenticado} element={<ProductDetail />} />} />
          <Route path="/productos/:id" element={<RutaPrivada esAutenticado={esAutenticado} element={<EditProduct />} />} />
          <Route path="/descubre" element={<RutaPrivada esAutenticado={esAutenticado} element={<Discover />} />}/>
          <Route path="/perfil" element={<RutaPrivada esAutenticado={esAutenticado} element={<Profile />} />}/>
          <Route path="/perfil/editar" element={<RutaPrivada esAutenticado={esAutenticado} element={<EditProfile />} />}/>
          <Route path="*" element={<Page404/>} />
          <Route path="/404" element={<Page404/>} />
        </Routes>
    </main>
   <Footer></Footer>

    </>
  )
}

export default App
