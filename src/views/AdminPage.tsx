import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Pelicula {
  id: number;
  titulo: string;
  director: string;
  año: number;
  genero?: string;
  descripcion?: string;
  esPublica: boolean;
}

interface PeliculaForm {
  titulo: string;
  director: string;
  año: number;
  genero: string;
  descripcion: string;
  esPublica: boolean;
}

const AdminPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPelicula, setEditingPelicula] = useState<Pelicula | null>(null);
  const [formData, setFormData] = useState<PeliculaForm>({
    titulo: "",
    director: "",
    año: new Date().getFullYear(),
    genero: "Sin género",
    descripcion: "Sin descripción",
    esPublica: true,
  });
  const navigate = useNavigate();
  // Obtener todas las películas
  const fetchPeliculas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/admin/peliculas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPeliculas(response.data);
    } catch (error: any) {
      console.error("Error al obtener películas:", error);
      setError("Error al cargar las películas");
      if(error.request.status === 403) {
        setError("No tienes permisos para acceder a esta página");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva película
  const crearPelicula = async (data: PeliculaForm) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/admin/peliculas`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          
        }
      );

      await fetchPeliculas();
      resetForm();
      alert("Película creada exitosamente");
    } catch (error) {
      console.error("Error al crear película:", error);
      alert("Error al crear la película");
    }
  };

  // Actualizar película
  const actualizarPelicula = async (id: number, data: PeliculaForm) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      await axios.put(
        `${import.meta.env.VITE_API_SERVER_URL}/admin/peliculas/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await fetchPeliculas();
      resetForm();
      alert("Película actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar película:", error);
      alert("Error al actualizar la película");
    }
  };

  // Eliminar película
  const eliminarPelicula = async (id: number, titulo: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${titulo}"?`)) {
      return;
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      await axios.delete(
        `${import.meta.env.VITE_API_SERVER_URL}/admin/peliculas/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchPeliculas();
      alert("Película eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar película:", error);
      alert("Error al eliminar la película");
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      titulo: "",
      director: "",
      año: new Date().getFullYear(),
      genero: "Sin género",
      descripcion: "Sin descripción",
      esPublica: true,
    });
    setEditingPelicula(null);
    setShowForm(false);
  };

  // Cargar datos para editar
  const cargarParaEditar = (pelicula: Pelicula) => {
    setFormData({
      titulo: pelicula.titulo,
      director: pelicula.director,
      año: pelicula.año,
      genero: pelicula.genero || "Sin género",
      descripcion: pelicula.descripcion || "Sin descripción",
      esPublica: pelicula.esPublica,
    });
    setEditingPelicula(pelicula);
    setShowForm(true);
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.director.trim()) {
      alert("Título y director son obligatorios");
      return;
    }

    if (formData.año < 1888) {
      alert("El año debe ser mayor o igual a 1888");
      return;
    }

    if (editingPelicula) {
      actualizarPelicula(editingPelicula.id, formData);
    } else {
      crearPelicula(formData);
    }
  };

  useEffect(() => {
    fetchPeliculas();
  }, [getAccessTokenSilently]);

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="mb-4 text-xl sm:text-2xl font-bold text-center">Panel de Administración</h1>
      
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

      {/* Botón para crear nueva película */}
      <div className="w-full mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          + Crear Nueva Película
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="w-full mb-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="mb-4 text-lg font-semibold">
            {editingPelicula ? "Editar Película" : "Crear Nueva Película"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director *
                </label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({...formData, director: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año *
                </label>
                <input
                  type="number"
                  value={formData.año}
                  onChange={(e) => setFormData({...formData, año: parseInt(e.target.value)})}
                  min="1888"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <input
                  type="text"
                  value={formData.genero}
                  onChange={(e) => setFormData({...formData, genero: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="esPublica"
                checked={formData.esPublica}
                onChange={(e) => setFormData({...formData, esPublica: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="esPublica" className="ml-2 text-sm text-gray-700">
                Película pública
              </label>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {editingPelicula ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de películas */}
      <div className="w-full">
        <h2 className="mb-6 text-lg sm:text-xl font-semibold text-center text-gray-800">
          Todas las Películas ({peliculas.length})
        </h2>
        
        {!loading && !error && peliculas.length === 0 && (
          <div className="p-4 text-center text-gray-500 bg-gray-100 rounded">
            No hay películas registradas
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
                <div className={`relative h-24 sm:h-32 bg-gradient-to-br ${
                  pelicula.esPublica 
                    ? 'from-blue-500 via-purple-500 to-pink-500' 
                    : 'from-gray-500 via-gray-600 to-gray-700'
                }`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative flex items-center justify-center h-full">
                    <h3 className="px-2 sm:px-4 text-sm sm:text-xl font-bold text-white text-center leading-tight">
                      {pelicula.titulo}
                    </h3>
                  </div>
                  {!pelicula.esPublica && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                        Privada
                      </span>
                    </div>
                  )}
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
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-2 sm:ml-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Género</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{pelicula.genero || "Sin género"}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-2 sm:ml-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Año</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{pelicula.año}</p>
                      </div>
                    </div>

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
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => cargarParaEditar(pelicula)}
                        className="flex-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarPelicula(pelicula.id, pelicula.titulo)}
                        className="flex-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    </div>
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

export default AdminPage;
