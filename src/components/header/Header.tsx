import { Link } from "react-router-dom";
import RegistroButton from "./RegistroButton";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import ProfileButton from "./ProfileButton";

const Header = () => {
  const { isAuthenticated, user } = useAuth0();

  // Extraer roles del claim personalizado
  const roles = user?.["https://hola/roles"] || [];
  console.log(roles);
  const isAdmin = roles.includes("ADMIN");
  const isCliente = roles.includes("CLIENTE");

  return (
    <>
      <div className="bg-white lg:pb-12">
        <div className="px-4 mx-auto max-w-screen-2xl md:px-8">
          <header className="flex items-center justify-between py-4 md:py-8">
            {/* logo - start */}
            <Link
              to="/"
              className="text-black-800 inline-flex items-center gap-2.5 text-2xl font-bold md:text-3xl"
              aria-label="logo"
            >
              CineApp
            </Link>
            {/* logo - end */}
            {/* nav - start */}
            <nav className="gap-12 lg:flex">
              <Link
                to="/"
                className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700"
              >
                Inicio
              </Link>
              {isAuthenticated && (isCliente || isAdmin) && (
                <Link
                  to="/cliente"
                  className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700"
                >
                  Mi Lista
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700"
                >
                  Editar Películas
                </Link>
              )}
            </nav>
            {/* nav - end */}
            {/* buttons - start */}
            <div className="-ml-8 flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
              {isAuthenticated ? (
                <>
                  <LogoutButton />
                  <ProfileButton />
                </>
              ) : (
                <>
                  <RegistroButton />
                </>
              )}
            </div>
            {/* buttons - end */}
          </header>
        </div>
      </div>
    </>
  );
};

export default Header;
