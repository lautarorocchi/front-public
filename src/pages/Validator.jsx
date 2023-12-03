import { useEffect } from 'react';
import axios from 'axios';

const Validator = () => {
  useEffect(() => {
    const verificarEnlace = async () => {
      try {
        const id = window.location.pathname.split('/').pop();
        const url = `https://front-public.vercel.app/verificar/${id}`;
        const response = await axios.get(url);
      } catch (error) {
        console.error(error);
      }
    };

    verificarEnlace();
  }, []);

  return (
    <div>
      {/* Puedes agregar contenido adicional aquí */}
    </div>
  );
};

export default Validator;
