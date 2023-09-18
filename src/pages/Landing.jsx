import React from 'react'
import imgEmpresa from '../assets/img/admin-empresa.jpg'
import imgEfectivo from '../assets/img/sistema-efectivo.jpg'
import imgUser from '../assets/img/user-ui.png'
import imgSecure from '../assets/img/config-segura.jpg'

function Landing() {
    return (
        <div className='landing main'>
            
            <div className="container">
                <div className="grid">

                    <section>
                        <hgroup>
                            <h2>Sobre Nosotros</h2>
                            <h3><div><strong>¡Bienvenido a Stack Ux!</strong> </div> La Aplicación que lo ayudará a administrar sus emprendimientos.</h3>
                        </hgroup>
                        <p><strong>Stack Ux es una empresa que se diseñó para ayudar a las pymes a tener un respaldo digital</strong>  que les permita tener la tranquilidad de sentirse resguardados teniendo un control del Stock que disponemos.</p>
                        <figure>
                            <img src={imgEmpresa} alt="Administra tu empresa"></img>
                            <figcaption>Maneja tu empresa con Stack Ux.</figcaption>
                        </figure>
                        <h3>Nuestros Servicios</h3>
                        <p>Tendrás la posibilidad de administrar los productos de tu empresa, que los usuarios pueden realizarte pedidos y descubrir empresa de MANERA GRATUITA, con esta opción tendrás anuncios en tu app. Si obtienes el FORMATO PAGO, no tendrás que ver anuncios.</p>
                        <h3>Explora empresas que pueden ayudar a tu crecimiento</h3>
                        <p>Vas a tener una sección en la aplicación donde podrás descubrir empresas de tu rubro para, por ejemplo contactarse para solicitar un producto que no produces y necesitas comprarlo.</p>
                    </section>

                    <aside>
                        <a href="#" aria-label="Sistema Efectivo"><img src={imgEfectivo} alt="Sistema Efectivo"></img></a>
                        <p>
                            <a>Sistema Rápido y Efectivo</a><br></br>
                            <small>Se ha realizado un sistema rápido con las ultimas tecnologias que brindan un sitio rapido, seguro y efectivo. Esto hace Stack Ux sea una de las mejores opciones del mercado.</small>
                        </p>
                        <a href="#" aria-label="Experiencia del usuario"><img src={imgUser} alt="Experiencia del usuario"></img></a>
                        <p>
                            <a>Experiencia Del <br></br> Usuario Personalizada</a><br></br>
                            <small>Ofrecemos la posibilidad de crear tu usuario de administrador anexando tu empresa, esto te permitirá administrar y recibir pedidos de clientes.</small>
                        </p>
                        <a href="#" aria-label="Configuración Segura"><img src={imgSecure} alt="Configuración Segura"></img></a>
                        <p>
                            <a>Configuración<br></br> Simple y Segura</a><br></br>
                            <small>La Configuración del sistema es simple y esta resguardada por un sistema de seguridad cifrado. De esta manera podrás manejar tu información de manera segura y guardarla de manera digital.</small>
                        </p>
                    </aside>

                </div>
            </div>
        </div>
    )
}

export default Landing
