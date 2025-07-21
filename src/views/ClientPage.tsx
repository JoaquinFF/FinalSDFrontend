import { useAuth0 } from "@auth0/auth0-react";
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

const ClientPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [peliculasPrivadas, setPeliculasPrivadas] = useState<Pelicula[]>([]);
  const [peliculasPublicas, setPeliculasPublicas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agregandoPelicula, setAgregandoPelicula] = useState<number | null>(null);

  // Obtener películas privadas del usuario
  const fetchPeliculasPrivadas = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/private/peliculas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPeliculasPrivadas(response.data);
    } catch (error) {
      console.error("Error al obtener películas privadas:", error);
      setError("Error al cargar tu lista de películas");
    }
  };

  // Obtener películas públicas
  const fetchPeliculasPublicas = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/public/peliculas`
      );
      setPeliculasPublicas(response.data);
    } catch (error) {
      console.error("Error al obtener películas públicas:", error);
    }
  };

  // Agregar película a la lista privada
  const agregarPeliculaALista = async (peliculaId: number) => {
    try {
      console.log("Agregando película: " + peliculaId);
      setAgregandoPelicula(peliculaId);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/private/peliculas/agregar/${peliculaId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Recargar la lista privada
      await fetchPeliculasPrivadas();
    } catch (error) {
      console.error("Error al agregar película:", error);
      alert("Error al agregar la película a tu lista");
    } finally {
      setAgregandoPelicula(null);
    }
  };

  // Eliminar película de la lista privada
  const eliminarPeliculaDeLista = async (peliculaId: number) => {
    try {
      console.log("Eliminando película: " + peliculaId);
      setAgregandoPelicula(peliculaId);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      await axios.delete(
        `${import.meta.env.VITE_API_SERVER_URL}/private/peliculas/remover/${peliculaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Recargar la lista privada
      await fetchPeliculasPrivadas();
    } catch (error) {
      console.error("Error al eliminar película:", error);
      alert("Error al eliminar la película de tu lista");
    } finally {
      setAgregandoPelicula(null);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchPeliculasPrivadas(),
          fetchPeliculasPublicas()
        ]);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [getAccessTokenSilently]);

  // Verificar si una película ya está en la lista privada
  const peliculaYaEnLista = (peliculaId: number) => {
    return peliculasPrivadas.some(p => p.id === peliculaId);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="mb-4 text-xl sm:text-2xl font-bold text-center">Mi Lista de Películas</h1>
      
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

      {/* Sección de Películas Privadas */}
      <div className="w-full mb-8">
        <h2 className="mb-6 text-lg sm:text-xl font-semibold text-center text-gray-800">
          Mi Lista Personal
        </h2>
        
        {!loading && !error && peliculasPrivadas.length === 0 && (
          <div className="p-4 sm:p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-800">Tu lista está vacía</h3>
            <p className="text-sm sm:text-base text-gray-600">¡Agrega películas de la lista pública para comenzar!</p>
          </div>
        )}
        
        {!loading && !error && peliculasPrivadas.length > 0 && (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {peliculasPrivadas.map((pelicula) => (
              <div
                key={pelicula.id}
                className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-200"
              >
                {/* Header con gradiente verde */}
                <div className="relative h-24 sm:h-32 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500">
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
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
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
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
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
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        En tu lista
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm(`¿Estás seguro de que quieres eliminar "${pelicula.titulo}" de tu lista?`)) {
                            eliminarPeliculaDeLista(pelicula.id);
                          }
                        }}
                        disabled={agregandoPelicula === pelicula.id}
                        className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {agregandoPelicula === pelicula.id ? (
                          <>
                            <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Eliminar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Películas Públicas */}
      <div className="w-full">
        <h2 className="mb-6 text-lg sm:text-xl font-semibold text-center text-gray-800">
          Películas Disponibles para Agregar
        </h2>
        
        {!loading && peliculasPublicas.filter(pelicula => !peliculaYaEnLista(pelicula.id)).length === 0 && (
          <div className="p-4 text-center text-gray-500 bg-gray-100 rounded">
            {peliculasPublicas.length > 0 
              ? "Ya tienes todas las películas disponibles en tu lista" 
              : "No hay películas públicas disponibles"
            }
          </div>
        )}
        
        {!loading && peliculasPublicas.length > 0 && (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {peliculasPublicas
              .filter(pelicula => !peliculaYaEnLista(pelicula.id))
              .map((pelicula) => (
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

                  {/* Botón de acción */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🖱️ BOTÓN CLICKEADO para película:", pelicula.id);
                        agregarPeliculaALista(pelicula.id);
                      }}
                      disabled={agregandoPelicula === pelicula.id}
                      className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto justify-center"
                    >
                      {agregandoPelicula === pelicula.id ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Agregando...
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Agregar a mi lista
                        </>
                      )}
                    </button>
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

export default ClientPage;
