import axios from "axios";
import { useEffect, useState } from "react";

interface Pelicula {
  id: number;
  titulo: string;
  descripcion?: string;
  genero?: string;
  anio?: number;
  director?: string;
}

const Home = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVER_URL}/public/peliculas`
        );

        console.log(response);
        setPeliculas(response.data);
      } catch (error) {
        console.error(error);
        setError("Error al cargar las películas");
      } finally {
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Sección de Películas */}
      <div className="w-full mt-8">
        <h2 className="mb-6 text-lg sm:text-xl font-semibold text-center text-gray-800">
          Nuestro Catálogo
        </h2>
        
        {loading && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        
        {!loading && !error && peliculas.length === 0 && (
          <div className="p-4 text-center text-gray-500 bg-gray-100 rounded">
            No hay películas disponibles
          </div>
        )}
        
        {!loading && !error && peliculas.length > 0 && (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {peliculas.map((pelicula) => (
              <div
                key={pelicula.id}
                className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Header con gradiente */}
                <div className="relative h-24 sm:h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative flex items-center justify-center h-full">
                    <h3 className="px-2 sm:px-4 text-sm sm:text-xl font-bold text-white text-center leading-tight">
                      {pelicula.titulo}
                    </h3>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-3 sm:p-6">
                  {pelicula.descripcion && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {pelicula.descripcion}
                      </p>
                    </div>
                  )}

                  {/* Información de la película */}
                  <div className="space-y-2 sm:space-y-3">
                    {pelicula.genero && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Género</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">{pelicula.genero}</p>
                        </div>
                      </div>
                    )}

                    {pelicula.anio && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Año</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">{pelicula.anio}</p>
                        </div>
                      </div>
                    )}

                    {pelicula.director && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Director</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">{pelicula.director}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badge de ID */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ID: {pelicula.id}
                    </span>
                  </div>
                </div>

                {/* Efecto hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
