import { useEffect } from 'react';
import axios from 'axios';

const Validator = () => {
  useEffect(() => {
    const verificarEnlace = async () => {
      try {
        const id = window.location.pathname.split('/').pop();
        const url = `http://localhost:5173/verificar/${id}`;
        const response = await axios.get(url);
        console.log(response.data);
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