
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-portal-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-portal-primary mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Oops! Página não encontrada</p>
        <p className="text-lg text-gray-500 max-w-md mx-auto mb-8">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="bg-portal-primary text-white hover:bg-portal-dark">
              Voltar à Página Inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
