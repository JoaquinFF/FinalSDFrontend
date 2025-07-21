import { useAuth0 } from "@auth0/auth0-react";

const ClientProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center mt-4 text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Información de tu cuenta</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta de información básica */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name || 'Foto de perfil'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-white font-bold">
                      {user?.name?.charAt(0) || user?.nickname?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {user?.nickname || user?.name}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Usuario Activo
                </span>
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Información Personal</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de Usuario
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900 font-medium">{user?.nickname || 'No disponible'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900 font-medium">{user?.name || 'No disponible'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900 font-medium">{user?.email || 'No disponible'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Usuario
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900 font-mono text-xs break-all">{user?.sub || 'No disponible'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Verificado
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.email_verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user?.email_verified ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proveedor de Autenticación
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900 font-medium capitalize">
                        {user?.sub?.split('|')[0] || 'Auth0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Requerido</h2>
        <p className="text-gray-600 mb-6">
          Presiona Log In para ver información de tu perfil.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Necesitas iniciar sesión para acceder a esta página
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;
