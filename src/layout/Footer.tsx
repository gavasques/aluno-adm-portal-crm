
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-base font-semibold text-portal-dark mb-2">Portal Edu</h3>
            <p className="text-xs text-gray-600">
              Portal de fornecedores, parceiros e ferramentas para e-commerce.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-portal-dark mb-2">Links Úteis</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/quem-somos" className="text-xs text-gray-600 hover:text-portal-primary transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <a 
                  href="https://curso.example.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-gray-600 hover:text-portal-primary transition-colors"
                >
                  Plataforma do Curso
                </a>
              </li>
              <li>
                <a 
                  href="https://comunidade.example.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-portal-primary transition-colors"
                >
                  Comunidade
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-portal-dark mb-2">Redes Sociais</h3>
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com/portaledu" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-1.5 rounded-full bg-portal-light text-portal-primary hover:bg-portal-secondary hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://youtube.com/portaledu" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-1.5 rounded-full bg-portal-light text-portal-primary hover:bg-portal-secondary hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-border text-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Portal Edu. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
