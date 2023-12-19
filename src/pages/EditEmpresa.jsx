import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import {
    Link
} from "react-router-dom";

function EditEmpresa() {
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
